angular
    .module('chart', ['glDashboard'])
    .controller('chart', function chartCrtl($scope, $controller) {

        $controller('widget', { $scope: $scope });

        var dataSource = [{
            day: "Monday",
            oranges: 3
        }, {
            day: "Tuesday",
            oranges: 2
        }, {
            day: "Wednesday",
            oranges: 3
        }, {
            day: "Thursday",
            oranges: 4
        }, {
            day: "Friday",
            oranges: 6
        }, {
            day: "Saturday",
            oranges: 11
        }, {
            day: "Sunday",
            oranges: 4
        }];


        $scope.container.on('resize', function() {
            $("#chart").dxChart('instance').render();
        });

        $scope.initialize = () => {

            $scope.chartOptions = {
                dataSource: dataSource,
                adaptiveLayout: {
                    height: $scope.height(),
                    width: $scope.width()
                },
                size: {
                    height: "auto",
                    width: "100%"
                },
                series: {
                    argumentField: "day",
                    valueField: "oranges",
                    name: "My oranges",
                    type: "bar",
                    color: '#ffaa66'
                }
            };
        };
    });
