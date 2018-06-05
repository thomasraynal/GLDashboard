glDashboard.controller('widget', function widgetCrtl($scope, $timeout, $q, container, workspace, error) {

    $scope.workspace = workspace;
    $scope.container = container;

    $scope.name = container._config.componentState.name;
    $scope.config = container._config.componentState.config;

    $scope.doUiWork = (action, callback) => {

        $scope.disable();

        //handle promise and function call to promise
        var run = (!action.then) ? action() : action;

        return run
            .then((result) => {
                if (null != callback) callback(result);
                $scope.enable();
                return result;
            })
            .catch(err => {
                $scope.workspace.currentError = error.createError(err);
                $scope.workspace.showErrorPopup = true;
                $scope.workspace.$digest();
                $scope.enable();
            });
    };

    $scope.changeWidgetName = (name) => {
        $scope.config.title = name;
        $scope.container.setTitle(name);
    };

    $scope.height = () => {
        return $scope.container._element.height()
    };

    $scope.width = () => {
        return $scope.container._element.width()
    };

    $scope.isUpdating = () => {
        return $scope.container._element.hasClass("disable");
    };

    $scope.disable = () => {
        $scope.container._element.addClass("disable");
    };

    $scope.enable = () => {
        $scope.container._element.removeClass("disable");
    };

    $scope.initialize = () => {
        return createPromise();
    };

    $timeout(() => {
        $scope.initialize();
    });

    function createPromise() {
        var deferred = $q.defer();
        deferred.resolve();
        return deferred.promise;
    }

});
