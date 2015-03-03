'use strict';

/**
 * @ngdoc overview 
 * @name ibmappApp
 * @description
 * # ibmappApp
 *
 * Main module of the application.
 */
angular
  .module('ibmappApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])

  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/National_Density_Analysis', {
        templateUrl: 'views/National_Density_Analysis.html',
        controller: 'MainCtrl'
      }).when('/bayes_clusters', {
        templateUrl: 'views/bayes_clusters.html',
        controller: 'ClusterCtrl'
      }).when('/Time_Series', {
        templateUrl: 'views/Time_Series.html',
        controller: 'TimemapCtrl'
      }).when('/Predicting_Emergency_Response', {
        templateUrl: 'views/Predicting_Emergency_Response.html',
        controller: 'PredictingCtrl'
      }).when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
