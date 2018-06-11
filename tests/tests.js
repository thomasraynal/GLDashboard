describe('glDashboard', function() {

    function render() {
        $timeout.flush(1000);
    }

    var $rootScope,
        $routeParams,
        $httpBackend,
        states,
        scope,
        $timeout,
        $script,
        workspaceElement;


    window.$script = (path, promise) => {
        promise();
    };


    var widgets = [{
        "name": "Test1",
        "module": "test1",
        "isKeyBounded": false,
        "templateUrl": "plugins/html/test1-module.html",
        "moduleUrl": "plugins/modules/test1.js",
        "category": "Test",
        "config": {}
    }, {
        "name": "Test2",
        "module": "test2",
        "isKeyBounded": true,
        "templateUrl": "plugins/html/test2-module.html",
        "moduleUrl": "plugins/modules/test2.js",
        "category": "Test",
        "config": {}
    }];


    beforeEach(module('glDashboard'));

    beforeEach(inject(function(_$rootScope_, _$timeout_, _$routeParams_, _$httpBackend_, $templateCache, $templateRequest, $q, $compile, _states_, categories) {

        window.layoutRepository = [];

        $rootScope = _$rootScope_;
        $routeParams = _$routeParams_;
        $httpBackend = _$httpBackend_;
        $timeout = _$timeout_;
        states = _states_;

        $routeParams.key = states.A;
        $routeParams.category = categories.C1;

        scope = $rootScope.$new();

        $httpBackend.when('GET', 'widgets.json').respond(200, widgets);

        $templateCache.put('plugins/html/view.menu.html', '<div class="w_menu" id="workspaceMenu">    <workspace-menu-app-name></workspace-menu-app-name>    <workspace-menu-widgets></workspace-menu-widgets>    <workspace-menu-actions-and-screens></workspace-menu-actions-and-screens>    <workspace-menu-layout-save></workspace-menu-layout-save>    <workspace-menu-layout-save-screen-or-action></workspace-menu-layout-save-screen-or-action>    <workspace-menu-layout-management></workspace-menu-layout-management>    <workspace-menu-layout-clear></workspace-menu-layout-clear></div>');
        $templateCache.put('plugins/html/test1-module.html', '<div ng-controller="test1" id="test1">  <change-widget-name></change-widget-name></div>');
        $templateCache.put('plugins/html/test2-module.html', '<div ng-controller="test2" id="test2">  <change-widget-name></change-widget-name></div>');

        workspaceElement = $compile('<div ng-controller="workspace"><div id="workspaceContainer" class="w_container"></div><workspace-menu></workspace-menu></div>')($rootScope);

        $rootScope.worskspaceScope = angular.element(workspaceElement[0]).scope();
        $rootScope.worskspaceScope.$workspaceContainer = workspaceElement.find("#workspaceContainer")

        render();

        $httpBackend.flush();

        $rootScope.worskspaceScope.$digest();


    }));


    it('should test if a workspace is initialized', function() {

        var worskspaceScope = $rootScope.worskspaceScope;

        expect(worskspaceScope.availableWidgets).not.toBe(null);
        expect(worskspaceScope.availableWidgets.length).toEqual(1);
        expect(worskspaceScope.goldenLayout).not.toBe(null);
        expect(worskspaceScope.goldenLayout.container).not.toBe(null);

        var widgetsMenu = worskspaceScope.availableWidgets[0];

        expect(widgetsMenu.name).toEqual('Widgets');
        expect(widgetsMenu.type).toEqual('category');
        expect(widgetsMenu.items.length).toEqual(1);

        var testCategory = worskspaceScope.availableWidgets[0].items[0];

        expect(testCategory.name).toEqual('Test');
        expect(testCategory.type).toEqual('category');
        expect(testCategory.items.length).toEqual(2);

        var widgetTest1 = worskspaceScope.availableWidgets[0].items[0].items[0];
        var widgetTest2 = worskspaceScope.availableWidgets[0].items[0].items[1];

        expect(widgetTest1.name).toEqual('Test1');
        expect(widgetTest2.name).toEqual('Test2');

        expect(widgetTest1.type).toEqual('widget');
        expect(widgetTest2.type).toEqual('widget');

    });

    it('should add a widget', function() {
        var worskspaceScope = $rootScope.worskspaceScope;

        var widget = widgets[0];

        var defaultContent = worskspaceScope.goldenLayout
            .toConfig()
            .content;

        expect(defaultContent.length).toEqual(1);

        var layoutBase = defaultContent[0];

        expect(layoutBase.type).toEqual('row');
        expect(layoutBase.content).not.toBe(null);

        worskspaceScope.addWidget(widget.name);
        $httpBackend.flush();

        var modifiedContent = worskspaceScope.goldenLayout
            .toConfig()
            .content;

        var modifiedLayout = modifiedContent[0];

        expect(modifiedLayout.content).not.toBe(null);
        expect(modifiedLayout.content.length).toEqual(1);

        var widgetContainer = modifiedLayout.content[0];

        expect(widgetContainer.type).toEqual('stack');
        expect(widgetContainer.content.length).toEqual(1);

        var widgetState = widgetContainer.content[0].componentState;

        expect(widgetContainer.content[0].type).toEqual('component');
        expect(widgetContainer.content[0].title).toEqual(widget.name);
        expect(widgetState.name).toEqual(widget.name);
        expect(widgetState.templateUrl).toEqual(widget.templateUrl);
        expect(widgetState.moduleUrl).toEqual(widget.moduleUrl);
        expect(widgetState.module).toEqual(widget.module);
        expect(widgetState.isKeyBounded).toEqual(widget.isKeyBounded);
        expect(widgetState.category).toEqual(widget.category);

    });


    it('should save and restore a default layout', function() {
        var worskspaceScope = $rootScope.worskspaceScope;
        var widget = widgets[0];

        worskspaceScope.addWidget(widget.name);

        $httpBackend.flush();

        worskspaceScope.reload();

        render();

        var widgetContainer = worskspaceScope.goldenLayout
            .toConfig()
            //canvas
            .content[0]
            //widget container
            .content;

        //not widget container means not wid
        expect(widgetContainer).toBe(undefined);

        worskspaceScope.addWidget(widget.name);

        $httpBackend.flush();

        worskspaceScope.saveLayoutAsDefault();

        render();
        worskspaceScope.reload();

        var widget = worskspaceScope.goldenLayout
            .toConfig()
            //canvas
            .content[0]
            //widget container
            .content;

        expect(widget).not.toBe(null);

    });


    it('should save and restore a default category layout', function() {
        var worskspaceScope = $rootScope.worskspaceScope;
        var widget = widgets[0];

        worskspaceScope.addWidget(widget.name);
        $httpBackend.flush();

        worskspaceScope.saveLayoutAsDefaultForCategory();

        render();
        worskspaceScope.reload();


        var widgetsContainer = worskspaceScope.goldenLayout
            .toConfig()
            //canvas
            .content[0]
            //widget container
            .content[0]
            //widgets
            .content;

        expect(widgetsContainer.length).toEqual(1);

        worskspaceScope.addWidget(widget.name);
        $httpBackend.flush();

        worskspaceScope.saveLayoutAsDefault();

        render();
        worskspaceScope.reload();

        widgetsContainer = worskspaceScope.goldenLayout
            .toConfig()
            //widget container
            .content[0]

        expect(widgetsContainer.content.length).toEqual(2);

    });

    it('should save and restore a screen', function() {
        var worskspaceScope = $rootScope.worskspaceScope;
        var widget = widgets[1];
        var screenName = 'MY SCREEN';

        worskspaceScope.addWidget(widget.name);
        $httpBackend.flush();

        worskspaceScope.saveLayout(screenName, screenName, true, false);

        render();
        worskspaceScope.reload();
        render();

        var widgetsContainer = worskspaceScope.goldenLayout
            .toConfig()
            //widget container
            .content[0]

        expect(widgetsContainer.content).toBe(undefined);

        render();
        worskspaceScope.changeLayout(screenName);
        render();


        widgetsContainer = worskspaceScope.goldenLayout
            .toConfig()
            //canvas
            .content[0]
            //widget container
            .content[0]
            //widgets
            .content;

        expect(widgetsContainer.length).toEqual(1);
        expect(widgetsContainer[0].componentState.name).toEqual(widget.name);

        expect(worskspaceScope.context.layoutKey).toEqual(screenName);
        expect(worskspaceScope.context.isAction).toEqual(false);
        expect(worskspaceScope.context.isScreen).toEqual(true);

        expect(worskspaceScope.screens[0].items.length).toEqual(1);
    });

    it('should save and restore an action', function() {
        var worskspaceScope = $rootScope.worskspaceScope;
        var widget = widgets[1];
        var screenName = 'MY ACTION';

        worskspaceScope.addWidget(widget.name);
        $httpBackend.flush();

        worskspaceScope.saveLayout(screenName, screenName, false, true);

        render();
        worskspaceScope.reload();
        render();

        var widgetsContainer = worskspaceScope.goldenLayout
            .toConfig()
            //widget container
            .content[0]

        expect(widgetsContainer.content).toBe(undefined);

        worskspaceScope.changeLayout(screenName);
        render();


        widgetsContainer = worskspaceScope.goldenLayout
            .toConfig()
            //canvas
            .content[0]
            //widget container
            .content[0]
            //widgets
            .content;

        expect(widgetsContainer.length).toEqual(1);
        expect(widgetsContainer[0].componentState.name).toEqual(widget.name);

        expect(worskspaceScope.context.layoutKey).toEqual(screenName);
        expect(worskspaceScope.context.isAction).toEqual(true);
        expect(worskspaceScope.context.isScreen).toEqual(false);

        expect(worskspaceScope.actions[0].items.length).toEqual(1);

    });

    it('should test layout management', function() {

        var worskspaceScope = $rootScope.worskspaceScope;
        var widget = widgets[1];
        var myScreen = 'MY ACTION';

        worskspaceScope.addWidget(widget.name);
        $httpBackend.flush();

        worskspaceScope.saveLayout(myScreen, myScreen, false, true);
        render();

        worskspaceScope.showLayoutManagement = true;
        worskspaceScope.$digest();
        render();

        expect(worskspaceScope.availableLayouts.length).toEqual(1);
        expect(worskspaceScope.availableLayouts[0].name).toEqual(myScreen);

    });


    it('should test bindable widgets', function() {

        var worskspaceScope = $rootScope.worskspaceScope;
        var widget1 = widgets[0];
        var widget2 = widgets[1];

        worskspaceScope.addWidget(widget1.name);
        $httpBackend.flush();
        worskspaceScope.addWidget(widget2.name);
        $httpBackend.flush();

        var widgetCount = worskspaceScope.goldenLayout.root.getComponentsByName('angularModule').length;
        expect(widgetCount).toEqual(2);

        var widget1Scope = workspaceElement.find('#test1').scope();
        var widget2Scope = workspaceElement.find('#test2').scope();

        var event = "yadada";

        widget1Scope.raiseEvent(event);

        expect(widget1Scope.state).toEqual(event);
        expect(widget2Scope.state).toEqual(event);
    });

    it('should change widget name', function() {

        var worskspaceScope = $rootScope.worskspaceScope;
        var widget = widgets[0];

        worskspaceScope.addWidget(widget.name);
        $httpBackend.flush();

        worskspaceScope.saveLayoutAsDefault();
        render();

        var widget1Scope = workspaceElement.find('#test1').scope();

        var oldName = widget1Scope.name;
        var newName = 'newName';

        widget1Scope.changeName(newName);

        expect(widget1Scope.config.title).toEqual(newName);

        worskspaceScope.reload();
        render();

        var widget1Scope = workspaceElement.find('#test1').scope();
        expect(widget1Scope.config.title).toEqual(newName);

    });


    it('should test workspace loading ui', function(done) {


        var worskspaceScope = $rootScope.worskspaceScope;

        var uiWork = worskspaceScope.doUiWork(() => {
            expect(worskspaceScope.isLoading).toEqual(true);
        });

        uiWork.then(() => {
            expect(worskspaceScope.isLoading).toEqual(false);
        });

        render();

        var asyncUiWork = worskspaceScope.doUiWork($timeout(() => {
            expect(worskspaceScope.isLoading).toEqual(true);
        }));

        asyncUiWork.then(() => {
            expect(worskspaceScope.isLoading).toEqual(false);
            done();
        });

        render();

    });


    it('should test widget loading ui', function(done) {


        var worskspaceScope = $rootScope.worskspaceScope;
        var widget = widgets[0];

        worskspaceScope.addWidget(widget.name);
        $httpBackend.flush();

        var widget1Scope = workspaceElement.find('#test1').scope();

        var uiWork = widget1Scope.doUiWork(() => {
            expect(widget1Scope.isLoading).toEqual(true);
        });


        render();

        uiWork.then(() => {
            expect(widget1Scope.isLoading).toEqual(false);
        });

        render();

        setTimeout(() => {

            var asyncUiWork = widget1Scope.doUiWork($timeout(() => {
                expect(widget1Scope.isLoading).toEqual(true);
            }));

            asyncUiWork.then(() => {
                expect(widget1Scope.isLoading).toEqual(false);
                done();
            });

            render();

        });

    });

});
