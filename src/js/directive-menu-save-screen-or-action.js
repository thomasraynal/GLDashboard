glDashboard.directive('workspaceMenuLayoutSaveScreenOrAction', function() {
    return {
        restrict: "E",
        templateUrl: 'view.menu.layout.save.screen.or.action.html',
        controller: function($scope) {

            $scope.saveLayoutAsScreenOrActionButtonOptions = {
                icon: 'floppy',
                bindingOptions: {
                    text: 'saveContextAsScreenOrActionLabel',
                    visible: 'saveContextAsScreenOrActionVisible'
                },
                onClick: function(e) {
                    saveLayout($scope.context.layoutKey, $scope.context.layoutKey, $scope.context.isScreen, $scope.context.isAction);
                }
            };
        }
    };
});
