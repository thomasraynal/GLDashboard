angular
    .module('test2', ['glDashboard'])
    .controller('test2', function test2($scope, $timeout, $element, $controller, testEvent) {
        $controller('widget', { $scope: $scope });
        $controller('bindable', { $scope: $scope });

        $scope.state = null;

        $scope.raiseEvent = (value) => {
            $scope.container.layoutManager.emit(testEvent, value);
        };

        $scope.onEvent(testEvent, (value) => {
            $scope.state = value;
        });

    });
