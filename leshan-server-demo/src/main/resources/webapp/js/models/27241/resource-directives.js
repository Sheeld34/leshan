angular.module('model27241-resourceDirectives', [])

.directive('model27241Resource', function($compile, $routeParams, $http, dialog, $filter, lwResources, $modal, helper) {
	return {
		restrict: "E",
		replace: true,
		scope: {
			resource: '=',
			parent: '=',
			settings: '='
		},
		link: function(scope, element, attrs) {
			switch (scope.resource.def.id) {
				case 13: // Charging stage duration
				case 21: // Momentary current value
				case 22: // Remaining charge
				case 24: // Momentary energy consumption
				case 25: // Energy left
				case 26: // Distance remaining
				case 27: // Distance traveled
					scope.getTemplateUrl = "partials/resource-odometer.html";
					break;

				case 14: // Minimum cell voltage
				case 15: // 
				case 16: // 
//				case 17: // 
				case 18: // 
				case 19: // 
				case 20: // 
				case 23: //
					scope.getTemplateUrl = "partials/resource-gauge.html";
					break;

				default:
					scope.getTemplateUrl = "partials/resource.html";
					break;
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
		},
		template: '<ng-include src="getTemplateUrl"></ng-include>'
	};
});
