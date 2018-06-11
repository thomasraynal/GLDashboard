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

    $scope.onInitializedHandlers = [];
    $scope.isLoading = false;
    $scope.$workspaceContainer = $("#workspaceContainer");
    $scope.isFullScreen;
    $scope.showNamedLayoutManagement = false;
    $scope.showCurrentUser = false;
    $scope.isSaveLayoutDefaultDisabled;
    $scope.availableWidgets = [];
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

    $scope.onInitialized = (action) => {
        $scope.onInitializedHandlers.push(action);
    };

    $scope.doUiWork = (action, callback) => {

        disable();

        //handle promise and function call to promise
        var run = (!action.then) ? $timeout(() => action()) : action;

        return run
            .then((result) => {
                if (null != callback) callback(result);
                enable();
                return result;
            })
            .catch(err => {
                $scope.currentError = error.createError(err);
                $scope.showErrorPopup = true;
                $scope.workspace.$digest();
                enable();
            });
    };

    function initialize() {

        $timeout(() => {

            var init = $timeout(() => disable());
            init
                .then(setUp)
                .then(setEventHooks)
                .then(changeContext)
                .then(loadPlugins)
                .then(createWorkspace)
                .then(finalize)
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
        $scope.isLoading = true;
    };

    function enable() {
        $scope.isLoading = false;
    };

    function setUp() {
        $scope.$workspaceContainer.height($(window).height());
        $scope.$workspaceContainer.width($(window).width());

        return createPromise();
    };

    function finalize() {

        var promises = _.transform($scope.onInitializedHandlers, (aggregate, action) => {

            var promise = action

            if (!action.then) {
                promise = createPromise(action);
            }

            aggregate.push(promise);

        }, []);

        return $q
            .all(promises)
            .catch(err => {
                $scope.currentError = error.createError(err);
                $scope.showErrorPopup = true;
                enable();
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


        return createPromise();
    };

    function createWorkspace() {

        return $scope
            .doUiWork(getDefaultLayout())
            .then((keyLayout) => {

                if (OneDashboard.isUndefinedOrNull(keyLayout)) {

                    return $scope
                        .doUiWork(getLayoutByCategory())
                        .then((categoryLayout) => {
                            return setUpWorkspace(categoryLayout);
                        });

                } else {
                    return setUpWorkspace(keyLayout);
                }
            });
    };

    function setUpWorkspace(context) {

        return changeContext(context)
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

    function changeLayout(layoutKey) {

        $scope
            .doUiWork(layouts.getLayout(layoutKey))
            .then(changeContext)
            .then(initGoldenLayout);
    }

    function saveLayout(layoutKey, layoutCategory, isScreen, isAction) {

        var context = new Context(layoutKey, layoutCategory, isScreen, isAction, $scope.goldenLayout.toConfig());

        return $scope
            .doUiWork(layouts.saveLayout(context))
            .then((result) => {
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

    function createPromise(action) {
        var deferred = $q.defer();
        if (action) action();
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

    function clearLayout() {
        return changeContext()
            .then(initGoldenLayout)
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
    $scope.clearLayout = clearLayout;
    $scope.reload = createWorkspace;

    initialize();

});
