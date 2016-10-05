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
		    ,todaysDate = new Date()
		    // ,dayArray = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
		    ,monthArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
		    // ,date = calendarDate.getDate()
		    // ,day = calendarDate.getDay()
		    // ,month = calendarDate.getMonth()
		    // ,year = calendarDate.getFullYear()
			,defaults = {
		        'calendarHeaderAttributes': {
		            'class': 'dayLabels'
		        },
		        'cellAttributes': {
		            'class': 'dateCell'
		        },
		        'containerAttrs': {
		            'class': 'calendar-container'
		        },
		        'message': 'New jQuery Plugin!',
		        'monthSelectorAttributes': {
		            'class': 'month-selector'
		        },
		        'nextMonthClassName': 'next',
		        'nextMonthSelector': '.next',
		        'nextButtonText': 'Next',
		        'onCellClick': function () { },
		        'onNextMonthClick': function () { },
		        'onPreviousMonthClick': function () { },
		        // 'onMonthSelect': function () { },
		        // 'onYearSelect': function () { },
		        'previousMonthClassName': 'prev',
		        'previousMonthSelector': '.prev',
		        'previousButtonText': 'Previous',
		        'rowAttributes': {
		            'class': 'calendar-row'
		        },
		        'selectedDate': todaysDate,
		        'tableAttributes': {
		            'class': 'calendar-table'
		        },
		        'textFieldAttributes': {
		        	'type': 'hidden',
		        	'class': 'calendar-date-field'
		        },
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
		        this.textfield = $('<input />', this.settings.textFieldAttributes);

		        this.nextButton = $('<button />', {
		            'class': that.settings.nextMonthClassName
		        }).html(that.settings.nextButtonText);

		        this.previousButton = $('<button />', {
		            'class': that.settings.previousMonthClassName
		        }).html(that.settings.previousButtonText);

	            this.container.attr(this.settings.containerAttrs)
	                .appendTo(this.element);

	            this.previousButton.appendTo(this.container);
	            this.selectors.appendTo(this.container);
	            this.monthSelector.appendTo(this.selectors);
	            this.yearSelector.appendTo(this.selectors);
	            this.nextButton.appendTo(this.container);

	            this.table.appendTo(this.container);
	            this.calendarHeader.appendTo(this.table);
	            this.textfield.appendTo(this.container);

	            this.drawCalendar();
	            this.populateSelectors();
	            this.selectDate(this.settings.selectedDate);
	            this.bindEvents();
			},
			bindEvents: function () {
				var that = this;

				this.nextButton.bind('click', {context: this}, this.handleNextBtn);
	            this.previousButton.bind('click', {context: this}, this.handlePreviousBtn);
	            $([this.monthSelector, this.yearSelector]).each(function (ind, val) {
	                val.bind('change', {context: that}, that.handleSelectors);
	            });
	            this.bindCellEvents();
			},
			bindCellEvents: function () {
				$(this.cells).unbind('click');
				$(this.cells, this.element).bind('click', {context: this}, this.handleCellClick);
			},
			handleNextBtn: function (ev) {
				var that = ev.data.context
					,nextMonth = ( that.month === 11 ) ? 0 : that.month + 1
                    ,nextYear = ( that.month === 11 ) ? that.year + 1 : that.year;

                that.updateCalendar(that.element, nextMonth, nextYear);
                that.settings.onNextMonthClick(ev);
			},
			handlePreviousBtn: function (ev) {
				var that = ev.data.context
					,nextMonth = ( that.month === 0 ) ? 11 : that.month - 1
                    ,nextYear = ( that.month === 0 ) ? that.year - 1 : that.year;

                that.updateCalendar(that.element, nextMonth, nextYear);
                that.settings.onPreviousMonthClick(ev);
			},
			handleSelectors: function (ev) {
				var that = ev.data.context
					,m = parseFloat(that.monthSelector.find('option:selected').attr('value'))
                	,y = parseFloat(that.yearSelector.find('option:selected').attr('value'));

                that.updateCalendar(that.element, m, y);
			},
			handleCellClick: function (ev) {
				var that = ev.data.context;

            	$.each(that.cells, function (ind, val) {
            		$(val).removeClass('selected');
            	});

            	$(this).addClass('selected');
            	that.selectedDate = $(this);
            	that.updateTextField( $(this).data() );
            	that.settings.onCellClick(ev);
			},
			drawCalendar: function () {
				var that = this
					,calendarRows = [];

				this.cells = [];

		        $('.' + this.settings.rowAttributes.class, this.element).remove();

		        // draw six rows
		        for ( var i = 0; i < 6; i++) {
		            calendarRows.push(this.row.clone().appendTo(this.table));
		        }

		        $.each(calendarRows, function (ind, val) {
		            for ( var n = 0; n < 7; n++ ) {
		                var newCell = that.cell.clone().appendTo(val);
		                that.cells.push(newCell[0]);
		            }
		        });

		        this.createDateArray();
			},
			createDateArray: function () {
				var dateArray = []
		            ,firstDay = this.getFirstDay(this.month, this.year) 				// the first day of the week in the new month
		            ,thisMonthLength = this.daysInMonth(this.month, this.year)			// number of days in the current month
		            ,lastMonth = ( this.month > 0 ) ? this.month - 1 : 11				// the previous month in integer format
		            ,lastYear = ( this.month > 0 ) ? this.year : this.year - 1			// the previous year
		            ,lastMonthLength = this.daysInMonth(lastMonth, lastYear)			// number of days in the previous month
		            ,startingDate = 0	
		            ,cells = $('.' + this.settings.cellAttributes.class, this.element)	
		            ,cellSize = cells.length
		            ,leftoverCells = 0
		            ,that = this;
				
				// if the first day of the week in the new month is Sunday
				if ( firstDay === 0 ) {
					// the date to start with is last month's length minus 6
					startingDate = lastMonthLength - 6;
				} else {
					// the date to start with is 
					startingDate = lastMonthLength - ( firstDay - 1 );
				}

		        startingDate = ( firstDay === 0 ) ? lastMonthLength - 6 : lastMonthLength - ( firstDay - 1 );

		        for ( var i = startingDate; i <= lastMonthLength; i++ ) {
		            dateArray.push({
		                date: i
		                ,month: that.month - 1
		                ,year: ( that.month > 0 ) ? that.year : that.year - 1
		                ,className: 'prevDate'
		            });
		            startingDate++;
		        }

		        for ( var n = 1; n <= thisMonthLength; n++ ) {
		            dateArray.push({
		                date: n
		                ,month: that.month
		                ,year: this.year
		                ,className: 'currentDate'
		            });
		        }

		        leftoverCells = cellSize - dateArray.length;

		        for (var x = 1; x <= leftoverCells; x++) {
		            dateArray.push({
		                date: x
		                ,month: that.month + 1
		                ,year: ( that.month < 11 ) ? that.year : that.year + 1
		                ,className: 'postDate'
		            });
		        }

		        // TODO: make this dynamic
		        $.each(cells, function (ind, val) {
		        	var cell = $(val)
		        		,cellData = dateArray[ind];

		        	cell.attr( 'class', that.settings.cellAttributes.class + ' ' + cellData.className )
		        		.html(cellData.date)
		        		.attr({
		        			'data-date': cellData.date,
		        			'data-month': cellData.month,
		        			'data-year': cellData.year
		        		})
		        		.data(cellData);
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
				this.month = m;
				this.year = y;

		        calendarDate.setMonth(m);
		        calendarDate.setFullYear(y);

		        this.drawCalendar(context, m, y);
		        this.updateSelectors(m, y);
		        this.bindCellEvents();
			},
			getOrdinal: function (n) {
				var s = ['th','st','nd','rd']
		            ,v = n % 100;

		        return n + ( s[(v-20)%10] || s[v] || s[0] );
			},
			getSelectedDate: function () {
				return {
					'el': this.selectedDate
				};
			},
			selectDate: function (date) {
				var dateDate = date.getDate();
				var dateMonth = date.getMonth();
				var dateYear = date.getFullYear();
				var targetCell;

				this.updateCalendar(this.element, dateMonth, dateYear);
				targetCell = $('td[data-date="' + dateDate + '"][data-month="' + dateMonth + '"]', this.element);
				targetCell.click();
			},
			updateTextField: function (data) {
				this.textfield.val(data.month + '/' + data.date + '/' + data.year);
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
