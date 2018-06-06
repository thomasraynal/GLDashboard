glDashboard.directive('workspaceMenuLayoutClear', function(layouts, events) {
    return {
        restrict: "E",
        templateUrl: 'view.menu.layout.clear.html',
        controller: function($scope) {

            $scope.clearLayoutButtonOptions = {
                icon: 'trash',
                hint: 'Clear Layout',
                onClick: function(e) {
                    $scope.clearLayout();
                }
            };

        }

    }

});
