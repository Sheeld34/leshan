angular.module('linearGraphDirectives', [])

.directive('linearGraph', function($compile, $routeParams, $http, dialog, $filter, lwResources, $modal, helper) {
	return {
		restrict: "E",
		replace: true,
        template: '<nvd3 options="chart_options" data="chart_data" api="api"></nvd3>',
		link: function(scope, element, attrs) {
			// Retrieve min/max ranges
			var idx_min = scope.resource.def.range.indexOf(".");
			if (idx_min > 0) {
				scope.resource.def.range_min = parseFloat(scope.resource.def.range.substring(0, idx_min));
			}

			var idx_max = scope.resource.def.range.lastIndexOf(".");		
			if (idx_max != -1) {
				scope.resource.def.range_max = parseFloat(scope.resource.def.range.substring(idx_max + 1));
			}

			scope.chart_options = {
				chart: {
					type: 'lineChart',
					x: function(d) { return d.x; },
					y: function(d) { return d.y; },
					height: 180,
					showValues: true,
					showLegend: false,
					noData: "",
					transitionDuration: 300,
					useInteractiveGuideline: true,
					xAxis: {
						tickFormat: function(d) {
							return d3.time.format('%H:%M:%S')(new Date(d));
						},
						axisLabel: 'Time',
						showMaxMin: false
					},
					yAxis: {
						tickFormat: function(d) {
							return d3.format('.1')(d);
						},
						axisLabel: scope.resource.def.units,
						axisLabelDistance: 30,
						showMaxMin: false
					}
				}
			};

			scope.chart_data = [{
				key: scope.resource.def.name,
				values: [],
				min: null,
				max: null
			}];

			scope.$watch('resource', function(newValue, oldValue) {
				if ('undefined' !== typeof(newValue.value)) {
					var value = parseFloat(newValue.value);

					if (scope.chart_data[0].values.length == 0) {
						scope.chart_data[0].min = value;
						scope.chart_data[0].max = value;
					}
					else if (value < scope.chart_data[0].min) {
						scope.chart_data[0].min = value;
					}
					else if (value > scope.chart_data[0].max) {
						scope.chart_data[0].max = value;
					}

					var graph_min = scope.chart_data[0].min * 0.9;
					if ('undefined' !== typeof(scope.resource.def.range_min) && graph_min < scope.resource.def.range_min) {
						graph_min = scope.resource.def.range_min;
					}
					
					var graph_max = scope.chart_data[0].max * 1.1;
					if ('undefined' !== typeof(scope.resource.def.range_max) && graph_max > scope.resource.def.range_max) {
						graph_max = scope.resource.def.range_max;
					}

					if (scope.chart_data[0].values.length >= 200) {
						scope.chart_data[0].values.shift();
					}
					
					scope.chart_options.chart.forceY = [graph_min, graph_max];
					scope.chart_data[0].values.push({ x: Date.now(), y: value });
				}
			}, true);

			scope.$on('collapseResourceEvent', function(event, open) {
				if (open === true) {
					scope.api.refresh();
				}
			});
		}
	};
});
