glDashboard.service('widgets', function($q, $http, $log) {

    this.getWidget = (name) => {

        return this
            .getWidgets()
            .then((widgets) => {

                var widget = _.find(widgets, widget => widget.name === name);

                if (GlDashboard.isUndefinedOrNull(widget)) return null;

                return {
                    title: name,
                    type: 'component',
                    componentName: 'angularModule',
                    componentState: _.cloneDeep(widget)
                };

            });
    };


    this.getWidgets = () => {
        return $http
            .get("widgets.json")
            .then((response) => response.data, (err) => $log.error(err));
    };


});
