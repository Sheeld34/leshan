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
			if ('undefined' === typeof(scope.resource.def.range_min)) {
				// Retrieve min/max ranges
				var idx_min = scope.resource.def.range.indexOf(".");
				if (idx_min > 0) {
					scope.resource.def.range_min = parseFloat(scope.resource.def.range.substring(0, idx_min));
				}

				var idx_max = scope.resource.def.range.lastIndexOf(".");		
				if (idx_max != -1) {
					scope.resource.def.range_max = parseFloat(scope.resource.def.range.substring(idx_max + 1));
				}
			}

			scope.display = function(resource, default_value) {
				if ('undefined' !== typeof(resource.value)) {
					if (resource.def.type === "float") {
						return parseFloat(resource.value).toFixed(2);
					} else if (resource.def.type === "integer") {
						return parseInt(resource.value);
					}
					return resource.value;
				}
				return default_value;
			};
		}
	};
});
