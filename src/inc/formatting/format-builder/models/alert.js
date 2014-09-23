/* global Backbone, jQuery, _ */
var ttfmakeFormatBuilder = ttfmakeFormatBuilder || {};

( function ( window, Backbone, $, _, ttfmakeFormatBuilder ) {
	'use strict';

	ttfmakeFormatBuilder.formats = ttfmakeFormatBuilder.formats || {};

	/**
	 * Defines the listbox item in the 'Choose a format' dropdown.
	 *
	 * @since 1.4.0.
	 *
	 * @returns object
	 */
	ttfmakeFormatBuilder.choices.alert = function() {
		var content = ttfmakeFormatBuilder.currentSelection.getContent(),
			node = ttfmakeFormatBuilder.currentSelection.getNode(),
			choice, isP;

		isP = ( $(node).is('p') );

		choice = {
			value: 'alert',
			text: 'Alert Box',
			disabled: (false === isP && '' == content)
		};

		return choice;
	};

	/**
	 * Define the selector for detecting this format in existing content.
	 *
	 * @since 1.4.0.
	 */
	ttfmakeFormatBuilder.nodes.alert = 'div.ttfmake-alert';

	/**
	 * The Button format model.
	 *
	 * @since 1.4.0.
	 */
	ttfmakeFormatBuilder.formats.alert = ttfmakeFormatBuilder.FormatModel.extend({
		/**
		 * Default format option values.
		 *
		 * @since 1.4.0.
		 */
		defaults: {
			update: false,
			text: '',
			fontSize: '17',
			icon: '',
			iconSize: '34',
			colorIcon: '#808080',
			iconPosition: 'left',
			paddingHorz: '10',
			paddingVert: '10',
			borderWidth: '2',
			borderStyle: 'solid',
			colorBorder: '#808080',
			colorBackground: '#e5e5e5',
			colorText: '#808080'
		},

		/**
		 * Populate the options with any existing values.
		 *
		 * @since 1.4.0.
		 */
		initialize: function() {
			var content = ttfmakeFormatBuilder.currentSelection.getContent(),
				node = ttfmakeFormatBuilder.currentSelection.getNode();

			if ( '' !== content ) {
				this.set({ text: content });
			}
			if (true === this.get('update')) {
				this.parseAttributes( node );
			}
		},

		/**
		 * Defines the fields in the options form.
		 *
		 * @since 1.4.0.
		 *
		 * @returns array
		 */
		getOptionFields: function() {
			var items = [
				{
					type: 'textbox',
					name: 'text',
					multiline: true,
					hidden: true,
					value: this.get('text')
				},
				ttfmakeFormatBuilder.getColorButton( 'colorBackground', 'Background Color' ),
				ttfmakeFormatBuilder.getColorButton( 'colorText', 'Text Color' ),
				{
					type: 'textbox',
					name: 'fontSize',
					label: 'Font Size (px)',
					size: 3,
					value: this.get('fontSize')
				},
				ttfmakeFormatBuilder.getIconButton( 'icon', 'Icon' ),
				{
					type: 'textbox',
					name: 'iconSize',
					label: 'Icon Size (px)',
					size: 3,
					value: this.get('iconSize')
				},
				ttfmakeFormatBuilder.getColorButton( 'colorIcon', 'Icon Color' ),
				{
					type: 'listbox',
					name: 'iconPosition',
					label: 'Icon Position',
					value: this.get('iconPosition'),
					values: [
						{
							text: 'Left',
							value: 'left'
						},
						{
							text: 'Right',
							value: 'right'
						}
					]
				},
				{
					type: 'textbox',
					name: 'paddingHorz',
					label: 'Horizontal Padding (px)',
					size: 3,
					value: this.get('paddingHorz')
				},
				{
					type: 'textbox',
					name: 'paddingVert',
					label: 'Vertical Padding (px)',
					size: 3,
					value: this.get('paddingVert')
				},
				{
					type: 'listbox',
					name: 'borderStyle',
					label: 'Border Style',
					value: this.get('borderStyle'),
					values: [
						{
							text: 'none',
							value: 'none'
						},
						{
							text: 'solid',
							value: 'solid'
						},
						{
							text: 'dotted',
							value: 'dotted'
						},
						{
							text: 'dashed',
							value: 'dashed'
						},
						{
							text: 'double',
							value: 'double'
						},
						{
							text: 'groove',
							value: 'groove'
						},
						{
							text: 'ridge',
							value: 'ridge'
						},
						{
							text: 'inset',
							value: 'inset'
						},
						{
							text: 'outset',
							value: 'outset'
						}
					]
				},
				{
					type: 'textbox',
					name: 'borderWidth',
					label: 'Border Width (px)',
					size: 3,
					value: this.get('borderWidth')
				},
				ttfmakeFormatBuilder.getColorButton( 'colorBorder', 'Border Color' )
			];

			return items;
		},

		/**
		 * Parse an existing format node and extract its format options.
		 *
		 * @since 1.4.0.
		 *
		 * @param node
		 */
		parseAttributes: function( node ) {
			var self = this,
				$node = $(node),
				icon, iconClasses, iconSize, iconColor, fontSize, paddingHorz, paddingVert, borderWidth;

			if ( $node.css('fontSize') ) {
				fontSize = parseInt( $node.css('fontSize') );
				this.set('fontSize', fontSize + ''); // Convert integer to string for TinyMCE
			}
			icon = $node.find('i.ttfmake-alert-icon');
			if ( icon.length > 0 ) {
				iconClasses = icon.attr('class').split(/\s+/);
				$.each(iconClasses, function(index, iconClass) {
					if (iconClass.match(/^fa-/)) {
						self.set('icon', iconClass);
					} else if (iconClass.match(/^pull-/)) {
						self.set('iconPosition', iconClass.replace('pull-', ''));
					}
				});
				if (icon.css('fontSize')) {
					iconSize = parseInt( icon.css('fontSize') );
					this.set('iconSize', iconSize + ''); // Convert integer to string for TinyMCE
				}
				if (icon.css('color')) {
					iconColor = icon.css('color');
					this.set('colorIcon', iconColor);
				}
			}
			if ( $node.css('paddingLeft') ) {
				paddingHorz = parseInt( $node.css('paddingLeft') );
				this.set('paddingHorz', paddingHorz + ''); // Convert integer to string for TinyMCE
			}
			if ( $node.css('paddingTop') ) {
				paddingVert = parseInt( $node.css('paddingTop') );
				this.set('paddingVert', paddingVert + ''); // Convert integer to string for TinyMCE
			}
			if ( $node.css('borderTopStyle') ) this.set('borderStyle', $node.css('borderTopStyle'));
			if ( $node.css('borderTopWidth') ) {
				borderWidth = parseInt( $node.css('borderTopWidth') );
				this.set('borderWidth', borderWidth + ''); // Convert integer to string for TinyMCE
			}
			if ( $node.css('borderTopColor') ) this.set('colorBorder', $node.css('borderTopColor'));
			if ( $node.css('backgroundColor') ) this.set('colorBackground', $node.css('backgroundColor'));
			if ( $node.css('color') ) this.set('colorText', $node.css('color'));
		},

		/**
		 * Render the format markup.
		 *
		 * @since 1.4.0.
		 *
		 * @returns string
		 */
		getHTML: function() {
			var $alert = $('<div>'),
				$icon, content, node;

			$alert.attr({
				class: 'ttfmake-alert'
			});

			$alert.css({
				backgroundColor: this.get('colorBackground'),
				color: this.get('colorText'),
				fontSize: this.get('fontSize') + 'px',
				padding: this.get('paddingVert') + 'px ' + this.get('paddingHorz') + 'px',
				borderStyle: this.get('borderStyle'),
				borderWidth: this.get('borderWidth') + 'px',
				borderColor: this.get('colorBorder')
			});

			if ('' !== this.get('icon')) {
				$icon = $('<i>');
				$icon.attr('class', 'ttfmake-alert-icon fa ' + this.get('icon') + ' pull-' + this.get('iconPosition'));
				$icon.css('fontSize', this.get('iconSize') + 'px');
				$icon.css('color', this.get('colorIcon'));
			}

			content = this.get('text');
			if ('' == content) {
				node = ttfmakeFormatBuilder.currentSelection.getNode();
				content = $(node).html();
			}

			$alert.html(content).find('i.ttfmake-alert-icon').remove();
			$alert.prepend($icon);

			return $alert.wrap('<div>').parent().html();
		},

		/**
		 * Insert the format markup into the editor.
		 *
		 * @since 1.4.0.
		 */
		insert: function() {
			var html = this.getHTML(),
				node = ttfmakeFormatBuilder.currentSelection.getNode(),
				parent;

			if ( true === this.get('update') ) {
				// Make sure we get the right node.
				parent = ttfmakeFormatBuilder.editor.dom.getParents( node, ttfmakeFormatBuilder.nodes.alert );

				// Select the existing format markup.
				ttfmakeFormatBuilder.currentSelection.select( parent[0] );

				// Replace with the new markup.
				ttfmakeFormatBuilder.currentSelection.setContent( html );
			} else if ('' != ttfmakeFormatBuilder.currentSelection.getContent()) {
				// Insert the new markup.
				ttfmakeFormatBuilder.currentSelection.setContent( html );
			} else {
				// Make sure we get the right node.
				parent = ttfmakeFormatBuilder.editor.dom.getParents( node, 'p' );

				// Select the existing format markup.
				ttfmakeFormatBuilder.currentSelection.select( parent[0] );

				// Insert the new markup.
				ttfmakeFormatBuilder.currentSelection.setContent( html );
			}
		},

		/**
		 * Remove the existing format node.
		 *
		 * @since 1.4.0.
		 */
		remove: function() {
			var node = ttfmakeFormatBuilder.currentSelection.getNode(),
				parent = ttfmakeFormatBuilder.editor.dom.getParents( node, ttfmakeFormatBuilder.nodes.alert),
				$alertContent, content;

			// Process the alert content.
			$alertContent = $('<p>');
			$alertContent.html( $(parent[0]).html() );
			$alertContent.find('i.ttfmake-alert-icon').remove();

			// Prepare replacement content.
			content = $alertContent.wrap('<div>').parent().html();

			// Select the existing format markup.
			ttfmakeFormatBuilder.currentSelection.select( parent[0] );

			// Remove the markup.
			ttfmakeFormatBuilder.currentSelection.setContent( content.trim() );
		}
	});
})( window, Backbone, jQuery, _, ttfmakeFormatBuilder );