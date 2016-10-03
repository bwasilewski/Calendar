(function($) {

    // var calendarDate = new Date();
    // var todaysDate = new Date();
    var dayArray = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var monthArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    // var date = calendarDate.getDate();
    // var day = calendarDate.getDay();
    // var month = calendarDate.getMonth();
    // var year = calendarDate.getFullYear();

    $.fn.calendar = function (options) {
        options = options || {};

        var opts = $.extend( {}, $.fn.calendar.defaults, options );

        $.fn.calendar.calendarDate = new Date();
        $.fn.calendar.todaysDate = new Date();

        $.fn.calendar.date = $.fn.calendar.calendarDate.getDate();
        $.fn.calendar.day = $.fn.calendar.calendarDate.getDay();
        $.fn.calendar.month = $.fn.calendar.calendarDate.getMonth();
        $.fn.calendar.year = $.fn.calendar.calendarDate.getFullYear();

        $.fn.calendar.options = opts;

        $.fn.calendar.container = $('<div />');
        $.fn.calendar.titleLabel = $('<p />', {
            'class': 'calendar-title'
        });
        $.fn.calendar.currentLabel = $('<p />', {
            'class': 'current-label'
        });
        $.fn.calendar.displayLabel = $('<p />', {
            'class': 'display-label'
        });
        $.fn.calendar.calendarHeader = $('<thead />', $.fn.calendar.options.calendarHeaderAttributes)
            .html('<tr><th>S</th><th>M</th><th>T</th><th>W</th><th>T</th><th>F</th><th>S</th></tr>');
        $.fn.calendar.selectors = $('<form />',
            {'class': 'selectors' });
        $.fn.calendar.monthSelector = $('<select />', $.fn.calendar.options.monthSelectorAttributes);
        $.fn.calendar.yearSelector = $('<select />', $.fn.calendar.options.yearSelectorAttributes);
        $.fn.calendar.el = $('<table />', $.fn.calendar.options.tableAttributes);
        $.fn.calendar.row = $('<tr />', $.fn.calendar.options.rowAttributes);
        $.fn.calendar.rows = [];
        $.fn.calendar.cell = $('<td />', $.fn.calendar.options.cellAttributes);

        $.fn.calendar.nextButton = $('<button />', {
            'class': $.fn.calendar.defaults.nextMonthClassName
        }).text('Next');

        $.fn.calendar.previousButton = $('<button />', {
            'class': $.fn.calendar.defaults.previousMonthClassName
        }).text('Previous');

        return this.each(function () {
            var container = $.fn.calendar.container;
            var el = $.fn.calendar.el;
            var titleLabel = $.fn.calendar.titleLabel;
            var currentLabel = $.fn.calendar.currentLabel;
            var displayLabel = $.fn.calendar.displayLabel;
            var selectors = $.fn.calendar.selectors;
            var monthSelect = $.fn.calendar.monthSelector;
            var yearSelect = $.fn.calendar.yearSelector;
            var prevBtn = $.fn.calendar.previousButton;
            var nextBtn = $.fn.calendar.nextButton;
            var context = $(this);

            container.attr(opts.containerAttrs)
                .appendTo(this);

            titleLabel.appendTo(container).text(opts.title);
            currentLabel.appendTo(container).text('Current Label');
            displayLabel.appendTo(container).text('Display Label');
            prevBtn.appendTo(container);
            selectors.appendTo(container);
            monthSelect.appendTo(selectors);
            yearSelect.appendTo(selectors);
            nextBtn.appendTo(container);

            el.attr(opts.calendarAttrs)
                .appendTo(container);

            drawCalendar(context, $.fn.calendar.month, $.fn.calendar.year);
            populateSelectors();

            // Event Handlers
            $(opts.nextMonthSelector, this).bind('click', function (ev) {
                var month = $.fn.calendar.month
                    ,year = $.fn.calendar.year
                    ,nextMonth = ( month === 11 ) ? 0 : month + 1
                    ,nextYear = ( month === 11 ) ? year + 1 : year;

                console.log('Month: ', month);
                console.log('Next Month: ', nextMonth);

                $.fn.calendar.updateCalendar(context, nextMonth, nextYear);
            });

            $(opts.previousMonthSelector, this).bind('click', function (ev) {
                var month = $.fn.calendar.month
                    ,year = $.fn.calendar.year
                    ,nextMonth = ( month === 0 ) ? 11 : month - 1
                    ,nextYear = ( month === 0 ) ? year - 1 : year;

                $.fn.calendar.updateCalendar(context, nextMonth, nextYear);
            });

            $([$.fn.calendar.monthSelector, $.fn.calendar.yearSelector]).each(function (ind, val) {
                val.bind('change', function (ev) {
                    var m = parseFloat($.fn.calendar.monthSelector.find('option:selected').attr('value'));
                    var y = parseFloat($.fn.calendar.yearSelector.find('option:selected').attr('value'));

                    $.fn.calendar.updateCalendar(context, m, y);
                });
            });
        });
    };

    $.fn.calendar.defaults = {
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

    function drawCalendar (el, m, y) {
        var that = this
            ,calendarRows = []
            ,calHeader = $.fn.calendar.calendarHeader.clone()
            ,calendarTable = el.find('table');

        // remove all rows
        $('.dateRow', calendarTable).remove();
        $('thead', calendarTable).remove();

        // add weekday labels
        calHeader.appendTo(calendarTable);

        // draw six rows
        for ( var i = 0; i < 6; i++) {
            var row = $.fn.calendar.row.clone();

            row.appendTo(calendarTable);
            calendarRows.push(row);
        }

        $.each(calendarRows, function (ind, val) {
            for ( var n = 0; n < 7; n++ ) {
                var cell = $.fn.calendar.cell.clone().appendTo(val);
            }
        });

        createDateArray(el, m, y);
        updateHeaders(el);
    }

    function createDateArray (el, m, y) {
        var dateArray = []
            ,firstDay = getFirstDay(m, y)
            ,thisMonthLength = daysInMonth(m, y)
            ,lastMonth = ( m > 0 ) ? m - 1 : 11
            ,lastYear = ( m > 0 ) ? y : y - 1
            ,lastMonthLength = daysInMonth(lastMonth, lastYear)
            ,startingDate = 0
            ,cellSize = $('.dateCell').size()
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
        $.each($('.dateCell', el), function (ind, val) {
            $(val).addClass(dateArray[ind].className).html(dateArray[ind].date);
        });
    };

    function getFirstDay (m, y) {
        var tempDate = new Date();

        tempDate.setFullYear(y);
        tempDate.setMonth(m);
        tempDate.setDate(1);

        return tempDate.getDay();
    };

    function daysInMonth (m, y) {
        return 32 - new Date(y, m, 32).getDate();
    };

    function populateSelectors () {
        var that = this
            ,monthSelect = $.fn.calendar.monthSelector
            ,yearSelect = $.fn.calendar.yearSelector
            ,startYear = $.fn.calendar.year - 20
            ,endYear = $.fn.calendar.year + 20;

        for (var i = startYear; i < endYear; i++ ) {
            yearSelect.append('<option value="' + i + '">' + i + '</option>');

            if (i === $.fn.calendar.year) {
                yearSelect.find('option').last().attr('selected', 'selected');
            }
        }

        $.each(monthArray, function (ind, val) {
            monthSelect.append('<option value="' + ind + '">' + val + '</option>');
        });

        updateSelectors($.fn.calendar.month, $.fn.calendar.year);
    };

    $.fn.calendar.updateCalendar = function (context, m, y) {
        var calendarDate = $.fn.calendar.calendarDate;
        var month = $.fn.calendar.month;
        var year = $.fn.calendar.year;

        calendarDate.setMonth(m);
        calendarDate.setFullYear(y);

        month = calendarDate.getMonth();
        year = calendarDate.getFullYear();

        updateHeaders(context);

        drawCalendar(context, month, year);
        updateSelectors(context, m, y);
    };

    function updateSelectors (context, m, y) {
        var options = $(context).find($('option', $('.monthSelector')))
            ,monthSelect = $('.' + $.fn.calendar.options.monthSelectorAttributes.class, context)
            ,yearSelect = $('.' + $.fn.calendar.options.yearSelectorAttributes.class, context);

        monthSelect.val(m);
        yearSelect.val(y);
    };

    function updateHeaders (context) {
        $($.fn.calendar.currentLabel, context).html( dayArray[$.fn.calendar.todaysDate.getDay()] + ', ' + monthArray[$.fn.calendar.todaysDate.getMonth()] + ' ' + getOrdinal($.fn.calendar.todaysDate.getDate()) + ', ' + $.fn.calendar.todaysDate.getFullYear() );
        $($.fn.calendar.displayLabel, context).html( monthArray[$.fn.calendar.month] + ' ' + $.fn.calendar.year );
    };

    function getOrdinal (n) {
        var s = ['th','st','nd','rd']
            ,v = n % 100;

        return n + ( s[(v-20)%10] || s[v] || s[0] );
    }

}(jQuery));
