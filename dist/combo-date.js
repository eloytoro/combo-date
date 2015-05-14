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

.directive('comboDate', ["ComboDate", function (ComboDate) {
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
}]);

angular.module("combo-date").run(["$templateCache", function($templateCache) {$templateCache.put("combo-date/templates/combo-date.html","<div class=\"form-group combo-date\">\n    <div class=\"text-left form-inline\">\n        <div class=\"form-group\">\n            <select class=\"form-control\"\n                ng-options=\"day for day in days\"\n                ng-change=\"pick()\"\n                ng-model=\"selectedDay\">\n                <option value=\"\">D&iacute;a</option>\n            </select>\n        </div>\n        <div class=\"form-group\">\n            <select class=\"form-control\"\n                ng-options=\"month.index as month.label for month in months\"\n                ng-change=\"pick()\"\n                ng-model=\"selectedMonth\">\n                <option value=\"\">Mes</option>\n            </select>\n        </div>\n        <div class=\"form-group\">\n            <select class=\"form-control\"\n                ng-options=\"year for year in years\"\n                ng-change=\"pick()\"\n                ng-model=\"selectedYear\">\n                <option value=\"\">A&ntilde;o</option>\n            </select>\n        </div>\n    </div>\n</div>\n");}]);