glDashboard
    .constant('oneDbTemplates', 'oneDbTemplates')
    .service('customWidgets', function($q, oneDbTemplates) {

        function getAvailableTemplates() {

            var repository = localStorage.getItem(oneDbTemplates);

            if (null == repository || repository == "") {
                return [];
            } else {
                return JSON.parse(localStorage.getItem(oneDbTemplates));
            }
        };

        function saveTemplate(template) {

            deleteTemplate(template);

            var availableTemplates = getAvailableTemplates();

            availableTemplates.push(template);

            localStorage.setItem(oneDbTemplates, JSON.stringify(availableTemplates));
        };

        function deleteTemplate(template) {

            var availableTemplates = getAvailableTemplates();

            _.remove(availableTemplates, (tpl) => {
                return tpl.name == template.name;
            });

            localStorage.setItem(oneDbTemplates, JSON.stringify(availableTemplates));

        };

        function showCustomWidget(workspace, template) {

            DevExpress.ui.dialog.alert("Show custom widget logic not implemented");

        };


        this.getAvailableTemplates = getAvailableTemplates;
        this.saveTemplate = saveTemplate;
        this.deleteTemplate = deleteTemplate;
        this.showCustomWidget = showCustomWidget;


    });
