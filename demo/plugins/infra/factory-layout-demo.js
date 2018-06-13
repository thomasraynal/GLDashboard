glDashboard
    .constant('offices', {
        front: 'FRONT',
        middle: 'MIDDLE',
        back: 'BACK'
    })
    .constant('categories', {
        office: 'ALL',
        main: 'MAIN'
    })
    .value('glDashboardKeyLabel', 'key')
    .value('glDashboardCategoryLabel', 'category')
    .factory('Context', function(offices, categories) {

        return function(office, category, isScreen, isAction, layout) {

            return {
                isAction: GlDashboard.isUndefinedOrNull(isAction) ? false : isAction,
                isScreen: GlDashboard.isUndefinedOrNull(isScreen) ? false : isScreen,
                layoutKey: office,
                isDefault: false,
                enableWidget: (widget) => {
                    return (widget.isKeyBounded) ? !GlDashboard.isUndefinedOrNull(office) : true;
                },
                layoutCategory: GlDashboard.isUndefinedOrNull(category) ? categories.main : category,
                layout: GlDashboard.isUndefinedOrNull(layout) ? {
                    settings: {
                        showPopoutIcon: false
                    },
                    content: [{
                        type: 'row',
                        isClosable: false,
                        content: []
                    }]
                } : layout
            };


        };

    });
