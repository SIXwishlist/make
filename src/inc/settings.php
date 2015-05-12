<?php
/**
 * @package Make
 */

/**
 * Class MAKE_Settings
 *
 * An object for defining and managing theme settings, both within and outside of the Customizer.
 *
 * @since 1.6.0.
 */
abstract class MAKE_Settings {
	/**
	 * The collection of settings and their properties.
	 *
	 * @since 1.6.0.
	 *
	 * @var array
	 */
	protected $settings = array();

	/**
	 * The value returned for an undefined setting.
	 *
	 * @since 1.6.0.
	 *
	 * @var null
	 */
	protected $undefined = null;

	/**
	 * The type of settings. Should be defined in the child class.
	 *
	 * @since 1.6.0.
	 *
	 * @var string
	 */
	protected $type = '';

	/**
	 * Required properties for each setting added to the collection.
	 *
	 * @since 1.6.0.
	 *
	 * @var array
	 */
	protected $required_properties = array(
		'default',
		'sanitize'
	);

	/**
	 * Initialize the object.
	 */
	final function __construct() {
		$this->load_settings();

		/**
		 *
		 */
		do_action( "make_settings_{$this->type}_loaded" );
	}

	/**
	 * Load setting definitions into the $settings class property.
	 *
	 * Must be defined by the child class.
	 * - Should use the add_settings method.
	 *
	 * @since 1.6.0.
	 *
	 * @return mixed
	 */
	abstract protected function load_settings();

	/**
	 * Add settings definitions to the collection.
	 *
	 * Each setting definition is an item in the associative array.
	 * The item's array key is the setting ID. The item value is another
	 * array that contains setting properties.
	 *
	 * @since 1.6.0.
	 *
	 * @param  array    $settings     Array of setting definitions to add.
	 * @param  bool     $overwrite    True overwrites an existing definition of a setting.
	 *
	 * @return array|bool             The modified array of settings if successful, otherwise false.
	 */
	public function add_settings( $settings, $overwrite = false ) {
		$settings = (array) $settings;
		$existing_ids = array_keys( $this->settings );
		$new_settings = array();

		// Check each setting definition for required properties before adding it.
		foreach ( $settings as $setting_id => $setting_props ) {
			if (
				$this->has_required_properties( $setting_props )
				&&
				( ! isset( $existing_ids[ $setting_id ] ) || true === $overwrite )
			) {
				$new_settings[ $setting_id ] = $setting_props;
			}
		}

		// If no settings were valid, return false.
		if ( empty( $new_settings ) ) {
			return false;
		}

		// Add the valid new settings to the existing settings array.
		$this->settings = array_merge( $this->settings, $new_settings );

		return $this->settings;
	}

	/**
	 * Check an array of setting definition properties against another array of required ones.
	 *
	 * @since 1.6.0.
	 *
	 * @param  array    $properties    The array of properties to check.
	 *
	 * @return bool                    True if all required properties are present.
	 */
	protected function has_required_properties( $properties ) {
		$properties = (array) $properties;
		$required_properties = $this->required_properties;
		$existing_properties = array_keys( $properties );

		// If there aren't any required properties, return true.
		if ( empty( $required_properties ) ) {
			return true;
		}

		// This variable will contain any array keys that aren't found in $existing_properties.
		$diff = array_diff_key( $required_properties, $existing_properties );

		return empty( $diff );
	}

	/**
	 * Remove setting definitions from the collection.
	 *
	 * @since 1.6.0.
	 *
	 * @param  array|string    $setting_ids    The array of settings to remove, or 'all'.
	 *
	 * @return array|bool                      The modified array of settings if successful, otherwise false.
	 */
	public function remove_settings( $setting_ids ) {
		if ( 'all' === $setting_ids ) {
			// Clear the entire settings array.
			$this->settings = array();
			return true;
		}

		$setting_ids = (array) $setting_ids;
		$removed_ids = array();

		// Track each setting that's removed.
		foreach ( $setting_ids as $setting_id ) {
			if ( isset( $this->settings[ $setting_id ] ) ) {
				unset( $this->settings[ $setting_id ] );
				$removed_ids[] = $setting_id;
			}
		}

		if ( empty( $removed_ids ) ) {
			// No settings were removed.
			return false;
		} else {
			return $this->settings;
		}
	}

	/**
	 * Get the setting definitions, or a specific property of each one.
	 *
	 * @since 1.6.0.
	 *
	 * @param  string    $property    The property to get, or 'all'.
	 *
	 * @return array                  An array of setting definitions and their specified properties.
	 */
	public function get_settings( $property = 'all' ) {
		if ( 'all' === $property ) {
			return $this->settings;
		}

		$setting_ids = array_keys( $this->settings );
		$properties  = wp_list_pluck( $this->settings, $property );
		return array_combine( $setting_ids, $properties );
	}

	/**
	 * Set a new value for a particular setting.
	 *
	 * Must be defined by the child class.
	 * - Should use the sanitize_value method before storing the value.
	 * - Should return true if value was successfully stored, otherwise false.
	 *
	 * @since 1.6.0.
	 *
	 * @param  string    $setting_id    The ID of the setting to set.
	 * @param  mixed     $value         The value to assign to the setting.
	 *
	 * @return bool                     True if value was successfully set.
	 */
	abstract function set_value( $setting_id, $value );


