(function($) {

    var calendarDate = new Date();
    var todaysDate = new Date();
    var dayArray = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var monthArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var date = calendarDate.getDate();
    var day = calendarDate.getDay();
    var month = calendarDate.getMonth();
    var year = calendarDate.getFullYear();
    var dateRows = $('.dateRow');

    $.fn.calendar = function (options) {
        options = options || {};

        var opts = $.extend( {}, $.fn.calendar.defaults, options );

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

            drawCalendar(month, year);
            populateSelectors();

            // Event Handlers
            $(opts.nextMonthSelector).bind('click', function (ev) {
                var nextMonth = ( month === 11 ) ? 0 : month + 1
                    ,nextYear = ( month === 11 ) ? year + 1 : year;

                $.fn.calendar.updateCalendar(nextMonth, nextYear);
            });

            $(opts.previousMonthSelector).bind('click', function (ev) {
                var nextMonth = ( month === 0 ) ? 11 : month - 1
                    ,nextYear = ( month === 0 ) ? year - 1 : year;

                $.fn.calendar.updateCalendar(nextMonth, nextYear);
            });

            $([$.fn.calendar.monthSelector, $.fn.calendar.yearSelector]).each(function (ind, val) {
                val.bind('change', function (ev) {
                    var m = parseFloat($.fn.calendar.monthSelector.find('option:selected').attr('value'));
                    var y = parseFloat($.fn.calendar.yearSelector.find('option:selected').attr('value'));

                    console.log(m, y);

                    $.fn.calendar.updateCalendar(m, y);
                });
            });
        });
    };

    $.fn.calendar.defaults = {
        'calendarAttrs': {
            'class': 'apervita-calendar'
        },
        'containerAttrs': {
            'class': 'apervita-calendar-container'
        },
        'message': 'New jQuery Plugin!',
        'nextMonthClassName': 'next',
        'nextMonthSelector': '.next',
        'previousMonthClassName': 'prev',
        'previousMonthSelector': '.prev',
        'title': 'jQuery Calendar by Ben Wasilewski'
    };

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
    $.fn.calendar.selectors = $('<form />',
        {'class': 'selectors' });
    $.fn.calendar.monthSelector = $('<select />', {
        class: 'monthSelector' });
    $.fn.calendar.yearSelector = $('<select />', {
        class: 'yearSelector' });
    $.fn.calendar.el = $('<table />');
    $.fn.calendar.row = $('<tr />', {
        'class': 'dateRow' });
    $.fn.calendar.cell = $('<td />', {
        'class': 'dateCell' });

    $.fn.calendar.nextButton = $('<button />', {
        'class': $.fn.calendar.defaults.nextMonthClassName
    }).text('Next');

    $.fn.calendar.previousButton = $('<button />', {
        'class': $.fn.calendar.defaults.previousMonthClassName
    }).text('Previous');


    function drawCalendar (m, y) {
        var that = this
            ,calendarRows = [];

        // TODO: Make this dynamic
        $('.dateRow').remove();

        for ( var i = 0; i < 6; i++) {
            var row = $.fn.calendar.row.clone();

            row.appendTo($.fn.calendar.el);

            calendarRows.push(row);
        }

        $.each(calendarRows, function (ind, val) {
            for ( var n = 0; n < 7; n++ ) {
                var cell = $('<td/>', { 'class': 'dateCell' }).appendTo(val);
            }
        });

        createDateArray(m, y);
        updateHeaders();
    }

    function createDateArray (m, y) {
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

        $.each($('.dateCell'), function (ind, val) {
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
            ,startYear = year - 20
            ,endYear = year + 20;

        for (var i = startYear; i < endYear; i++ ) {
            yearSelect.append('<option value="' + i + '">' + i + '</option>');

            if (i === year) {
                yearSelect.find('option').last().attr('selected', 'selected');
            }
        }

        $.each(monthArray, function (ind, val) {
            monthSelect.append('<option value="' + ind + '">' + val + '</option>');
        });

        updateSelectors(month, year);
    };

    $.fn.calendar.updateCalendar = function (m, y) {
        calendarDate.setMonth(m);
        calendarDate.setFullYear(y);

        month = calendarDate.getMonth();
        year = calendarDate.getFullYear();

        updateHeaders();

        drawCalendar(month, year);
        updateSelectors(m, y);
    };

    function updateSelectors (m, y) {
        var options = $('option', $('.monthSelector'))
            ,monthSelect = $.fn.calendar.monthSelector
            ,yearSelect = $.fn.calendar.yearSelector;

        monthSelect.val(m);
        yearSelect.val(y);
    };

    function updateHeaders () {
        $.fn.calendar.currentLabel.html( dayArray[todaysDate.getDay()] + ', ' + monthArray[todaysDate.getMonth()] + ' ' + getOrdinal(todaysDate.getDate()) + ', ' + todaysDate.getFullYear() );
        $.fn.calendar.displayLabel.html(monthArray[month] + ' ' + year);
    };

    function getOrdinal (n) {
        var s = ['th','st','nd','rd']
            ,v = n % 100;

        return n + ( s[(v-20)%10] || s[v] || s[0] );
    }

}(jQuery));
