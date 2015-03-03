angular.module('combo-date', [])

.directive('comboDate', function () {
    return {
        restrict: 'E',
        require: 'ngModel',
        replace: true,
        scope: {
            min: '=?',
            max: '=?'
        },
        templateUrl: 'combo-date/templates/combo-date.html',
        link: function (scope, element, attrs, ngModel) {
            scope.years = [];
            var today = new Date();
            var min = scope.min || 1900;
            var max = scope.max || today.getFullYear();

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
                if (!(date instanceof Date))
                    date = new Date(date);
                if (isNaN(date)) return;
                scope.selectedDay = date.getDate();
                scope.selectedMonth = date.getMonth();
                scope.selectedYear = date.getFullYear();
                ngModel.$commitViewValue();
            };

            scope.pick = function () {
                ngModel.$setValidity('date', (function() {
                    if (scope.selectedDay === undefined || scope.selectedMonth === undefined || scope.selectedYear === undefined)
                        return false;
                    if ((new Date(scope.selectedYear, scope.selectedMonth + 1, 0)).getDate() < scope.selectedDay)
                        return false;
                    var date = new Date(Date.UTC(scope.selectedYear, scope.selectedMonth, scope.selectedDay));
                    if (isNaN(date.getTime()))
                        return false;
                    ngModel.$setViewValue(date);
                    ngModel.$commitViewValue();
                    console.log(date);
                    return true;
                })());
            };

            ngModel.$formatters.push(function (dateString) {
                if (!dateString) return undefined;
                return new Date(moment(dateString).utc().format('YYYY-M-DD'));
            });
        }
    };
});
