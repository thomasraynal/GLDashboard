glDashboard.directive('workspaceMenuCustom', function() {
    return {
        restrict: "E",
        templateUrl: '/plugins/html/view.menu.directive.custom.html',
        controller: function($scope) {

            $scope.generateColorsButtonOptions = {
                icon: 'tips',
                hint: 'Change Theme',
                onClick: function(e) {
                    DevExpress.ui.dialog.alert("This is a custom button", "Menu extensibility");
                }
            };

        }
    };
});
