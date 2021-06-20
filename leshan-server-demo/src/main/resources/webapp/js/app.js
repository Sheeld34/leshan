/*******************************************************************************
 * Copyright (c) 2013-2015 Sierra Wireless and others.
 * 
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v2.0
 * and Eclipse Distribution License v1.0 which accompany this distribution.
 * 
 * The Eclipse Public License is available at
 *    http://www.eclipse.org/legal/epl-v20.html
 * and the Eclipse Distribution License is available at
 *    http://www.eclipse.org/org/documents/edl-v10.html.
 * 
 * Contributors:
 *     Sierra Wireless - initial API and implementation
 *******************************************************************************/

'use strict';

/* App Module */

var sheeldApp = angular.module('SheeldApp', [
	'ngRoute',
	'clientControllers',
	'objectDirectives',
	'instanceDirectives',
	'resourceDirectives',
	'resourceFormDirectives',
	'resourceObserveDirectives',
	'lwResourcesServices',
	'securityControllers',
	'locationControllers',
	'uiDialogServices',
	'modalInstanceControllers',
	'modalResourceControllers',
	'resourceAccordionGroupControllers',
	'ui.bootstrap',
	'helperServices',
	'fileModelDirectives',
	'angular-dialgauge',
	'nvd3',
	'ui-leaflet',
	'ui.odometer',
	'linearGraphDirectives',
	'monitoringGaugeDirectives',
	'monitoringOdometerDirectives',
	'objectLocationControllers',
	'model3-resourceDirectives',
	'model27000-resourceDirectives',
	'model27020-resourceDirectives',
	'model27022-resourceDirectives',
	'model27023-resourceDirectives',
	'model27241-resourceDirectives',
	'objectIpsoSensorControllers',
]);

sheeldApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	$routeProvider.
		when('/clients', { templateUrl: 'partials/client-list.html', controller: 'ClientListCtrl' }).
		when('/clients/:clientId', { templateUrl: 'partials/client-detail.html', controller: 'ClientDetailCtrl' }).
		when('/security', { templateUrl: 'partials/security-list.html', controller: 'SecurityCtrl' }).
		otherwise({ redirectTo: '/clients' });
}]);
