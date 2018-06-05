angular
    .module('test1', ['glDashboard'])
    .controller('test1', function test1($scope, $timeout, $element, $controller) {
        $controller('widget', { $scope: $scope });
    });
