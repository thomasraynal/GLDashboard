glDashboard.controller('workspace', function appCrtl(
    $scope,
    $log,
    $templateRequest,
    $templateCache,
    $timeout,
    $routeParams,
    $q,
    $window,
    $document,
    error,
    widgets,
    layouts,
    events,
    Save,
    Context) {

    $scope.context;

    $scope.actions = [];
    $scope.screens = [];

    $scope.isLoading = false;

    $scope.$workspaceContainer = $("#workspaceContainer");

    $scope.isFullScreen;

    $scope.showNamedLayoutManagement = false;
    $scope.showlayoutManagement = false;
    $scope.showCurrentUser = false;
    $scope.isSaveCustomLayoutDisabled;
    $scope.isSaveLayoutDefaultDisabled;
    $scope.isLayoutManagementDisabled;
    $scope.isDeleteLayoutDisabled;
    $scope.newLayoutName = '';
    $scope.selectedLayout;
    $scope.availableWidgets = [];
    $scope.availableLayouts = [];

    $scope.showErrorPopup = false;
    $scope.currentError;

    $scope.saveContextAsScreenOrActionVisible = false;
    $scope.saveContextAsScreenOrActionLabel = null;

    $scope.errorPopup = {
        contentTemplate: "info",
        width: 600,
        height: 500,
        showTitle: false,
        dragEnabled: false,
        showTitle: true,
        title: "An error has occured",
        closeOnOutsideClick: true,
        bindingOptions: {
            visible: "showErrorPopup"
        }
    };

    $scope.errorDetails = {
        height: 350,
        bindingOptions: {
            value: "currentError.details"
        }
    };

    $scope.$watch('context', function() {
        if (null == $scope.context) {
            $scope.saveContextAsScreenOrActionLabel = null;
            return;
        }

        if ($scope.context.isAction) $scope.saveContextAsScreenOrActionLabel = 'Save [' + $scope.context.layoutKey + ']';
        else if ($scope.context.isScreen) $scope.saveContextAsScreenOrActionLabel = 'Save [' + $scope.context.layoutKey + ']';
        else $scope.saveContextAsScreenOrActionLabel = null;

        $scope.isSaveLayoutDefaultDisabled = OneDashboard.isUndefinedOrNull($scope.context.layoutKey) || $scope.context.isAction || $scope.context.isScreen;
    });

    $scope.$watch('saveContextAsScreenOrActionLabel', function() {
        $scope.saveContextAsScreenOrActionVisible = null != $scope.saveContextAsScreenOrActionLabel;
    });

    $scope.$watch('newLayoutName', function() {
        $scope.isSaveLayoutDisabled = OneDashboard.isUndefinedOrNull($scope.newLayoutName) || $scope.newLayoutName == '';
    });

    $scope.$watch('selectedLayout', function() {
        $scope.isLayoutManagementDisabled = $scope.selectedLayout == null;
        $scope.isDeleteLayoutDisabled = $scope.isLayoutManagementDisabled || $scope.selectedLayout.isDefault;
    });

    $scope.$on("$destroy", function() {
        $scope.goldenLayout.destroy();
    });

    $scope.widgetMenuOptions = {
        bindingOptions: {
            dataSource: 'availableWidgets'
        },
        hideSubmenuOnMouseLeave: true,
        displayExpr: "name",
        onItemClick: (data) => {
            if (data.itemData.type == 'category') return;
            addWidget(data.itemData.name);
        }
    };

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

    $scope.textBoxNewLayoutOptions = {
        bindingOptions: { value: 'newLayoutName' },
        showClearButton: true,
        placeholder: "Enter layout name...",
        onInput: function(e) {
            $scope.newLayoutName = e.component._options.text;
        }
    };

    $scope.saveLayoutDefaultButtonOptions = {
        icon: 'floppy',
        bindingOptions: {
            text: 'context.layoutKey',
            disabled: 'isSaveLayoutDefaultDisabled'
        },
        onClick: saveLayoutAsDefault
    };

    $scope.saveLayoutTagButtonOptions = {
        icon: 'floppy',
        bindingOptions: {
            text: 'context.layoutCategory'
        },
        onClick: saveLayoutAsDefaultForCategory
    };

    $scope.deleteDefaultLayoutButtonOptions = {
        icon: 'remove',
        hint: 'Clear Layout',
        onClick: function(e) {

            changeContext()
                .then(initGoldenLayout)
        }
    };

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

    $scope.saveLayoutAsScreenButtonOptions = {
        icon: 'floppy',
        text: 'Save As Screen',
        bindingOptions: {
            disabled: 'isSaveLayoutDisabled'
        },
        onClick: function(e) {
            saveLayout($scope.newLayoutName, $scope.context.layoutKey, true, false)
                .then(() => {
                    $scope.showlayoutManagement = false;

                })

        }
    };

    $scope.saveLayoutAsActionButtonOptions = {
        icon: 'floppy',
        text: 'Save As Action',
        bindingOptions: {
            disabled: 'isSaveLayoutDisabled'
        },
        onClick: function(e) {
            saveLayout($scope.newLayoutName, $scope.context.layoutKey, false, true)
                .then(() => {
                    $scope.showlayoutManagement = false;
                })
        }
    };

    $scope.loadLayoutButtonOptions = {
        icon: 'upload',
        text: 'Load',
        bindingOptions: {
            disabled: 'isLayoutManagementDisabled'
        },
        onClick: function(e) {
            changeLayout($scope.selectedLayout.text)
        }
    };

    $scope.deleteLayoutButtonOptions = {
        icon: 'trash',
        text: 'Delete',
        bindingOptions: {
            disabled: 'isDeleteLayoutDisabled'
        },
        onClick: function(e) {
            deleteLayout($scope.selectedLayout.text)
        }
    };

    $scope.namedLayoutManagementButtonOptions = {
        icon: 'folder',
        text: 'Show Saved Layouts',
        onClick: function(e) {
            $scope.selectedLayout = null;
            createLayoutManagementMenu();
        }
    };

    $scope.saveLayoutAsFileButtonOptions = {
        icon: 'floppy',
        text: 'Save As File',
        onClick: function(e) {
            var layout = JSON.stringify($scope.goldenLayout.toConfig());
            var key = ($scope.context.layoutKey) ? $scope.context.layoutKey + "_" + $scope.context.layoutCategory : $scope.context.layoutCategory;
            new Save(key, ".layout", layout);
            $scope.showlayoutManagement = false;
        }
    };

    $scope.loadLayoutFromFileUploadOptions = {
        icon: 'upload',
        selectButtonText: "Load From File",
        labelText: "",
        accept: ".layout",
        uploadMode: "instantly",
        onValueChanged: function(e) {

            if (e.value.length == 0) return;

            var file = e.value[0];

            var reader = new FileReader();

            reader.onload = (e) => {
                var uploader = $('#loadLayoutFromFileInput').dxFileUploader('instance');
                var layout = JSON.parse(e.target.result);

                $scope.context.layout = layout;

                initGoldenLayout()
                    .then(() => {
                        uploader.reset();
                    })

            };

            reader.readAsBinaryString(file);

            $scope.showlayoutManagement = false;

        }
    };

    $scope.layoutManagementTreeViewOptions = {
        bindingOptions: {
            items: 'availableLayouts'
        },
        height: 500,
        onItemClick: function(e) {

            if (null == e.itemData || e.itemData.isCategory) return;
            $scope.selectedLayout = e.itemData;
        }
    };

    $scope.namedLayoutManagementPopupOptions = {
        contentTemplate: "info",
        width: 300,
        showTitle: true,
        title: 'Available Layouts',
        dragEnabled: false,
        closeOnOutsideClick: true,
        bindingOptions: {
            visible: "showNamedLayoutManagement"
        }
    };

    $scope.layoutManagementButtonOptions = {
        icon: 'image',
        hint: 'Show Layout Management Panel',
        onClick: function(e) {
            $scope.showlayoutManagement = true;
        }
    };

    $scope.layoutManagementPopupOptions = {
        contentTemplate: "info",
        width: 800,
        height: 300,
        showTitle: true,
        title: 'Layout Management',
        dragEnabled: false,
        closeOnOutsideClick: true,
        bindingOptions: {
            visible: "showlayoutManagement"
        }
    };

    $scope.doUiWork = (action, callback) => {

        disable();

        //handle promise and function call to promise
        var run = (!action.then) ? action() : action;

        return run
            .then((result) => {
                if (null != callback) callback(result);
                enable();
                return result;
            })
            .catch(err => {
                $scope.currentError = error.createError(err);
                $scope.showErrorPopup = true;
                enable();
            });
    };

    function initialize() {

        $scope.$workspaceContainer.height($(window).height());
        $scope.$workspaceContainer.width($(window).width());

        $timeout(() => {

            var init = disable();
            init
                .then(setEventHooks)
                .then(changeContext)
                .then(createWidgetMenu)
                .then(createActionMenu)
                .then(createScreenMenu)
                .then(loadPlugins)
                .then(createWorkspace)
                .then(enable)
                .catch(err => {
                    $log.error(err);
                    $scope.currentError = error.createError(err);
                    $scope.showErrorPopup = true;
                    enable();
                });

        });
    };

    function disable() {
        return $timeout(() => {
            $scope.isLoading = true;
        });
    };

    function enable() {
        return $timeout(() => {
            $scope.isLoading = false;
        });
    };

    function workspaceComponentFactory(container, state) {

        try {

            var element = container.getElement();
            var html = $templateCache.get(state.templateUrl);

            element.html(html);

            angular
                .module(state.module)
                .value('container', container)
                .value('workspace', $scope);

            angular.bootstrap(element[0], [state.module]);

        } catch (err) {
            $scope.currentError = error.createError(err);
            $scope.showErrorPopup = true;
            enable();
        }
    };

    function initGoldenLayout() {

        if (!OneDashboard.isUndefinedOrNull($scope.goldenLayout)) $scope.goldenLayout.destroy();

        var layout = $scope.context.layout;

        layout.settings.showPopoutIcon = false;

        layout.content[0].isClosable = false;

        $scope.goldenLayout = new GoldenLayout(layout, $scope.$workspaceContainer);
        $scope.goldenLayout.registerComponent('angularModule', workspaceComponentFactory);
        $scope.goldenLayout.init();

        $scope.goldenLayout.eventHub.on(events.layoutChanged, function(date) {
            createWidgetMenu();
            createActionMenu();
            createScreenMenu();
        });

        return createPromise();
    };

    function createWorkspace() {

        $scope
            .doUiWork(getDefaultLayout())
            .then((keyLayout) => {

                if (OneDashboard.isUndefinedOrNull(keyLayout)) {

                    $scope
                        .doUiWork(getLayoutByCategory())
                        .then((categoryLayout) => {
                            setUpWorkspace(categoryLayout);
                        });

                } else {
                    setUpWorkspace(keyLayout);
                }
            });
    };

    function setUpWorkspace(context) {

        changeContext(context)
            .then(initGoldenLayout)
            .then(() => {

                resize();
                //important
                resize();

            });
    };

    function loadPlugins() {

        return widgets
            .getWidgets()
            .then((availableWidgets) => {

                var pluginLoader = [];
                var pluginModuleLoader = [];

                _.each(availableWidgets, (plugin) => {

                    var deferred = $q.defer();
                    pluginLoader.push($templateRequest(plugin.templateUrl));
                    $script(plugin.moduleUrl, () => deferred.resolve());
                    pluginLoader.push(deferred.promise);

                });

                return $q.all(pluginLoader);
            });
    };

    function createLayoutManagementMenu() {

        return layouts
            .getAvailableLayouts()
            .then((layouts) => {

                var availableLayouts = _.transform(layouts, (aggregate, layout) => {

                    var category = 'DEFAULT';

                    if (layout.isAction) category = 'ACTION';
                    if (layout.isScreen) category = 'MY SCREEN(S)';
                    if (!layout.isAction && !layout.isScreen && !layout.isDefault) category = 'DEFAULT (USER)';
                    if (!layout.isAction && !layout.isScreen && layout.isDefault) category = 'DEFAULT';

                    aggregate.push({
                        id: layout.layoutKey + layout.isAction + layout.isScreen + layout.isDefault,
                        category: category,
                        isDefault: layout.isDefault,
                        text: OneDashboard.isUndefinedOrNull(layout.layoutKey) ? layout.layoutCategory : layout.layoutKey
                    });

                }, []);


                $scope.availableLayouts = [{
                    id: "0",
                    text: "Available Layouts",
                    isCategory: true,
                    expanded: true,
                    items: [{
                        id: "1",
                        text: 'MY SCREEN(S)',
                        isCategory: true,
                        expanded: false,
                        items: _.filter(availableLayouts, (layout) =>
                            layout.category == 'MY SCREEN(S)')
                    }, {
                        id: "2",
                        text: 'ACTION',
                        isCategory: true,
                        expanded: false,
                        items: _.filter(availableLayouts, (layout) =>
                            layout.category == 'ACTION')
                    }, {
                        id: "3",
                        text: 'DEFAULT (USER)',
                        isCategory: true,
                        expanded: false,
                        items: _.filter(availableLayouts, (layout) =>
                            layout.category == 'DEFAULT (USER)')
                    }, {
                        id: "4",
                        text: 'DEFAULT',
                        isCategory: true,
                        expanded: false,
                        items: _.filter(availableLayouts, (layout) =>
                            layout.category == 'DEFAULT')
                    }]
                }];

                $scope.showNamedLayoutManagement = true;
            })
            .catch((err) => {
                $log.error(err);
            })
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


                if (OneDashboard.isUndefinedOrNull(parentMenu) && !isExistingMenu) {

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
                            disabled: OneDashboard.isUndefinedOrNull($scope.context.layoutKey) && widget.isKeyBounded,
                            config: widget.config == null ? {} : widget.config
                        });
                    }
                });
            });

        });

        return result;
    };

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

    function changeContext(context) {

        //if no context provided crete default one
        if (OneDashboard.isUndefinedOrNull(context)) {
            $scope.context = new Context($routeParams.key, $routeParams.category);

        } else {
            //if action or screen, we change the context to keep track of the object
            if (context.isAction || context.isScreen) {
                $scope.context = new Context(context.layoutKey, $routeParams.category, context.isScreen, context.isAction, context.layout);
            }
            //if not, we just get the underlying layout and keep the current route state
            else {
                $scope.context = new Context($routeParams.key, $routeParams.category, false, false, context.layout);
            }

        }

        return createPromise();
    };

    function setEventHooks() {

        angular.element($window).bind('resize', () => {
            resize();
        });

        angular.element($document).bind('mousemove', (e) => {
            _.throttle(() => { handleMenuVisibility(e.pageY); }, 500)();
        });
    };

    function addWidget(widgetName) {

        return widgets
            .getWidget(widgetName)
            .then((widget) => {
                $scope.goldenLayout.root.contentItems[0].addChild(widget);
            });
    };

    function loadScreenOrAction(data) {

        if (data.itemData.type == 'category') return

        changeLayout(data.itemData.name);
    };

    function changeLayout(layoutKey) {

        $scope
            .doUiWork(layouts.getLayout(layoutKey))
            .then(changeContext)
            .then(() => {

                $scope.showNamedLayoutManagement = false;
                $scope.showlayoutManagement = false;

                $timeout(() => {
                    initGoldenLayout();
                }, 200);

                return createPromise();

            });
    }

    function deleteLayout(layoutKey) {

        return $scope
            .doUiWork(layouts.deleteLayout(layoutKey))
            .then((result) => {
                $scope.goldenLayout.eventHub.emit(events.layoutChanged);
                $scope.showNamedLayoutManagement = false;
            });
    };

    function saveLayout(layoutKey, layoutCategory, isScreen, isAction) {

        var context = new Context(layoutKey, layoutCategory, isScreen, isAction, $scope.goldenLayout.toConfig());

        return $scope
            .doUiWork(layouts.saveLayout(context))
            .then((result) => {
                $scope.newLayoutName = '';
                $scope.goldenLayout.eventHub.emit(events.layoutChanged);
            });
    };

    function saveLayoutAsDefault() {
        return saveLayout($scope.context.layoutKey, $scope.context.layoutCategory, false, false);
    }

    function saveLayoutAsDefaultForCategory() {
        return saveLayout(null, $scope.context.layoutCategory, false, false);
    }

    function getDefaultLayout() {
        if (OneDashboard.isUndefinedOrNull($scope.context)) return createPromise();
        return layouts.getLayout($scope.context.layoutKey);
    };

    function getLayoutByCategory() {
        if (OneDashboard.isUndefinedOrNull($scope.context)) return createPromise();
        return layouts.getLayout($scope.context.layoutCategory);
    };

    function createPromise() {
        var deferred = $q.defer();
        deferred.resolve();
        return deferred.promise;
    };

    function handleMenuVisibility(mouseY) {
        if (null == $scope.goldenLayout) return;

        if (mouseY <= $scope.$workspaceContainer.height() - 100) {

            if ($scope.isFullScreen) return;
            $scope.isFullScreen = true;
            $('#workspaceMenu').hide(150);

        } else {

            if (!$scope.isFullScreen) return;
            $scope.isFullScreen = false;
            $('#workspaceMenu').show(150);
        }
    };

    function resize() {

        $timeout(() => {
            $scope.$workspaceContainer.height($(window).height());
            $scope.$workspaceContainer.width($(window).width());
            $scope.goldenLayout.updateSize();
        });
    };


    $scope.saveLayout = saveLayout;
    $scope.saveLayoutAsDefault = saveLayoutAsDefault;
    $scope.saveLayoutAsDefaultForCategory = saveLayoutAsDefaultForCategory;
    $scope.changeContext = changeContext;
    $scope.addWidget = addWidget;
    $scope.changeLayout = changeLayout;
    $scope.reload = createWorkspace;

    initialize();

});
