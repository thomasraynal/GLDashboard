glDashboard.controller('bindable', function bindableWidget($scope) {

    $scope.onEvent = function(eventName, action) {
        $scope.container.layoutManager.on(eventName, action);
        $scope.container.layoutManager.on(eventName, () => { $scope.$digest(); });
    };

});
