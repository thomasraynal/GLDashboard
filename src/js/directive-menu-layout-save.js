glDashboard.directive('workspaceMenuLayoutSave', function() {
    return {
        restrict: "E",
        templateUrl: 'view.menu.layout.save.html',
        controller: function($scope) {

            $scope.saveLayoutDefaultButtonOptions = {
                icon: 'floppy',
                bindingOptions: {
                    text: 'context.layoutKey',
                    disabled: 'isSaveLayoutDefaultDisabled'
                },
                onClick: $scope.saveLayoutAsDefault
            };

            $scope.saveLayoutTagButtonOptions = {
                icon: 'floppy',
                bindingOptions: {
                    text: 'context.layoutCategory'
                },
                onClick: $scope.saveLayoutAsDefaultForCategory
            };
        }
    };
});
