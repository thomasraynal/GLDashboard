glDashboard.controller('widget', function widgetCrtl($scope, $timeout, $q, container, workspace, error) {

    $scope.workspace = workspace;
    $scope.container = container;

    $scope.name = container._config.componentState.name;
    $scope.config = container._config.componentState.config;

    $scope.isLoading = false;

    $scope.$watch('isLoading', function() {
        if ($scope.isLoading) $scope.container._element.addClass("disable");
        else {
            $scope.container._element.removeClass("disable");
        }
    });

    $scope.doUiWork = (action, callback) => {

        $scope.disable();

        //handle promise and function call to promise
        var run = (!action.then) ? $timeout(() => action()) : action;

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

    $scope.changeName = (name) => {
        $scope.config.title = name;
        $scope.container.setTitle(name);
    };

    $scope.height = () => {
        return $scope.container._element.height()
    };

    $scope.width = () => {
        return $scope.container._element.width()
    };

    $scope.disable = () => {
        $scope.isLoading = true;
    };

    $scope.enable = () => {
        $scope.isLoading = false;
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
