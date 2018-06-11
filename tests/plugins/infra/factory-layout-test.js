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
    .factory('Context', function(states, categories) {

        return function(state, category, isScreen, isAction, layout) {

            return {
                isAction: OneDashboard.isUndefinedOrNull(isAction) ? false : isAction,
                isScreen: OneDashboard.isUndefinedOrNull(isScreen) ? false : isScreen,
                layoutKey: state,
                layoutCategory: OneDashboard.isUndefinedOrNull(category) ? categories.MAIN : category,
                layout: OneDashboard.isUndefinedOrNull(layout) ? {
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
