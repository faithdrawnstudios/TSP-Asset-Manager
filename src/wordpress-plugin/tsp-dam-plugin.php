<?php
/**
 * Plugin Name: TSP Digital Asset Manager
 * Description: Professional digital asset management system with public portal
 * Version: 1.0.0
 * Author: TSP Team
 * Text Domain: tsp-dam
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Plugin safety check
if (!function_exists('add_action')) {
    return;
}

class TSP_DAM_Plugin {
    private $version = '1.0.0';
    private $plugin_name = 'tsp-dam';
    
    public function __construct() {
        add_action('init', array($this, 'init'));
        register_activation_hook(__FILE__, array($this, 'activate'));
        register_deactivation_hook(__FILE__, array($this, 'deactivate'));
    }
    
    public function init() {
        // Safety check - only load if WordPress is properly loaded
        if (!did_action('wp_loaded')) {
            add_action('wp_loaded', array($this, 'safe_init'));
            return;
        }
        
        $this->safe_init();
    }
    
    public function safe_init() {
        try {
            // Register custom post type
            $this->register_asset_post_type();
            
            // Add admin menu
            add_action('admin_menu', array($this, 'add_admin_menu'));
            
            // Enqueue scripts safely
            add_action('wp_enqueue_scripts', array($this, 'enqueue_frontend_scripts'));
            add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_scripts'));
            
            // REST API endpoints
            add_action('rest_api_init', array($this, 'register_rest_routes'));
            
            // Add shortcode for public portal
            add_shortcode('tsp_dam_portal', array($this, 'render_public_portal'));
            
            // Add public portal page template
            add_filter('page_template', array($this, 'load_portal_template'));
            
        } catch (Exception $e) {
            // Log error but don't break site
            error_log('TSP DAM Plugin Error: ' . $e->getMessage());
        }
    }
    
    public function register_asset_post_type() {
        $labels = array(
            'name' => 'Digital Assets',
            'singular_name' => 'Digital Asset',
            'menu_name' => 'DAM Assets',
            'add_new' => 'Add New Asset',
            'add_new_item' => 'Add New Digital Asset',
            'edit_item' => 'Edit Digital Asset',
            'new_item' => 'New Digital Asset',
            'view_item' => 'View Digital Asset',
            'search_items' => 'Search Digital Assets',
        );
        
        $args = array(
            'labels' => $labels,
            'public' => false, // Not public by default
            'show_ui' => true,
            'show_in_menu' => false, // We'll add our custom menu
            'show_in_rest' => true,
            'rest_base' => 'dam-assets',
            'capability_type' => 'post',
            'hierarchical' => false,
            'supports' => array('title', 'editor', 'thumbnail', 'custom-fields'),
            'has_archive' => false,
            'rewrite' => array('slug' => 'dam-asset'),
        );
        
        register_post_type('dam_asset', $args);
        
        // Add custom fields for asset metadata
        $this->register_asset_meta_fields();
    }
    
    public function register_asset_meta_fields() {
        $meta_fields = array(
            'asset_type' => 'string',
            'confidentiality' => 'string',
            'file_url' => 'string',
            'thumbnail_url' => 'string',
            'file_size' => 'integer',
            'dimensions' => 'object',
            'tags' => 'array',
            'approval_status' => 'string',
            'download_count' => 'integer',
            'is_public' => 'boolean',
        );
        
        foreach ($meta_fields as $key => $type) {
            register_post_meta('dam_asset', $key, array(
                'show_in_rest' => true,
                'single' => true,
                'type' => $type,
                'auth_callback' => function() {
                    return current_user_can('edit_posts');
                }
            ));
        }
    }
    
    public function add_admin_menu() {
        add_menu_page(
            'Digital Asset Manager',
            'Asset Manager',
            'manage_options',
            'tsp-dam',
            array($this, 'render_admin_page'),
            'dashicons-admin-media',
            30
        );
        
        add_submenu_page(
            'tsp-dam',
            'All Assets',
            'All Assets',
            'edit_posts',
            'tsp-dam-assets',
            array($this, 'render_assets_page')
        );
        
        add_submenu_page(
            'tsp-dam',
            'Public Portal',
            'Public Portal',
            'manage_options',
            'tsp-dam-portal',
            array($this, 'render_portal_settings')
        );
    }
    
    public function render_admin_page() {
        echo '<div id="tsp-dam-admin-app"></div>';
    }
    
    public function render_assets_page() {
        echo '<div id="tsp-dam-assets-app"></div>';
    }
    
    public function render_portal_settings() {
        include plugin_dir_path(__FILE__) . 'templates/portal-settings.php';
    }
    
    public function enqueue_admin_scripts($hook) {
        if (strpos($hook, 'tsp-dam') !== false) {
            wp_enqueue_script(
                'tsp-dam-admin',
                plugin_dir_url(__FILE__) . 'build/admin.js',
                array('wp-element', 'wp-api-fetch'),
                $this->version,
                true
            );
            
            wp_enqueue_style(
                'tsp-dam-admin',
                plugin_dir_url(__FILE__) . 'build/admin.css',
                array(),
                $this->version
            );
            
            wp_localize_script('tsp-dam-admin', 'tspDamConfig', array(
                'apiUrl' => rest_url('wp/v2/'),
                'nonce' => wp_create_nonce('wp_rest'),
                'currentUser' => wp_get_current_user(),
                'uploadUrl' => admin_url('async-upload.php'),
            ));
        }
    }
    
    public function enqueue_frontend_scripts() {
        if (is_page('public-portal') || has_shortcode(get_post()->post_content, 'tsp_dam_portal')) {
            wp_enqueue_script(
                'tsp-dam-frontend',
                plugin_dir_url(__FILE__) . 'build/frontend.js',
                array(),
                $this->version,
                true
            );
            
            wp_enqueue_style(
                'tsp-dam-frontend',
                plugin_dir_url(__FILE__) . 'build/frontend.css',
                array(),
                $this->version
            );
        }
    }
    
    public function register_rest_routes() {
        register_rest_route('tsp-dam/v1', '/assets', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_assets'),
            'permission_callback' => array($this, 'check_permissions'),
        ));
        
        register_rest_route('tsp-dam/v1', '/assets/public', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_public_assets'),
            'permission_callback' => '__return_true',
        ));
        
        register_rest_route('tsp-dam/v1', '/upload', array(
            'methods' => 'POST',
            'callback' => array($this, 'upload_asset'),
            'permission_callback' => array($this, 'check_upload_permissions'),
        ));
    }
    
    public function get_assets($request) {
        $args = array(
            'post_type' => 'dam_asset',
            'post_status' => 'publish',
            'posts_per_page' => $request->get_param('per_page') ?: 50,
            'paged' => $request->get_param('page') ?: 1,
        );
        
        if ($search = $request->get_param('search')) {
            $args['s'] = sanitize_text_field($search);
        }
        
        $posts = get_posts($args);
        $assets = array();
        
        foreach ($posts as $post) {
            $assets[] = $this->format_asset($post);
        }
        
        return rest_ensure_response($assets);
    }
    
    public function get_public_assets($request) {
        $args = array(
            'post_type' => 'dam_asset',
            'post_status' => 'publish',
            'meta_query' => array(
                array(
                    'key' => 'is_public',
                    'value' => true,
                    'compare' => '='
                )
            ),
            'posts_per_page' => -1,
        );
        
        $posts = get_posts($args);
        $assets = array();
        
        foreach ($posts as $post) {
            $assets[] = $this->format_asset($post);
        }
        
        return rest_ensure_response($assets);
    }
    
    public function upload_asset($request) {
        if (!function_exists('wp_handle_upload')) {
            require_once(ABSPATH . 'wp-admin/includes/file.php');
        }
        
        $files = $request->get_file_params();
        
        if (empty($files['file'])) {
            return new WP_Error('no_file', 'No file uploaded', array('status' => 400));
        }
        
        $file = $files['file'];
        $upload = wp_handle_upload($file, array('test_form' => false));
        
        if (isset($upload['error'])) {
            return new WP_Error('upload_error', $upload['error'], array('status' => 400));
        }
        
        // Create attachment
        $attachment_id = wp_insert_attachment(array(
            'post_title' => sanitize_file_name($file['name']),
            'post_mime_type' => $file['type'],
            'post_status' => 'inherit',
        ), $upload['file']);
        
        // Generate metadata
        require_once(ABSPATH . 'wp-admin/includes/image.php');
        wp_update_attachment_metadata($attachment_id, wp_generate_attachment_metadata($attachment_id, $upload['file']));
        
        // Create DAM asset post
        $asset_data = $request->get_json_params();
        $post_id = wp_insert_post(array(
            'post_type' => 'dam_asset',
            'post_title' => $asset_data['title'] ?: $file['name'],
            'post_content' => $asset_data['description'] ?: '',
            'post_status' => 'publish',
            'meta_input' => array(
                'asset_type' => $asset_data['asset_type'] ?: 'Document',
                'confidentiality' => $asset_data['confidentiality'] ?: 'Internal',
                'file_url' => $upload['url'],
                'thumbnail_url' => wp_get_attachment_thumb_url($attachment_id),
                'file_size' => filesize($upload['file']),
                'approval_status' => 'pending',
                'download_count' => 0,
                'is_public' => false,
            ),
        ));
        
        if (is_wp_error($post_id)) {
            return $post_id;
        }
        
        return rest_ensure_response($this->format_asset(get_post($post_id)));
    }
    
    private function format_asset($post) {
        return array(
            'id' => $post->ID,
            'name' => $post->post_title,
            'description' => $post->post_content,
            'type' => get_post_meta($post->ID, 'asset_type', true),
            'confidentiality' => get_post_meta($post->ID, 'confidentiality', true),
            'link' => get_post_meta($post->ID, 'file_url', true),
            'thumbnail' => get_post_meta($post->ID, 'thumbnail_url', true),
            'fileSize' => get_post_meta($post->ID, 'file_size', true),
            'dateAdded' => $post->post_date,
            'dateModified' => $post->post_modified,
            'approvalStatus' => get_post_meta($post->ID, 'approval_status', true),
            'downloadCount' => get_post_meta($post->ID, 'download_count', true),
            'isPublic' => get_post_meta($post->ID, 'is_public', true),
            'tags' => get_post_meta($post->ID, 'tags', true) ?: array(),
        );
    }
    
    public function render_public_portal($atts) {
        $atts = shortcode_atts(array(
            'theme' => 'default',
        ), $atts);
        
        ob_start();
        ?>
        <div id="tsp-dam-public-portal" data-theme="<?php echo esc_attr($atts['theme']); ?>"></div>
        <script>
        window.tspDamPublicConfig = {
            apiUrl: '<?php echo rest_url('tsp-dam/v1/'); ?>',
            assetsEndpoint: '<?php echo rest_url('tsp-dam/v1/assets/public'); ?>'
        };
        </script>
        <?php
        return ob_get_clean();
    }
    
    public function check_permissions() {
        return current_user_can('edit_posts');
    }
    
    public function check_upload_permissions() {
        return current_user_can('upload_files');
    }
    
    public function activate() {
        $this->register_asset_post_type();
        flush_rewrite_rules();
        
        // Create public portal page if it doesn't exist
        $portal_page = get_page_by_path('public-portal');
        if (!$portal_page) {
            wp_insert_post(array(
                'post_title' => 'Public Portal',
                'post_content' => '[tsp_dam_portal]',
                'post_status' => 'publish',
                'post_type' => 'page',
                'post_name' => 'public-portal',
            ));
        }
    }
    
    public function deactivate() {
        flush_rewrite_rules();
    }
}

// Initialize plugin safely
if (class_exists('TSP_DAM_Plugin')) {
    new TSP_DAM_Plugin();
}
