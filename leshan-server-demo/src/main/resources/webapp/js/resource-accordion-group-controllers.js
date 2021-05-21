angular.module('resourceAccordionGroupControllers', [])

.controller('resourceAccordionGroupController', [
	'$scope',
	function($scope) {
        $scope.$watch('status.open', function(newValue, oldValue) {
            if (newValue) {
                $scope.$broadcast('collapseResourceEvent', newValue);
            }
        }, true);
	}
]);
