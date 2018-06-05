describe('glDashboard', function() {

    //bindable widgets
    //change widget name
    //widget config
    //save

    function render() {
        $timeout.flush(1000);
    }

    function wait(time, finalizer) {

        if (!time) time = 1000;

        setTimeout(function() {
            if (finalizer) finalizer();
        }, time);
    }


    var $rootScope,
        $routeParams,
        $httpBackend,
        states,
        scope,
        $timeout,
        $script;


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

    beforeEach(inject(function(_$rootScope_, _$timeout_, _$routeParams_, _$httpBackend_, $templateCache, $q, $compile, _states_, categories) {

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

        $templateCache.put('plugins/html/test1-module.html', '<div  id="test1"></div>');
        $templateCache.put('plugins/html/test2-module.html', '<div  id="test2"></div>');

        var workspaceElement = $compile('<div ng-controller="workspace"><div id="workspaceContainer"></div></div>')($rootScope);
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

        worskspaceScope.reload();

        render();

        var widget = worskspaceScope.goldenLayout
            .toConfig()
            //widget container
            .content[0]

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
        render();

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
        render();


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

});
