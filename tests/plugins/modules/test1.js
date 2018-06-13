angular
    .module('test1', ['glDashboard'])
    .controller('test1', function test1($scope, $timeout, $element, $controller, testEvent) {
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
