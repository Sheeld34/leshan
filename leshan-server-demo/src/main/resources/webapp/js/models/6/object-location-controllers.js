angular.module('objectLocationControllers', [])

.controller('objectLocationController', [
	'$scope',
	'leafletData',
	'leafletMapEvents',
	function($scope, leafletData, leafletMapEvents) {
		//		var instance = $scope.$parent.$parent.instance;
		var controller = this;

		// Default center and zoom
		this.center = {
			lat: 45.095,
			lng: -3.823,
			zoom: 4
		};

		this.markers = null;

		this.layers = {
			baselayers: {
				osm: {
					name: 'OpenStreetMap',
					url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
					type: 'xyz',
					layerOptions: {
						attribution: '© <a href="http://www.openstreetmap.org/copyright" target="blank">OpenStreetMap</a> contributors'
					}
				},
				here_normal: {
					name: 'HERE Map',
					url: 'http://1.base.maps.cit.api.here.com/maptile/2.1/maptile/newest/normal.day/{z}/{x}/{y}/256/png8?lg=FRE&app_id=xWVIueSv6JL0aJ5xqTxb&app_code=djPZyynKsbTjIUDOBcHZ2g',
					type: 'xyz',
					layerOptions: {
						attribution: '© 2021 <a href="http://www.here.com" target="blank">HERE</a>'
					}
				},
				here_hybrid: {
					name: 'HERE Satellite',
					url: 'http://1.aerial.maps.cit.api.here.com/maptile/2.1/maptile/newest/hybrid.day/{z}/{x}/{y}/256/png8?lg=FRE&app_id=xWVIueSv6JL0aJ5xqTxb&app_code=djPZyynKsbTjIUDOBcHZ2g',
					type: 'xyz',
					layerOptions: {
						attribution: '© 2021 <a href="http://www.here.com" target="blank">HERE</a>'
					}
				}
			}
		};

		$scope.$on('collapseEvent', function(event, open) {
			leafletData.getMap().then(function(map) {
				map.invalidateSize();
			});
		});

		$scope.$watch('instance.resources', function(newValue, oldValue) {
			if (newValue) {
				controller.update(newValue);
			}
		}, true);

		this.update = function(resources) {
			var timestamp = null;
			var latitude = null;
			var longitude = null;
		
			for (resource of resources) {
				if (typeof resource.value !== 'undefined') {
					switch (resource.id) {
						case 0: // latitude
							latitude = resource.value;
							break;
						case 1: // longitude
							longitude = resource.value;
							break;
						case 2: // altitude
							break;
						case 3: // radius
							break;
						case 4: // velocity
							break;
						case 5: // timestamp
							timestamp = resource.value;
							break;
						case 4: // speed
							break;
						default:
							break;
					}

					if (latitude && longitude)
					{
						this.markers = {
							locationMarker: {
								lat: latitude,
								lng: longitude,
								message: timestamp,
								focus: true
							}
						};

						this.center.lat = latitude;
						this.center.lng = longitude;
					}
				}
			}
		};
	}
]);
