(function() {

    if (!window.GlDashboard) {
        window.GlDashboard = {};
    }

    window.GlDashboard.isUndefinedOrNull = function(val) {
        return angular.isUndefined(val) || val === null;

    };

})();

angular.module('glDashboardTemplates', []);
