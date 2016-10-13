( function( $, QUnit ) {

	"use strict";

	var $testCanvas = $( "#testCanvas" );
	var $fixture = null;

	QUnit.module( "jQuery Boilerplate", {
		beforeEach: function() {

			// fixture is the element where your jQuery plugin will act
			$fixture = $( "<div/>" );

			$testCanvas.append( $fixture );
		},
		afterEach: function() {

			// we remove the element to reset our plugin job :)
			$fixture.remove();
		}
	} );

	QUnit.test( "is inside jQuery library", function( assert ) {
		assert.equal( typeof $.fn.Calendar, "function", "has function inside jquery.fn" );
		assert.equal( typeof $fixture.Calendar, "function", "another way to test it" );
	} );

	QUnit.test( "returns jQuery functions after called (chaining)", function( assert ) {
		assert.equal(
			typeof $fixture.Calendar().on,
			"function",
			"'on' function must exist after plugin call" );
	} );

	QUnit.test( "caches plugin instance", function( assert ) {
		$fixture.Calendar();
		assert.ok(
			$fixture.data( "plugin_Calendar" ),
			"has cached it into a jQuery data"
		);
	} );

	QUnit.test( "enable custom config", function( assert ) {
		$fixture.Calendar( {
			foo: "bar"
		} );

		var obj = {
			foo: "bar"
		};

		assert.deepEqual(obj, {
			foo: "bar"
		}, "extend plugin settings");

		var pluginData = $fixture.data( "plugin_Calendar" );

		console.log("Settings: ", pluginData.settings);

		assert.deepEqual(
			pluginData.settings,
			{
				"calendarHeaderAttributes": {
		            "class": "dayLabels"
		        },
		        "cellAttributes": {
		            "class": "dateCell"
		        },
		        "containerAttrs": {
		            "class": "calendar-container"
		        },
		        "message": "New jQuery Plugin!",
		        "monthSelectorAttributes": {
		            "class": "month-selector"
		        },
		        "nextMonthClassName": "next",
		        "nextMonthSelector": ".next",
		        "nextButtonText": "Next",
		        "onCellClick": function () { },
		        "onNextMonthClick": function () { },
		        "onPreviousMonthClick": function () { },
		        // "onMonthSelect": function () { },
		        // "onYearSelect": function () { },
		        "previousMonthClassName": "prev",
		        "previousMonthSelector": ".prev",
		        "previousButtonText": "Previous",
		        "rowAttributes": {
		            "class": "calendar-row"
		        },
		        "selectedDate": new Date(),
		        "tableAttributes": {
		            "class": "calendar-table"
		        },
		        "textFieldAttributes": {
		        	"type": "hidden",
		        	"class": "calendar-date-field"
		        },
		        "yearSelectorAttributes": {
		            "class": "year-selector"
		        },
				foo: "bar"
			},
			"extend plugin settings"
		);

	} );

	// QUnit.test( "changes the element text", function( assert ) {
	// 	$fixture.defaultPluginName();

	// 	assert.equal( $fixture.text(), "jQuery Boilerplate" );
	// } );

	// QUnit.test(
	// 	"has #yourOtherFunction working as expected",
	// 	function( assert ) {
	// 		$fixture.defaultPluginName();

	// 		var instance = $fixture.data( "plugin_defaultPluginName" ),
	// 			expectedText = "foobar";

	// 		instance.yourOtherFunction( expectedText );
	// 		assert.equal( $fixture.text(), expectedText );
	// 	}
	// );

}( jQuery, QUnit ) );