	/**
	 * Unset the value for a particular setting.
	 *
	 * Must be defined by the child class.
	 * - Should return true if value was successfully removed, otherwise false.
	 *
	 * @since 1.6.0.
	 *
	 * @param  string    $setting_id    The ID of the setting to unset.
	 *
	 * @return bool                     True if the value was successfully unset.
	 */
	abstract function unset_value( $setting_id );

	/**
	 * Get the stored value of a setting, unaltered.
	 *
	 * Must be defined by the child class.
	 * - Should return the $undefined class property if the setting isn't found.
	 *
	 * @since 1.6.0.
	 *
	 * @param  string    $setting_id    The ID of the setting to retrieve.
	 *
	 * @return mixed|null               The value of the setting as it is in the database, or undefined if the setting doesn't exist.
	 */
	abstract function get_raw_value( $setting_id );
	
	/**
	 * Get the current value of a setting. Sanitize it first.
	 *
	 * This will return the default value for the settting if nothing is stored yet.
	 *
	 * @since 1.6.0.
	 *
	 * @param  string    $setting_id    The ID of the setting to retrieve.
	 *
	 * @return mixed|null
	 */
	public function get_value( $setting_id ) {
		$sanitized_value = $this->undefined;

		if ( isset( $this->settings[ $setting_id ] ) ) {
			$raw_value = $this->get_raw_value( $setting_id );
			if ( $this->undefined === $raw_value ) {
				$raw_value = $this->get_default( $setting_id );
			}
			$sanitized_value = $this->sanitize_value( $raw_value, $setting_id );
		}

		/**
		 * Filter the current value for a particular setting.
		 *
		 * @since 1.6.0.
		 *
		 * @param string|array    $value         The current value of the setting.
		 * @param string          $setting_id    The id of the setting.
		 */
		return apply_filters( "make_settings_{$this->type}_current_value", $sanitized_value, $setting_id );
	}

	/**
	 * Get the default value of a setting.
	 *
	 * @since 1.6.0.
	 *
	 * @param  string    $setting_id    The ID of the setting to retrieve.
	 *
	 * @return mixed|null
	 */
	public function get_default( $setting_id ) {
		$default_value = $this->undefined;

		if ( isset( $this->settings[ $setting_id ] ) ) {
			$setting = $this->settings[ $setting_id ];
			if ( isset( $setting['default'] ) ) {
				$default_value = $setting['default'];
			}
		}

		/**
		 * Filter the default value for a particular setting.
		 *
		 * @since 1.6.0.
		 *
		 * @param string|array    $default_value    The default value of the setting.
		 * @param string          $setting_id       The id of the setting.
		 */
		return apply_filters( "make_settings_{$this->type}_default_value", $default_value, $setting_id );
	}

	/**
	 * Determine if a setting is currently set to its default value.
	 *
	 * @since 1.6.0.
	 *
	 * @param  string    $setting_id    The ID of the setting to retrieve.
	 *
	 * @return bool
	 */
	public function is_default( $setting_id ) {
		$current_value = $this->get_value( $setting_id );
		$default_value = $this->get_default( $setting_id );

		return $current_value === $default_value;
	}

	/**
	 * Get the name of the callback function used to sanitize a particular setting.
	 *
	 * @since 1.6.0.
	 *
	 * @param  string    $setting_id    The ID of the setting to retrieve.
	 *
	 * @return string|null
	 */
	public function get_sanitize_callback( $setting_id ) {
		$callback = $this->undefined;

		if ( isset( $this->settings[ $setting_id ] ) ) {
			$setting = $this->settings[ $setting_id ];
			if ( isset( $setting['sanitize'] ) ) {
				$callback = $setting['sanitize'];
			}
		}

		/**
		 * Filter the name of the sanitize callback function for a particular setting.
		 *
		 * @since 1.6.0.
		 *
		 * @param string|array    $callback      The name of the callback function.
		 * @param string          $setting_id    The id of the setting.
		 */
		return apply_filters( "make_settings_{$this->type}_sanitize_callback", $callback, $setting_id );
	}

	/**
	 * Sanitize the value for a setting using the setting's specified callback function.
	 *
	 * @since 1.6.0.
	 *
	 * @param  mixed     $value         The value to sanitize.
	 * @param  string    $setting_id    The ID of the setting to retrieve.
	 *
	 * @return mixed|null
	 */
	public function sanitize_value( &$value, $setting_id ) {
		$sanitized_value = $this->undefined;

		if ( isset( $this->settings[ $setting_id ] ) ) {
			$callback = $this->get_sanitize_callback( $setting_id );
			if (
				( is_string( $callback ) && function_exists( $callback ) && is_callable( $callback ) )
				||
				( is_array( $callback ) && method_exists( $callback[0], $callback[1] ) && is_callable( $callback ) )
			) {
				$sanitized_value = call_user_func_array( $callback, (array) $value );
			}
		}

		return $sanitized_value;
	}
}
