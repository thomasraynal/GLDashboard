glDashboard.directive('changeWidgetName', function() {
    return {
        restrict: "E",
        templateUrl: 'view.widget.name.html',
        link: function($scope) {

            $scope.showChangeWidgetnamePopup = false;
            $scope.widgetNewName = $scope.config.title;
            $scope.cannotValidateWidgetNameChange = true;

            $scope.changeWidgetNameButtonOptions = {
                icon: 'edit',
                onClick: function(e) {
                    $scope.widgetNewName = $scope.config.title;
                    $scope.showChangeWidgetnamePopup = true;
                }
            };

            $scope.$watch('widgetNewName', function() {
                $scope.cannotValidateWidgetNameChange = $scope.widgetNewName == ''
            });


            $scope.widgetNameTextBoxOptions = {
                bindingOptions: {
                    value: "widgetNewName"
                },
                onInput: function(e) {
                    $scope.cannotValidateWidgetNameChange = (e.component._options.text == '');
                },
                showClearButton: true
            }; 

            $scope.changeWidgetNamePopupOptions = {
                width: 350,
                contentTemplate: "info",
                height: "auto",
                dragEnabled: true,
                showTitle: true,
                title: 'Change widget name',
                closeOnOutsideClick: true,
                bindingOptions: {
                    visible: "showChangeWidgetnamePopup"
                }
            };

            $scope.validateChangeNameButtonOptions = {
                text: 'Change name',
                bindingOptions: {
                    disabled: 'cannotValidateWidgetNameChange'
                },
                onClick: function() {
                    $scope.changeName($scope.widgetNewName);
                    $scope.showChangeWidgetnamePopup = false;
                }
            };


        }
    };
});
