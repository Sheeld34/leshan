angular.module('objectIpsoSensorControllers', [])

.controller('objectIpsoSensorController', [
	'$scope',
	function($scope) {
		var controller = this;
		this.sensor = {};
		this.gauge_options = {
			scaleMin: 0,
			scaleMax: 100,
			units: null
		};

		$scope.writable = function() { return false; }

		this.getValue = function() {
			if (typeof this.sensor.value !== 'undefined')
			{
				var precision = getFloatPrecision(this.sensor.value);
				if (precision > 2) {
					precision = 2;
				}
				
				return this.sensor.value.toFixed(precision);
			}
			
			return 0;
		}

		$scope.$on('collapseObjectEvent', function(event, open) {
		});

		$scope.$watch('instance.resources', function(newValue, oldValue) {
			if (newValue) {
				controller.update(newValue);
			}
		}, true);

		this.update = function(resources) {
			var options = {};
			
			for (resource of resources) {
				if (typeof resource.value !== 'undefined') {
					switch (resource.id) {
						case 5700: // Sensor Value (1.0)
							this.sensor.value = parseFloat(resource.value);
							break;
						case 5701: // Sensor Unit (1.0)
							this.sensor.units = resource.value;
							options.units = this.sensor.units;
							break;
						case 5601: // Min Measured Value (1.0)
							this.sensor.min_measured = resource.value;
							break;
						case 5602: // Max Measured Value (1.0)
							this.sensor.max_measured = resource.value;
							break;
						case 5603: // Min Measured Value (1.0)
							this.sensor.min_range = resource.value;
							options.scaleMin = this.sensor.min_range;
							break;
						case 5604: // Max Measured Value (1.0)
							this.sensor.max_range = resource.value;
							options.scaleMax = this.sensor.max_range;
							break;
						case 5821: // Current Calibration (1.0)
							this.sensor.calibration = resource.value;
							break;
						case 5750: // Application Type (1.0)
							this.sensor.application = resource.value;
							$scope.application = this.sensor.application;
 							break;
						case 5518: // Timestamp (1.1)
							this.sensor.timestamp = resource.value;
							break;
						case 6050: // Fractional Timestamp (1.1)
							this.sensor.fractional_timestamp = resource.value;
							break;
						case 6042: // Measurement Quality Indicator (1.1)
							this.sensor.quality_indicator = resource.value;
							break;
						case 6049: // Measurement Quality Level (1.1)
							this.sensor.quality_level = resource.value;
							break;
						default:
							break;
					}
				}
			}
			
			this.gauge_options = options;
		};

		function getFloatPrecision(a) {
			if (!isFinite(a)) {
				return 0;
			}
			var e = 1, p = 0;
			while (Math.round(a * e) / e !== a) {
				e *= 10; p++;
			}
			return p;
		}
	}
]);
