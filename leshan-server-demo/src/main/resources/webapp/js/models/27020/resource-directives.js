angular.module('model27020-resourceDirectives', [])

.directive('model27020Resource', function($compile, $routeParams, $http, dialog, $filter, lwResources, $modal, helper) {
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
				case 4:
				case 5:
				case 6:
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
