define([
], function () {

  return {
    getDate: function (date) {
      var whatDay = this.getDayOfWeek(date);
      var whatMonth = this.getMonth(date);
      var fullDate = whatDay + ', ' + date.getDate() + ' ' + whatMonth + ' ' + date.getFullYear();
      return fullDate;
    },
    getDayOfWeek: function (date) {
      var dayOfWeek;
      switch (date.getDay()) {
        case 0:
          dayOfWeek = 'Su';
          break;
        case 1:
          dayOfWeek = 'Mo';
          break;
        case 2:
          dayOfWeek = 'Tu';
          break;
        case 3:
          dayOfWeek = 'We';
          break;
        case 4:
          dayOfWeek = 'Th';
          break;
        case 5:
          dayOfWeek = 'Fr';
          break;
        case 6:
          dayOfWeek = 'Sa';
          break;
      }
      return dayOfWeek;
    },
    getMonth: function (date) {
      var month;
      switch (date.getMonth()) {
        case 0:
          month = 'Jan';
          break;
        case 1:
          month = 'Feb';
          break;
        case 2:
          month = 'March';
          break;
        case 3:
          month = 'April';
          break;
        case 4:
          month = 'May';
          break;
        case 5:
          month = 'June';
          break;
        case 6:
          month = 'July';
          break;
        case 7:
          month = 'August';
          break;
        case 8:
          month = 'Sept';
          break;
        case 9:
          month = 'Oct';
          break;
        case 10:
          month = 'Nov';
          break;
        case 11:
          month = 'Dec';
          break;
      }
      return month;
    }
  };
});
