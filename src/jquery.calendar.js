/*
 *  jquery-calendar - v1.0.0
 *  A simple jquery Calendar plugin.
 *  http://benwas.com
 *
 *  Made by Benjamin Wasilewski
 *  Under MIT License
 */
// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;( function( $, window, document, undefined ) {

	'use strict';

		// undefined is used here as the undefined global variable in ECMAScript 3 is
		// mutable (ie. it can be changed by someone else). undefined isn't really being
		// passed in so we can ensure the value of it is truly undefined. In ES5, undefined
		// can no longer be modified.

		// window and document are passed through as local variables rather than global
		// as this (slightly) quickens the resolution process and can be more efficiently
		// minified (especially when both are regularly referenced in your plugin).

		// Create the defaults once
		var pluginName = 'Calendar'
			,calendarDate = new Date()
		    // ,todaysDate = new Date()
		    ,dayArray = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
		    ,monthArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
		    // ,date = calendarDate.getDate()
		    // ,day = calendarDate.getDay()
		    // ,month = calendarDate.getMonth()
		    // ,year = calendarDate.getFullYear()
			,defaults = {
				'calendarAttrs': {
		            'class': 'apervita-calendar'
		        },
		        'calendarHeaderAttributes': {
		            'class': 'dayLabels'
		        },
		        'cellAttributes': {
		            'class': 'dateCell'
		        },
		        'containerAttrs': {
		            'class': 'apervita-calendar-container'
		        },
		        'message': 'New jQuery Plugin!',
		        'monthSelectorAttributes': {
		            'class': 'month-selector'
		        },
		        'nextMonthClassName': 'next',
		        'nextMonthSelector': '.next',
		        'previousMonthClassName': 'prev',
		        'previousMonthSelector': '.prev',
		        'rowAttributes': {
		            'class': 'dateRow'
		        },
		        'tableAttributes': {
		            'class': 'date-table'
		        },
		        'title': 'jQuery Calendar by Ben Wasilewski',
		        'yearSelectorAttributes': {
		            'class': 'year-selector'
		        }
			};

		// The actual plugin constructor
		function Plugin ( element, options ) {
			this.element = element;

			// jQuery has an extend method which merges the contents of two or
			// more objects, storing the result in the first object. The first object
			// is generally empty as we don't want to alter the default options for
			// future instances of the plugin
			this.settings = $.extend( {}, defaults, options );
			this._defaults = defaults;
			this._name = pluginName;
			this.init();
		}

		// Avoid Plugin.prototype conflicts
		$.extend( Plugin.prototype, {
			init: function() {
				var that = this;

				this.calendarDate = new Date();
		        this.todaysDate = new Date();

		        this.date = this.calendarDate.getDate();
		        this.day = this.calendarDate.getDay();
		        this.month = this.calendarDate.getMonth();
		        this.year = this.calendarDate.getFullYear();

		        this.container = $('<div />');
		        this.titleLabel = $('<p />', {
		            'class': 'calendar-title'
		        });
		        this.currentLabel = $('<p />', {
		            'class': 'current-label'
		        });
		        this.displayLabel = $('<p />', {
		            'class': 'display-label'
		        });
		        this.calendarHeader = $('<thead />', this.settings.calendarHeaderAttributes)
		            .html('<tr><th>S</th><th>M</th><th>T</th><th>W</th><th>T</th><th>F</th><th>S</th></tr>');
		        this.selectors = $('<form />',
		            {'class': 'selectors' });
		        this.monthSelector = $('<select />', this.settings.monthSelectorAttributes);
		        this.yearSelector = $('<select />', this.settings.yearSelectorAttributes);
		        this.table = $('<table />', this.settings.tableAttributes);
		        this.row = $('<tr />', this.settings.rowAttributes);
		        this.rows = [];
		        this.cell = $('<td />', this.settings.cellAttributes);

		        this.nextButton = $('<button />', {
		            'class': that.settings.nextMonthClassName
		        }).text('Next');

		        this.previousButton = $('<button />', {
		            'class': that.settings.previousMonthClassName
		        }).text('Previous');

	            this.container.attr(this.settings.containerAttrs)
	                .appendTo(this.element);

	            this.titleLabel.appendTo(this.container).text(this.settings.title);
	            this.currentLabel.appendTo(this.container).text('Current Label');
	            this.displayLabel.appendTo(this.container).text('Display Label');
	            this.previousButton.appendTo(this.container);
	            this.selectors.appendTo(this.container);
	            this.monthSelector.appendTo(this.selectors);
	            this.yearSelector.appendTo(this.selectors);
	            this.nextButton.appendTo(this.container);

	            this.table.attr(this.settings.calendarAttrs)
	                .appendTo(this.container);
	            this.calendarHeader.attr(this.settings.calendarHeaderAttributes)
	            	.appendTo(this.table);

	            this.drawCalendar();
	            this.populateSelectors();

	            // Event Handlers
	            this.nextButton.bind('click', function () {
	                var nextMonth = ( that.month === 11 ) ? 0 : that.month + 1
	                    ,nextYear = ( that.month === 11 ) ? that.year + 1 : that.year;

	                console.log('Month: ', that.month);
	                console.log('Next Month: ', nextMonth);

	                that.updateCalendar(that.element, nextMonth, nextYear);
	            });

	            this.previousButton.bind('click', function () {
	                var nextMonth = ( that.month === 0 ) ? 11 : that.month - 1
	                    ,nextYear = ( that.month === 0 ) ? that.year - 1 : that.year;

                    console.log('Month: ', that.month);
	                console.log('Next Month: ', nextMonth);

	                that.updateCalendar(that.element, nextMonth, nextYear);
	            });

	            // $([$.fn.calendar.monthSelector, $.fn.calendar.yearSelector]).each(function (ind, val) {
	            //     val.bind('change', function (ev) {
	            //         var m = parseFloat($.fn.calendar.monthSelector.find('option:selected').attr('value'));
	            //         var y = parseFloat($.fn.calendar.yearSelector.find('option:selected').attr('value'));

	            //         $.fn.calendar.updateCalendar(context, m, y);
	            //     });
	            // });
			},
			drawCalendar: function () {
				var that = this
					,calendarRows = [];

		        // // remove all rows
		        // $('.dateRow', calendarTable).remove();
		        // $('thead', calendarTable).remove();

		        $('.dateRow', this.table).remove();

		        // draw six rows
		        for ( var i = 0; i < 6; i++) {
		            calendarRows.push(this.row.clone().appendTo(this.table));
		        }

		        $.each(calendarRows, function (ind, val) {
		            for ( var n = 0; n < 7; n++ ) {
		                that.cell.clone().appendTo(val);
		            }
		        });

		        this.createDateArray();
		        // updateHeaders(el);
			},
			createDateArray: function () {
				var dateArray = []
		            ,firstDay = this.getFirstDay(this.month, this.year)
		            ,thisMonthLength = this.daysInMonth(this.month, this.year)
		            ,lastMonth = ( this.month > 0 ) ? this.month - 1 : 11
		            ,lastYear = ( this.month > 0 ) ? this.year : this.year - 1
		            ,lastMonthLength = this.daysInMonth(lastMonth, lastYear)
		            ,startingDate = 0
		            ,cellSize = $('.dateCell').length
		            ,leftoverCells = 0;

		        startingDate = ( firstDay === 0 ) ? lastMonthLength - 6 : lastMonthLength - ( firstDay - 1 );

		        for ( var i = startingDate; i <= lastMonthLength; i++ ) {
		            dateArray.push({
		                date: i
		                ,className: 'prevDate'
		            });
		            startingDate++;
		        }

		        for ( var n = 1; n <= thisMonthLength; n++ ) {
		            dateArray.push({
		                date: n
		                ,className: 'currentDate'
		            });
		        }

		        leftoverCells = cellSize - dateArray.length;

		        for (var x = 1; x <= leftoverCells; x++) {
		            dateArray.push({
		                date: x
		                ,className: 'postDate'
		            });
		        }

		        // TODO: make this dynamic
		        $.each($('.dateCell', this.table), function (ind, val) {
		            $(val).addClass(dateArray[ind].className).html(dateArray[ind].date);
		        });
			},
			getFirstDay: function (m, y) {
				var tempDate = new Date();

		        tempDate.setFullYear(y);
		        tempDate.setMonth(m);
		        tempDate.setDate(1);

		        return tempDate.getDay();
			},
			daysInMonth: function (m, y) {
				return 32 - new Date(y, m, 32).getDate();
			},
			populateSelectors: function () {
				var monthSelect = this.monthSelector
		            ,yearSelect = this.yearSelector
		            ,startYear = this.year - 20
		            ,endYear = this.year + 20;

		        for (var i = startYear; i < endYear; i++ ) {
		            yearSelect.append('<option value="' + i + '">' + i + '</option>');

		            if (i === this.year) {
		                yearSelect.find('option').last().attr('selected', 'selected');
		            }
		        }

		        $.each(monthArray, function (ind, val) {
		            monthSelect.append('<option value="' + ind + '">' + val + '</option>');
		        });

		        this.updateSelectors(this.month, this.year);
			},
			updateSelectors: function (m, y) {
				this.monthSelector.val(m);
		        this.yearSelector.val(y);
			},
			updateCalendar: function (context, m, y) {
		        calendarDate.setMonth(m);
		        calendarDate.setFullYear(y);

		        this.month = calendarDate.getMonth();
		        this.year = calendarDate.getFullYear();

		        this.updateHeaders(context);

		        this.drawCalendar(context, this.month, this.year);
		        this.updateSelectors(m, y);
			},
			updateHeaders: function () {
				this.currentLabel.html( dayArray[this.todaysDate.getDay()] + ', ' + monthArray[this.todaysDate.getMonth()] + ' ' + this.getOrdinal(this.todaysDate.getDate()) + ', ' + this.todaysDate.getFullYear() );
        		this.displayLabel.html( monthArray[this.month] + ' ' + this.year );
			},
			getOrdinal: function (n) {
				var s = ['th','st','nd','rd']
		            ,v = n % 100;

		        return n + ( s[(v-20)%10] || s[v] || s[0] );
			}
		} );

		// A really lightweight plugin wrapper around the constructor,
		// preventing against multiple instantiations
		$.fn[ pluginName ] = function( options ) {
			return this.each( function() {
				if ( !$.data( this, 'plugin_' + pluginName ) ) {
					$.data( this, 'plugin_' +
						pluginName, new Plugin( this, options ) );
				}
			} );
		};

} )( jQuery, window, document );
