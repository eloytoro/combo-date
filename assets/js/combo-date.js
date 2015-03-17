angular.module('combo-date', [])

.provider('ComboDate', function () {
    var provider = this;

    this.templateUrl = 'combo-date/templates/combo-date.html';

    this.$get = function () {
        return {
            templateUrl: provider.templateUrl
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

            scope.months = [{
                label: 'Enero',
                index: 0
            }, {
                label: 'Febrero',
                index: 1
            }, {
                label: 'Marzo',
                index: 2
            }, {
                label: 'Abril',
                index: 3
            }, {
                label: 'Mayo',
                index: 4
            }, {
                label: 'Junio',
                index: 5
            }, {
                label: 'Julio',
                index: 6
            }, {
                label: 'Agosto',
                index: 7
            }, {
                label: 'Septiembre',
                index: 8
            }, {
                label: 'Octubre',
                index: 9
            }, {
                label: 'Noviembre',
                index: 10
            }, {
                label: 'Diciembre',
                index: 11
            }];

            scope.days = [];
            for (var i = 1; i <= 31; i++) {
                scope.days.push(i);
            }

            ngModel.$render = function () {
                var date = ngModel.$viewValue;
                if (!date) return;
                date = moment(date).utc();
                if (isNaN(date)) return;
                scope.selectedDay = date.date();
                scope.selectedMonth = date.month();
                scope.selectedYear = date.year();
                ngModel.$commitViewValue();
            };

            scope.pick = function () {
                ngModel.$setValidity('date', (function() {
                    if (scope.selectedDay === undefined ||
                        scope.selectedMonth === undefined ||
                        scope.selectedYear === undefined)
                        return false;
                    if (moment({
                        year: scope.selectedYear,
                        month: scope.selectedMonth + 1,
                        date: 0
                    }).date() < scope.selectedDay)
                        return false;
                    var date = moment({
                        year: scope.selectedYear,
                        month: scope.selectedMonth,
                        day: scope.selectedDay
                    }).utc();
                    if (isNaN(date.valueOf()))
                        return false;
                    ngModel.$setViewValue(date);
                    ngModel.$commitViewValue();
                    return true;
                })());
            };

            ngModel.$formatters.push(function (dateString) {
                if (!dateString) return undefined;
                return moment(dateString).utc();
            });
        }
    };
});
