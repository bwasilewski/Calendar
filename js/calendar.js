(function($) {

	var Calendar = {
		
		initialize: function initialize () {
			
			var that = this;

			// Set object properties
			this.calendar = $('.calendar').find('tbody');
			this.calendarDate = new Date();
			this.todaysDate = new Date();
			this.dayArray = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
			this.monthArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
			this.date = this.calendarDate.getDate();
			this.day = this.calendarDate.getDay();
			this.month = this.calendarDate.getMonth();
			this.year = this.calendarDate.getFullYear();
			this.dateRows = $('.dateRow');
	
			// Init!
			this.updateHeaders();
			this.drawCalendar(this.month, this.year);
			this.populateSelectors();

			// Event Handlers
			$('.next').bind('click', function (ev) {
				ev.preventDefault();

				var nextMonth = ( that.month === 11 ) ? 0 : that.month + 1
					,nextYear = ( that.month === 11 ) ? that.year + 1 : that.year;

				that.updateCalendar(nextMonth, nextYear);
			});

			$('.prev').bind('click', function (ev) {
				ev.preventDefault();

				var nextMonth = ( that.month === 0 ) ? 11 : that.month - 1
					,nextYear = ( that.month === 0 ) ? that.year - 1 : that.year;

				that.updateCalendar(nextMonth, nextYear);
			});

			$('.dateCell').bind('click', function () {
				$('.dateCell').removeClass('selected');
				$(this).addClass('selected');
			});

			$('.monthSelector, .yearSelector').bind('change', function (ev) {

				var month = parseFloat($('.monthSelector').find('option:selected').attr('value'));
				var year = parseFloat($('.yearSelector').find('option:selected').attr('value'));

				that.updateCalendar(month, year);
			});
		}

		,getOrdinal: function getOrdinal (n) {
			var s = ['th','st','nd','rd']
				,v = n % 100;

			return n + ( s[(v-20)%10] || s[v] || s[0] );
		}	

		,daysInMonth: function daysInMonth (month, year) {

			return 32 - new Date(year, month, 32).getDate();
		}

		,getFirstDay: function getFirstDay (month, year) {

			var tempDate = new Date();
			
			tempDate.setFullYear(this.year);
			tempDate.setMonth(this.month);
			tempDate.setDate(1);

			return tempDate.getDay();
		}

		,updateHeaders: function updateHeaders () {
			
			$('header').find('h1').html( this.dayArray[this.todaysDate.getDay()] + ', ' + this.monthArray[this.todaysDate.getMonth()] + ' ' + this.getOrdinal(this.todaysDate.getDate()) + ', ' + this.todaysDate.getFullYear() );
			$('h2').html(this.monthArray[this.month] + ' ' + this.year);
		}

		,createDateArray: function createDateArray(month, year) {
			var dateArray = []
				,firstDay = this.getFirstDay(month, year)
				,thisMonthLength = this.daysInMonth(month, year)
				,lastMonth = ( month > 0 ) ? month - 1 : 11
				,lastYear = ( month > 0 ) ? year : year - 1
				,lastMonthLength = this.daysInMonth(lastMonth, lastYear)
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
		}

		,drawCalendar: function drawCalendar (month, year) {

			var that = this
				,calendarRows = [];

			console.log('Date rows: ', $('.dateRow'));

			$('.dateRow').remove();

			for ( var i = 0; i < 6; i++) {
				
				var row = $('<tr/>', { 'class': 'dateRow' }).appendTo(that.calendar);

				calendarRows.push(row);
			}

			$.each(calendarRows, function (ind, val) {
				for ( var n = 0; n < 7; n++ ) {
					var cell = $('<td/>', { 'class': 'dateCell' }).appendTo(val);
				}
			});

			this.createDateArray(month, year);
		}

		,updateCalendar: function updateCalendar (month, year) {
			this.calendarDate.setMonth(month);
			this.calendarDate.setFullYear(year);

			this.month = this.calendarDate.getMonth();
			this.year = this.calendarDate.getFullYear();

			this.updateHeaders();

			this.drawCalendar(this.month, this.year);
		}

		,populateSelectors: function populateSelectors () {

			var that = this
				,selector = $('.yearSelector')
				,startYear = this.year - 20
				,endYear = this.year + 20;

			for (var i = startYear; i < endYear; i++ ) {
				selector.append('<option value="' + i + '">' + i + '</option>');

				if (i === that.year) {
					selector.find('option').last().attr('selected', 'selected');
				}
			}
		}

	};


	Calendar.initialize();


}(jQuery));