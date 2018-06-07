glDashboard.config(function($routeProvider, $locationProvider) {

    $routeProvider
        .when('/', {
            templateUrl: 'view.workspace.html',
            controller: 'workspace'
        })
        .when('/workspace', {
            templateUrl: 'view.workspace.html',
            controller: 'workspace',
        })
        .otherwise({ redirectTo: '/' });

    $locationProvider.hashPrefix('');

});

glDashboard.run(function($rootScope, $location, $http) {

    $http
        .get("version.json")
        .then((response) => {
            $rootScope.appVersion = response.data.version;
            $rootScope.appName = response.data.name;
            $rootScope.appTitle = response.data.title;
            $rootScope.appIcon = response.data.icon;
        }, (err) => $log.error(err));

});
