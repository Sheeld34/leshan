angular.module('monitoringOdometerDirectives', [])

.directive('monitoringOdometer', function($compile, $routeParams, $http, dialog, $filter, lwResources, $modal, helper) {
	return {
		restrict: "E",
		replace: true,
		scope: {
			resource: '=',
			settings: '='
		},
        templateUrl: "partials/monitoring-odometer.html",
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
					height: 200,
					margin: {
						top: 20,
						right: 20,
						bottom: 60,
						left: 55
					},
					x: function(d) { return d.x; },
					y: function(d) { return d.y; },
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

			scope.$watch('resource.value', function(newValue, oldValue) {
				if (newValue) {
					var value = parseFloat(newValue);

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

			scope.display = function(resource, default_value) {
				if ('undefined' !== typeof(resource.value)) {
					return parseFloat(resource.value);
				}
				return default_value;
			};

			scope.startObserve = function() {
				var format = scope.settings.single.format;
				var timeout = scope.settings.timeout.value;
				var uri = "api/clients/" + encodeURIComponent($routeParams.clientId) + scope.resource.path + "/observe";
				$http.post(uri, null, { params: { format: format, timeout: timeout } })
					.success(function(data, status, headers, config) {
						helper.handleResponse(data, scope.resource.observe, function(formattedDate) {
							if (data.success) {
								scope.resource.observed = true;
								if ("value" in data.content) {
									// single value
									scope.resource.value = data.content.value;
								}
								else if ("values" in data.content) {
									// multiple instances
									var tab = new Array();
									for (var i in data.content.values) {
										tab.push(i + "=" + data.content.values[i]);
									}
									scope.resource.value = tab.join(", ");
								}
								scope.resource.valuesupposed = false;
								scope.resource.tooltip = formattedDate;
							}
						});
					}).error(function(data, status, headers, config) {
						if (status == 504) {
							helper.handleResponse(null, scope.resource.observe);
						} else {
							errormessage = "Unable to start observation on resource " + scope.resource.path + " for " + $routeParams.clientId + " : " + status + " " + data;
							dialog.open(errormessage);
						}
						console.error(errormessage);
					});
			};

			scope.stopObserve = function() {
				var timeout = scope.settings.timeout.value;
				var uri = "api/clients/" + encodeURIComponent($routeParams.clientId) + scope.resource.path + "/observe";
				$http.delete(uri)
					.success(function(data, status, headers, config) {
						scope.resource.observed = false;
						scope.resource.observe.stop = "success";
					}).error(function(data, status, headers, config) {
						errormessage = "Unable to stop observation on resource " + scope.resource.path + " for " + $routeParams.clientId + " : " + status + " " + data;
						dialog.open(errormessage);
						console.error(errormessage);
					});
			};

			scope.read = function() {
				var timeout = scope.settings.timeout.value;
				var format = scope.settings.single.format;
				var uri = "api/clients/" + encodeURIComponent($routeParams.clientId) + scope.resource.path;
				$http.get(uri, { params: { format: format, timeout: timeout } })
					.success(function(data, status, headers, config) {
						// manage request information
						helper.handleResponse(data, scope.resource.read, function(formattedDate) {
							if (data.success && data.content) {
								if ("value" in data.content) {
									// single value
									scope.resource.value = data.content.value;
								}
								else if ("values" in data.content) {
									// multiple instances
									var tab = new Array();
									for (var i in data.content.values) {
										tab.push(i + "=" + data.content.values[i]);
									}
									scope.resource.value = tab.join(", ");
								}
								scope.resource.valuesupposed = false;
								scope.resource.tooltip = formattedDate;
							}
						});
					}).error(function(data, status, headers, config) {
						if (status == 504) {
							helper.handleResponse(null, scope.resource.read);
						} else {
							errormessage = "Unable to read resource " + scope.resource.path + " for " + $routeParams.clientId + " : " + status + " " + data;
							dialog.open(errormessage);
						}
						console.error(errormessage);
					});
			};
		}
	};
});
