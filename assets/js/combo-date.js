angular.module('combo-date', [])

.directive('comboDate', function () {
    return {
        restrict: 'E',
        require: 'ngModel',
        transclude: true,
        templateUrl: 'geekstrap/directives/combo-date/combo-date.html',
        link: function (scope, element, attrs, ngModel) {
            scope.years = [];
            var today = new Date();
            for (var i = 1900; i <= today.getFullYear(); i++) {
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
                scope.selectedDay = date.getDate();
                scope.selectedMonth = date.getMonth();
                scope.selectedYear = date.getFullYear();
            };

            scope.pick = function () {
                var date = new Date(ngModel.$viewValue);
                date.setDate(scope.selectedDay);
                date.setMonth(scope.selectedMonth);
                date.setYear(scope.selectedYear);
                ngModel.$setViewValue(date);
                ngModel.$commitViewValue();
            };

            ngModel.$formatters.push(function (dateString) {
                return new Date(moment(dateString).utc().format('YYYY-MM-DD'));
            });
        }
    };
})

.run(function ($templateCache) {
    $templateCache.put('combo-date/templates/combo-date.html', [
    '<div class="form-group combo-date">',
    '<label class="col-sm-2" ng-transclude></label>',
    '<div class="col-sm-10 text-left form-inline">',
    '<div class="form-group">',
    '<select class="form-control"',
    'ng-options="day for day in days"',
    'ng-change="pick()"',
    'ng-model="selectedDay">',
    '<option value="">D&iacute;a</option>',
    '</select>',
    '</div>',
    '<div class="form-group">',
    '<select class="form-control"',
    'ng-options="month.index as month.label for month in months"',
    'ng-change="pick()"',
    'ng-model="selectedMonth">',
    '<option value="">Mes</option>',
    '</select>',
    '</div>',
    '<div class="form-group">',
    '<select class="form-control"',
    'ng-options="year for year in years"',
    'ng-change="pick()"',
    'ng-model="selectedYear">',
    '<option value="">A&ntilde;o</option>',
    '</select>',
    '</div>',
    '</div>',
    '</div>',
    ].join(''));
});
