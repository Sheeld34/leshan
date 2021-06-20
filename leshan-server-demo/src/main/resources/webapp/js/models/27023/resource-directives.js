angular.module('model27023-resourceDirectives', [])

.directive('model27023Resource', function($compile, $routeParams, $http, dialog, $filter, lwResources, $modal, helper) {
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
				case 0:
				case 1:
				case 4:
				case 5:
				case 6:
				case 7:
				case 8:
				case 9:
				case 10:
				case 11:
				case 12:
				case 13:
				case 14:
				case 15:
				case 16:
				case 17:
				case 18:
				case 19:
				case 20:
				case 46:
				case 47:
				case 48:
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
