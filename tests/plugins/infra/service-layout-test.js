glDashboard
    .service('layouts', function layoutLocalService($q) {

        this.getLayout = getLayout;
        this.getAvailableLayouts = getAvailableLayouts;
        this.deleteLayout = deleteLayout;
        this.saveLayout = saveLayout;
        this.getAvailableActions = getAvailableActions;
        this.getAvailableScreens = getAvailableScreens;

        function getAvailableActions() {
            return createPromise(_.filter(window.layoutRepository, (savedlayout) => savedlayout.isAction == true));
        };

        function getAvailableScreens() {
            return createPromise(_.filter(window.layoutRepository, (savedlayout) => savedlayout.isScreen == true));
        };

        function getLayout(layoutKey) {

            var result = null;

            if (!OneDashboard.isUndefinedOrNull(layoutKey)) {

                result = _.find(window.layoutRepository, function(savedlayout) {
                    return savedlayout.layoutKey == layoutKey || (savedlayout.layoutKey == null && savedlayout.layoutCategory == layoutKey);
                });
            }

            return createPromise(result);
        };

        function getAvailableLayouts() {
            return createPromise(_.transform(window.layoutRepository, (aggregate, savedlayout) => aggregate.push(savedlayout), []));
        };

        function deleteLayout(context) {

            var layouts = window.layoutRepository;

            _.remove(layouts, function(savedlayout) {

                if (context.isAction || context.isScreen) {

                    return savedlayout.layoutKey == context.layoutKey &&
                        savedlayout.isScreen == context.isScreen &&
                        savedlayout.isAction == context.isAction;

                }

                return savedlayout.layoutKey == context.layoutKey &&
                    savedlayout.layoutCategory == context.layoutCategory &&
                    savedlayout.isScreen == context.isScreen &&
                    savedlayout.isAction == context.isAction;

            });

            return createPromise(true);
        };

        function saveLayout(context) {

            return deleteLayout(context)
                .then(() => {
                    window.layoutRepository.push(context);
                });
        };

        function createPromise(value) {
            var deferred = $q.defer();
            deferred.resolve(value);
            return deferred.promise;
        };

    });
