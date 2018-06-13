glDashboard.directive('workspaceMenuWidgets', function(widgets, glDashboardEvents, customWidgets) {
    return {
        restrict: "E",
        templateUrl: 'view.menu.widgets.html',
        controller: function($scope, $timeout) {

            $scope.onInitialized(() => {

                createWidgetMenu();

                $scope.goldenLayout.on(glDashboardEvents.customWidgetCreated, function() {
                    createWidgetMenu();
                });

                $scope.goldenLayout.on(glDashboardEvents.customWidgetDeleted, function() {
                    createWidgetMenu();
                });
            });

            function createWidgetMenu() {

                return widgets
                    .getWidgets()
                    .then((widgets) => {
                        var menu = createMenu(widgets);
                        $scope.availableWidgets = [{
                            name: 'Widgets',
                            type: 'category',
                            items: menu
                        }];
                    });
            };

            function createMenu(widgets) {

                var result = [];

                var categories = _.transform(widgets, function(aggregate, widget) {
                    if (!_.find(aggregate, function(item) {
                            return item === widget.category
                        })) {

                        if (widget.category != "") aggregate.push(widget.category);
                    }
                }, []);

                _.each(categories, function(category) {

                    var parentMenu = null;
                    var widgetCategories = category.split(';');
                    var hash = null;

                    _.each(widgetCategories, function(widgetcategory) {

                        hash = (null == hash) ? widgetcategory : hash + ';' + widgetcategory;

                        var isExistingMenu = null != _.find(result, function(menu) {
                            return menu.name === widgetcategory;
                        });

                        if (GlDashboard.isUndefinedOrNull(parentMenu) && !isExistingMenu) {

                            parentMenu = {
                                name: widgetcategory,
                                gl_template: null,
                                type: 'category',
                                disabled: false,
                                config: null,
                                items: []
                            };

                            result.push(parentMenu);

                        } else {

                            var parent = null;

                            if (!isExistingMenu) {

                                parent = _.find(parentMenu.items, function(menu) {
                                    return menu.name === widgetcategory;
                                });

                                var menu = {
                                    name: widgetcategory,
                                    gl_template: null,
                                    type: 'category',
                                    disabled: false,
                                    config: null,
                                    items: []
                                };

                                if (null == parent) {
                                    parentMenu.items.push(menu);
                                } else {
                                    parent.items.push(menu);
                                }

                                parentMenu = menu;

                            } else {
                                parentMenu = parent = _.find(result, function(menu) {
                                    return menu.name === widgetcategory;
                                });
                            }

                        }

                        var relevantWidgets = _.filter(widgets, function(widget) {
                            return widget.category === hash;
                        });

                        _.each(relevantWidgets, function(widget) {

                            if (!_.find(parentMenu.items, (item) => {
                                    return widget.name === item.name;
                                })) {

                                parentMenu.items.push({
                                    name: widget.name,
                                    gl_template: widget.template,
                                    type: 'widget',
                                    disabled: !$scope.context.enableWidget(widget),
                                    config: widget.config == null ? {} : widget.config
                                });
                            }
                        });
                    });

                });

                var customWidgetTemplates = customWidgets.getAvailableTemplates();

                if (!GlDashboard.isUndefinedOrNull(customWidgetTemplates) && customWidgetTemplates.length > 0) {

                    var customWidgetMenu = {
                        name: 'My Widgets',
                        type: 'category',
                        items: _.transform(customWidgetTemplates, (aggregate, customWidget) => aggregate.push({ name: customWidget.name, disabled: GlDashboard.isUndefinedOrNull($scope.context.layoutKey), type: 'custom-widget', customWidget: customWidget }))
                    };

                    result.push(customWidgetMenu);

                }

                return result;
            };

        }
    };
});
