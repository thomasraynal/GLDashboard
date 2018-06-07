angular
    .module('test2', ['glDashboard'])
    .controller('test2', function test2(
        $scope,
        $location,
        $timeout,
        $controller,
        $element,
        $q) {
        $controller('widget', { $scope: $scope });

    });
