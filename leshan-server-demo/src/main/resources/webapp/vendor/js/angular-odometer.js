angular.module('ui.odometer', [])

.directive('ngOdometer', function($compile, $routeParams, $http, dialog, $filter, lwResources, $modal, helper) {
	return {
		restrict: 'E',
		scope: {
			value: '@',
			options: '=?'
		},
		link: function(scope, element, attrs) {
			var options = (_ref = scope.options) != null ? _ref : {};
			options.el = element[0];
			options.value = scope.value;
			
			var od = new Odometer(options);
			od.render();

			// update the odometer element when there is a change in the model value.
			scope.$watch('value', function(newValue, oldValue) {
				od.update(newValue);
			});
		}
	};
});
