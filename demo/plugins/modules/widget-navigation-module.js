angular
    .module('navigation', ['glDashboard'])
    .controller('navigationView', function navigationView(
        $scope,
        $location,
        $controller,
        offices,
        categories) {

        $controller('widget', { $scope: $scope });

        $scope.doUiWorkButtonOptions = {
            icon: 'revert',
            text: "Do work",
            onClick: function(e) {
                $scope.doUiWork(() => $timeout(5000));
            }
        };

        $scope.showFrontOfficeButtonOptions = {
            icon: 'chevronright',
            text: offices.front,
            onClick: function(e) {
                $location.path('workspace').search({ key: offices.front, category: categories.office });
            }
        };

        $scope.showBackOfficeButtonOptions = {
            icon: 'chevronright',
            text: offices.back,
            onClick: function(e) {
                $location.path('workspace').search({ key: offices.back, category: categories.office });
            }
        };

        $scope.showMiddleOfficeButtonOptions = {
            icon: 'chevronright',
            text: offices.middle,
            onClick: function(e) {
                $location.path('workspace').search({ key: offices.middle, category: categories.office });
            }
        };

    });
