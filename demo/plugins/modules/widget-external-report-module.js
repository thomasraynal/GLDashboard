angular
    .module('report', ['glDashboard'])
    .controller('report', function reportCrtl($scope, $controller) {

        $controller('widget', { $scope: $scope });

        $scope.container.on('resize', function() {

            var container = $scope.container;
            var $contentElement = container._contentElement;
            var $report = $contentElement.find("#embedded");

            $report.offset({ top: $contentElement.offset().top + 50, bottom: 50, left: $contentElement.offset().left + 25, right: 25 });
            $report.height(container.height - 100);
            $report.width(container.width - 50);

        });


    });
