glDashboard.directive('workspaceMenuActionsAndScreens', function(layouts, events) {
    return {
        restrict: "E",
        templateUrl: 'view.menu.actions.and.screens.html',
        controller: function($scope) {

            $scope.onInitialized(() => {

                createScreenMenu();
                createActionMenu();

                $scope.goldenLayout.eventHub.on(events.layoutChanged, function(date) {
                    createActionMenu();
                    createScreenMenu();
                });

            });

            $scope.actions = [];
            $scope.screens = [];

            $scope.actionMenuOptions = {
                bindingOptions: {
                    dataSource: 'actions'
                },
                hideSubmenuOnMouseLeave: true,
                displayExpr: "name",
                onItemClick: loadScreenOrAction
            };

            $scope.screenMenuOptions = {
                bindingOptions: {
                    dataSource: 'screens'
                },
                hideSubmenuOnMouseLeave: true,
                displayExpr: "name",
                onItemClick: loadScreenOrAction
            };


            function loadScreenOrAction(data) {

                if (data.itemData.type == 'category') return

                $scope.changeLayout(data.itemData.name);
            };

            function createScreenMenu() {

                return layouts
                    .getAvailableScreens()
                    .then((screens) => {
                        $scope.screens = [{
                            name: 'Screens',
                            type: 'category',
                            items: _.transform(screens, (aggregate, screen) => aggregate.push({ name: screen.layoutKey, type: 'screen' }), [])
                        }];
                    });
            };

            function createActionMenu() {

                return layouts
                    .getAvailableActions()
                    .then((actions) => {
                        $scope.actions = [{
                            name: 'Actions',
                            type: 'category',
                            items: _.transform(actions, (aggregate, action) => aggregate.push({ name: action.layoutKey, type: 'action' }), [])
                        }];
                    });
            };

        }
    };
});
