angular.module('combo-date', [])

.provider('ComboDate', function () {
    var provider = this;

    this.templateUrl = 'combo-date/templates/combo-date.html';

    this.months = [
        'Enero',
        'Febrero',
        'Marzo',
        'Abril',
        'Mayo',
        'Junio',
        'Julio',
        'Agosto',
        'Septiembre',
        'Octubre',
        'Noviembre',
        'Diciembre'
    ];

    this.labels = {
        day: 'Día',
        month: 'Mes',
        year: 'Año'
    };

    this.$get = function () {
        return {
            templateUrl: provider.templateUrl,
            months: provider.months.map(function (month, index) {
                return {
                    label: month,
                    index: index
                };
            }),
            labels: provider.labels
        };
    };
})

.directive('comboDate', function (ComboDate) {
    return {
        restrict: 'E',
        require: 'ngModel',
        replace: true,
        scope: {
            min: '=?',
            max: '=?'
        },
        templateUrl: ComboDate.templateUrl,
        link: function (scope, element, attrs, ngModel) {
            scope.years = [];
            var min = scope.min || 1900;
            var max = scope.max || moment().year();

            for (var i = min; i <= max; i++) {
                scope.years.unshift(i);
            }

            scope.labels = ComboDate.labels;

            scope.months = ComboDate.months;

            scope.days = [];
            for (var i = 1; i <= 31; i++) {
                scope.days.push(i);
            }

            ngModel.$render = function () {
                var date = ngModel.$viewValue;
                if (!date) return;
                date = moment(date);
                if (isNaN(date)) return;
                scope.selectedDay = date.date();
                scope.selectedMonth = date.month();
                scope.selectedYear = date.year();
                ngModel.$commitViewValue();
            };

            scope.pick = function () {
                ngModel.$setValidity('date', (function() {
                    if (!scope.selectedDay ||
                        !scope.selectedMonth ||
                        !scope.selectedYear)
                        return false;
                    var maxDate = moment({
                        year: scope.selectedYear,
                        month: scope.selectedMonth + 1,
                        date: 0
                    }).date();
                    if (maxDate < scope.selectedDay) {
                        scope.selectedDay = maxDate;
                    }
                    var date = moment({
                        year: scope.selectedYear,
                        month: scope.selectedMonth,
                        day: scope.selectedDay
                    });
                    if (isNaN(date.valueOf()))
                        return false;
                    ngModel.$setViewValue(date);
                    ngModel.$commitViewValue();
                    return true;
                })());
            };

            ngModel.$formatters.push(function (dateString) {
                if (!dateString) return undefined;
                return moment(dateString);
            });
        }
    };
});
