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
		
		this.chart_options = {
			series: [
				{
					axis: 'y',
					dataset: 'dataset0',
					key: 'y_0',
					color: "#1f77b4",
					type: ['line']
				}
			],
			axes: {
				x: {
					key: 'x',
					type: 'date',
					tickFormat: function(value, index) {
						return d3.time.format('%H:%M:%S')(value);
					}
				},
				y: {
					tickFormat: function(value, index) {
						return getPrecisionValue(value, 2);
					}
				}
			},
			symbols: [
				{
					type: 'hline',
					color: 'hsla(120, 100%, 36%, 1)',
					axis: 'y'
				},
				{
					type: 'hline',
					color: 'hsla(5, 100%, 36%, 1)',
					axis: 'y'
				}
			]
		};

		this.chart_data = { dataset0: [] };

		$scope.writable = function() { return false; }

		$scope.$on('collapseObjectEvent', function(event, open) {
		});

		$scope.$watch('instance.resources', function(newValue, oldValue) {
			if (newValue) {
				controller.update(newValue);
			}
		}, true);

		this.getValue = function() { return getPrecisionValue(this.sensor.value, 2); };

		this.update = function(resources) {
			var options = {};
			
			for (resource of resources) {
				if (typeof resource.value !== 'undefined') {
					switch (resource.id) {
						case 5700: // Sensor Value (1.0)
							this.sensor.value = parseFloat(resource.value);
							this.addValue(this.sensor.value);
							break;
						case 5701: // Sensor Unit (1.0)
							this.sensor.units = resource.value;
							options.units = this.sensor.units;
							this.chart_options.series[0].label = this.sensor.units;
							break;
						case 5601: // Min Measured Value (1.0)
							this.sensor.min_measured = resource.value;
							this.chart_options.axes.y.min = this.sensor.min_measured * 0.99;
							this.chart_options.symbols[0].value = this.sensor.min_measured;
							break;
						case 5602: // Max Measured Value (1.0)
							this.sensor.max_measured = resource.value;
							this.chart_options.axes.y.max = this.sensor.max_measured * 1.01;
							this.chart_options.symbols[1].value = this.sensor.max_measured;
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

		this.addValue = function(value) {
			if ('undefined' === typeof(this.chart_options.axes.y.min)) {
				this.chart_options.axes.y.min = value;
			}
			if ('undefined' === typeof(this.chart_options.axes.y.max)) {
				this.chart_options.axes.y.max = value;
			}

			if (this.chart_data.dataset0.length >= 200) {
				this.chart_data.dataset0.shift();
			}

			this.chart_data.dataset0.push({ x: new Date(), y_0: value });
		};

		function getPrecisionValue(value, prec) {
			if (typeof value !== 'undefined')
			{
				var precision = getFloatPrecision(value);
				if (precision > prec) {
					precision = prec;
				}
				
				return value.toFixed(precision);
			}
			
			return 0;
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
