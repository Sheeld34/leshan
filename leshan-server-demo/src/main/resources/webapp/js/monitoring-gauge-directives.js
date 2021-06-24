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
			
			scope.chart_options = {
				series: [
					{
						axis: 'y',
						dataset: 'dataset0',
						key: 'y_0',
						color: "#1f77b4",
						type: ['line'],
						label: scope.resource.def.units
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
						min: 0,
						max: 0,
						tickFormat: function(value, index) {
							return d3.format('.1')(value);
						}
					}
				}
			};

			scope.chart_data = { dataset0: [] };
			
			scope.$watch('resource', function(newValue, oldValue) {
				if ('undefined' !== typeof(newValue.value) && newValue.tooltip != oldValue.tooltip) {
					addValue(parseFloat(newValue.value), scope.resource.def.range_min, scope.resource.def.range_max);
				}
			}, true);

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

			function addValue(value, range_min, range_max) {
				if (scope.chart_data.dataset0.length == 0) {
					scope.chart_data.dataset0.min = value;
					scope.chart_data.dataset0.max = value;
				}
				else if (value < scope.chart_data.dataset0.min) {
					scope.chart_data.dataset0.min = value;
				}
				else if (value > scope.chart_data.dataset0.max) {
					scope.chart_data.dataset0.max = value;
				}

				var graph_min = scope.chart_data.dataset0.min * 0.95;
				if ('undefined' !== typeof(range_min) && graph_min < range_min) {
					graph_min = range_min;
				}

				var graph_max = scope.chart_data.dataset0.max * 1.05;
				if ('undefined' !== typeof(range_max) && graph_max > range_max) {
					graph_max = range_max;
				}

				if (scope.chart_data.dataset0.length >= 200) {
					scope.chart_data.dataset0.shift();
				}

				scope.chart_options.axes.y.min = graph_min;
				scope.chart_options.axes.y.max = graph_max;
				scope.chart_data.dataset0.push({ x: new Date(), y_0: value });
			}
		}
	};
});
