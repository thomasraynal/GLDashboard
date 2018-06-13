glDashboard.directive('workspaceMenuLayoutManagement', function(layouts, glDashboardEvents) {
    return {
        restrict: "E",
        templateUrl: 'view.menu.layout.management.html',
        controller: function($scope) {

            $scope.showLayoutManagement = false;
            $scope.newLayoutName = '';
            $scope.selectedLayout;
            $scope.isLayoutManagementDisabled;
            $scope.isDeleteLayoutDisabled;
            $scope.availableLayouts = [];

            $scope.$watch('selectedLayout', function() {
                $scope.isLayoutManagementDisabled = $scope.selectedLayout == null;
                $scope.isDeleteLayoutDisabled = $scope.isLayoutManagementDisabled || $scope.selectedLayout.isDefault;
            });

            $scope.$watch('newLayoutName', function() {
                $scope.isSaveLayoutDisabled = GlDashboard.isUndefinedOrNull($scope.newLayoutName) || $scope.newLayoutName == '';
            });

            $scope.$watch('showLayoutManagement', function() {
                showLayoutManagementPopup();
            });

            $scope.textBoxNewLayoutOptions = {
                bindingOptions: { value: 'newLayoutName' },
                showClearButton: true,
                placeholder: "Enter layout name...",
                onInput: function(e) {
                    $scope.newLayoutName = e.component._options.text;
                }
            };

            $scope.layoutManagementGridBoxOptions = {
                bindingOptions: {
                    value: "selectedLayout.name",
                    dataSource: "availableLayouts"
                },
                valueExpr: "name",
                placeholder: "Select a layout...",
                displayExpr: function(item) {
                    return item && item.name + " [" + item.category + "]";
                },
                showClearButton: true,
                dataGrid: {
                    bindingOptions: {
                        dataSource: "availableLayouts",
                    },
                    columns: ["name", "category"],
                    hoverStateEnabled: true,
                    filterRow: { visible: true },
                    scrolling: { mode: "infinite" },
                    selection: { mode: "single" },
                    height: 300,
                    onSelectionChanged: function(selectedItems) {
                        var keys = selectedItems.selectedRowKeys;
                        $scope.selectedLayout = keys.length && keys[0] || null;
                        $("#layoutManagementGridBox").dxDropDownBox('instance').close();
                    }
                }
            };

            $scope.saveLayoutAsScreenButtonOptions = {
                icon: 'floppy',
                text: 'Save As Screen',
                bindingOptions: {
                    disabled: 'isSaveLayoutDisabled'
                },
                onClick: function(e) {
                    $scope.saveLayout($scope.newLayoutName, $scope.context.layoutKey, true, false)
                        .then(() => {
                            $scope.showLayoutManagement = false;

                        })

                }
            };

            $scope.saveLayoutAsActionButtonOptions = {
                icon: 'floppy',
                text: 'Save As Action',
                bindingOptions: {
                    disabled: 'isSaveLayoutDisabled'
                },
                onClick: function(e) {
                    $scope.saveLayout($scope.newLayoutName, $scope.context.layoutKey, false, true)
                        .then(() => {
                            $scope.showLayoutManagement = false;
                        })
                }
            };

            $scope.loadLayoutButtonOptions = {
                icon: 'upload',
                text: 'Load',
                bindingOptions: {
                    disabled: 'isLayoutManagementDisabled'
                },
                onClick: function(e) {
                    $scope.changeLayout($scope.selectedLayout.name)
                    $scope.showLayoutManagement = false;
                }
            };

            $scope.deleteLayoutButtonOptions = {
                icon: 'trash',
                text: 'Delete',
                bindingOptions: {
                    disabled: 'isDeleteLayoutDisabled'
                },
                onClick: function(e) {
                    deleteLayout($scope.selectedLayout.layout)
                    $scope.showLayoutManagement = false;
                }
            };

            $scope.saveLayoutAsFileButtonOptions = {
                icon: 'floppy',
                text: 'Save As File',
                onClick: function(e) {
                    var layout = JSON.stringify($scope.goldenLayout.toConfig());
                    var key = ($scope.context.layoutKey) ? $scope.context.layoutKey + "_" + $scope.context.layoutCategory : $scope.context.layoutCategory;
                    new Save(key, ".layout", layout);
                    $scope.showLayoutManagement = false;
                }
            };

            $scope.layoutManagementButtonOptions = {
                icon: 'image',
                hint: 'Show Layout Management Panel',
                onClick: function(e) {
                    $scope.showLayoutManagement = true;
                }
            };

            $scope.layoutManagementPopupOptions = {
                width: 300,
                height: 375,
                showTitle: true,
                title: 'Layout Management',
                dragEnabled: false,
                closeOnOutsideClick: true,
                bindingOptions: {
                    visible: "showLayoutManagement"
                }
            };

            $scope.loadLayoutFromFileUploadOptions = {
                icon: 'upload',
                selectButtonText: "Load From File",
                labelText: "",
                accept: ".layout",
                uploadMode: "instantly",
                onValueChanged: function(e) {

                    if (e.value.length == 0) return;

                    var file = e.value[0];

                    var reader = new FileReader();

                    reader.onload = (e) => {
                        var uploader = $('#loadLayoutFromFileInput').dxFileUploader('instance');
                        var layout = JSON.parse(e.target.result);

                        $scope.context.layout = layout;

                        initGoldenLayout()
                            .then(() => {
                                uploader.reset();
                            })

                    };

                    reader.readAsBinaryString(file);

                    $scope.showLayoutManagement = false;

                }
            };

            function showLayoutManagementPopup() {

                if ($scope.showLayoutManagement) {
                    $scope.selectedLayout = null;
                    $scope.newLayoutName = '';
                    createLayoutManagementMenu();
                }

            };

            function createLayoutManagementMenu() {

                return layouts
                    .getAvailableLayouts()
                    .then((layouts) => {

                        $scope.availableLayouts = _.transform(layouts, (aggregate, layout) => {

                            var category = 'DEFAULT';

                            if (layout.isAction) category = 'ACTION';
                            if (layout.isScreen) category = 'SCREEN';
                            if (!layout.isAction && !layout.isScreen && !layout.isDefault) category = 'DEFAULT (USER)';
                            if (!layout.isAction && !layout.isScreen && layout.isDefault) category = 'DEFAULT';

                            aggregate.push({
                                category: category,
                                isDefault: layout.isDefault,
                                layout: layout,
                                name: GlDashboard.isUndefinedOrNull(layout.layoutKey) ? layout.layoutCategory : layout.layoutKey
                            });

                        }, []);

                    })
                    .catch((err) => {
                        $log.error(err);
                    })
            };


            function deleteLayout(layout) {

                return $scope
                    .doUiWork(layouts.deleteLayout(layout))
                    .then((result) => {
                        $scope.goldenLayout.emit(glDashboardEvents.afterLayoutChanged);
                    });
            };


            $scope.showLayoutManagementPopup = showLayoutManagementPopup;
        }
    };
});
