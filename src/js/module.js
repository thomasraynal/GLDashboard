(function() {
    window.OneDashboard = {
        isUndefinedOrNull: function(val) {
            return angular.isUndefined(val) || val === null;
        }
    };

})();

angular.module('glDashboardTemplates', []);
var glDashboard = angular.module('glDashboard', ['dx', 'ngRoute', 'glDashboardTemplates']);
