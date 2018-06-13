glDashboard
    .constant('repository', 'pocRazorLayouts')
    .service('layouts', function layoutLocalService($q, repository) {

        this.getLayout = getLayout;
        this.getAvailableLayouts = getAvailableLayouts;
        this.deleteLayout = deleteLayout;
        this.saveLayout = saveLayout;
        this.getAvailableActions = getAvailableActions;
        this.getAvailableScreens = getAvailableScreens;


        if (GlDashboard.isUndefinedOrNull(localStorage.getItem(repository))) {
            localStorage.setItem(repository, []);
        }

        function getAvailableActions() {
            return createPromise(
                _(internalGetLayouts())
                .filter((savedlayout) => savedlayout.isAction == true)
                .transform((aggregate, savedlayout) => aggregate.push(savedlayout.layoutKey), []).value());
        };

        function getAvailableScreens() {
            return createPromise(
                _(internalGetLayouts())
                .filter((savedlayout) => savedlayout.isScreen == true)
                .transform((aggregate, savedlayout) => aggregate.push(savedlayout.layoutKey), []).value());
        };

        function internalGetLayouts() {
            var layouts = localStorage.getItem(repository) || '[]';
            return JSON.parse(layouts);
        };

        function getLayout(layoutKey) {

            var result = null;

            if (!GlDashboard.isUndefinedOrNull(layoutKey)) {

                result = _.find(internalGetLayouts(), function(savedlayout) {
                    return savedlayout.layoutKey == layoutKey || (savedlayout.layoutKey == null && savedlayout.layoutCategory == layoutKey);
                });
            }

            return createPromise(result);
        };

        function getAvailableLayouts() {
            return createPromise(_.transform(internalGetLayouts(), (aggregate, savedlayout) => aggregate.push(savedlayout), []));
        };

        function deleteLayout(context) {

            if (context.isDefault) throw new Error("Cannot delete a default layout");

            var layouts = internalGetLayouts();

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

            localStorage.setItem(repository, JSON.stringify(layouts));

            return createPromise(true);
        };

        function saveLayout(context) {

            return deleteLayout(context)
                .then(() => {

                    var layouts = internalGetLayouts();

                    if (null == localStorage[repository] || localStorage[repository] == "") {
                        localStorage.setItem(repository, JSON.stringify([context]));
                    } else {
                        layouts.push(context);
                        localStorage.setItem(repository, JSON.stringify(layouts));
                    }
                });
        };

        function createPromise(value) {
            var deferred = $q.defer();
            deferred.resolve(value);
            return deferred.promise;
        };

    });
