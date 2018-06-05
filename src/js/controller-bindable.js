glDashboard.controller('bindable', function bindableWidget($scope) {

    $scope.onEvent = function(eventName, action) {
        $scope.container.layoutManager.eventHub.on(eventName, action);
        $scope.container.layoutManager.eventHub.on(eventName, () => { });
    };

});
