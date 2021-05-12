angular.module('monitoringGaugeDirectives', [])

.directive('monitoringGauge', function($compile, $routeParams, $http, dialog, $filter, lwResources, $modal, helper) {
	return {
		restrict: "E",
		replace: true,
		scope: {
			resource: '=',
			parent: '=',
			settings: '='
		},
        templateUrl: "partials/monitoring-gauge.html",
		link: function(scope, element, attrs) {
			scope.display = function(resource, default_value) {
				if ('undefined' !== typeof(resource.value)) {
					if (resource.def.type === "float") {
						return parseFloat(resource.value).toFixed(2);
					} else if (resource.def.type === "interger") {
						return parseInt(resource.value);
					}
					return resource.value;
				}
				return default_value;
			};
		}
	};
});
