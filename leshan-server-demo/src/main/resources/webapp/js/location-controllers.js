var app = angular.module('locationControllers', []);

app.controller('locationController', function($scope, $location) {
	$scope.isDemoLocation = ($location.host() === 'demo.iot.sheeld.co');
});
