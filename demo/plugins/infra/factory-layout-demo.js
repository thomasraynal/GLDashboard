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
    .factory('Context', function(offices, categories) {

        return function(office, category, isScreen, isAction, layout) {

            return {
                isAction: OneDashboard.isUndefinedOrNull(isAction) ? false : isAction,
                isScreen: OneDashboard.isUndefinedOrNull(isScreen) ? false : isScreen,
                layoutKey: office,
                isDefault: false,
                layoutCategory: OneDashboard.isUndefinedOrNull(category) ? categories.main : category,
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
