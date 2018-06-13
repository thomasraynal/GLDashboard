glDashboard
    .constant('states', {
        A: 'A',
        B: 'B'
    })
    .constant('categories', {
        MAIN: 'M',
        C1: 'C1',
        C2: 'C2'
    })
    .constant('testEvent', 'raiseEvent')
    .value('glDashboardKeyLabel', 'key')
    .value('glDashboardCategoryLabel', 'category')
    .factory('Context', function(states, categories) {

        return function(state, category, isScreen, isAction, layout) {

            return {
                isAction: GlDashboard.isUndefinedOrNull(isAction) ? false : isAction,
                isScreen: GlDashboard.isUndefinedOrNull(isScreen) ? false : isScreen,
                layoutKey: state,
                layoutCategory: GlDashboard.isUndefinedOrNull(category) ? categories.MAIN : category,
                enableWidget: (widget) => {
                    return (widget.isKeyBounded) ? !GlDashboard.isUndefinedOrNull(state) : true;
                },
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
