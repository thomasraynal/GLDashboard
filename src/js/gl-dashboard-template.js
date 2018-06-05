angular.module('oneDasboardTemplates').run(['$templateCache', function($templateCache) {$templateCache.put('view.widget.name.html','<div class="menu-item-align" dx-button="changeWidgetNameButtonOptions"></div>\r\n<div class="popup" dx-popup="changeWidgetNamePopupOptions">\r\n    <div data-options="dxTemplate: { name: \'info\' } ">\r\n        <div style="margin-top:10px;" dx-text-box="widgetNameTextBoxOptions"></div>\r\n        <div style="width:100%;margin-top:10px;min-height:30px; ">\r\n            <div style="width:100%;margin:0px" dx-button="validateChangeNameButtonOptions"></div>\r\n        </div>\r\n    </div>\r\n</div>\r\n');
$templateCache.put('view.workspace.html','<div ng-class="{disable: isLoading}" id="workspace">\r\n\r\n    <div id="workspaceContainer" class="w_container"></div>\r\n        <div class="w_menu" id="workspaceMenu" style="border:none">\r\n        <a style="color: transparent!important;" ng-href="#/"><img style="margin-left:0px" class="menu-item" src={{appIcon}}></img>\r\n        </a>\r\n        <div class="menu-item-align">{{appName}}</div>\r\n        <div class="menu-item-align">v.{{appVersion}}</div>\r\n        <div class="menu-item-align">{{fund}}</div>\r\n        <div class="menu-item" dx-menu="widgetMenuOptions"></div>\r\n        <div class="menu-item" dx-menu="actionMenuOptions"></div>\r\n        <div class="menu-item" dx-menu="screenMenuOptions"></div>\r\n        <div class="menu-item" dx-button="saveLayoutDefaultButtonOptions"></div>\r\n        <div class="menu-item" dx-button="saveLayoutTagButtonOptions"></div>\r\n        <div class="menu-item" dx-button="saveLayoutAsScreenOrActionButtonOptions"></div>\r\n        <div class="menu-item" dx-button="layoutManagementButtonOptions"></div>\r\n        <div class="icon-menu-item" dx-button="deleteDefaultLayoutButtonOptions"></div>\r\n    </div>\r\n    <div id="layoutManagementPopup" class="popup" dx-popup="namedLayoutManagementPopupOptions">\r\n        <div data-options="dxTemplate: { name:\'info\' }">\r\n            <div>\r\n                <div id="layoutManagementList" dx-tree-view="layoutManagementTreeViewOptions"></div>\r\n                <div style="margin-top:20px;" style="width:100%;">\r\n                    <div style="float:left;width:45%;" dx-button="loadLayoutButtonOptions"></div>\r\n                    <div style="float:right;width:45%;" dx-button="deleteLayoutButtonOptions"></div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <div id="layoutManagementPopup" class="popup" dx-popup="layoutManagementPopupOptions">\r\n        <div data-options="dxTemplate: { name:\'info\' }">\r\n            <div class="dx-fieldset">\r\n                <div class="dx-fieldset-header">Create or load a named layout</div>\r\n                <div class="dx-field">\r\n                    <div style="width:100%;min-height:30px;margin-top: 5px;">\r\n                        <div style="float:left;width:35%;" dx-text-box="textBoxNewLayoutOptions"></div>\r\n                        <div style="float:left;width:23%;margin:0px 0px 0px 5px;" dx-button="saveLayoutAsScreenButtonOptions"></div>\r\n                        <div style="float:left;width:20%;margin:0px 0px 0px 5px;" dx-button="saveLayoutAsActionButtonOptions"></div>\r\n                        <div style="float:left;width:20%;margin:0px 0px 0px 5px;" dx-button="namedLayoutManagementButtonOptions"></div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <div class="dx-fieldset">\r\n                <div class="dx-fieldset-header">Create or load a serialized layout</div>\r\n                <div class="dx-field">\r\n                    <div style="width:100%;min-height:30px;margin-top: 5px;">\r\n                        <div style="float:left;width:45%;margin:0px 5px 0px 0px;" dx-button="saveLayoutAsFileButtonOptions"></div>\r\n                        <div style="float:left;width:45%;margin-top: -7px;" class="menu-item" id="loadLayoutFromFileInput" dx-file-uploader="loadLayoutFromFileUploadOptions"></div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <div class="popup" dx-popup="errorPopup">\r\n        <div data-options="dxTemplate: { name:\'info\' }">\r\n            <div class="dx-fieldset">\r\n                <div class="dx-field">\r\n                    <div class="dx-field-label">Type</div>\r\n                    <div class="dx-field-value">\r\n                        {{currentError.status}}\r\n                    </div>\r\n                </div>\r\n                <div class="dx-field">\r\n                    <div class="dx-field-label">Message</div>\r\n                    <div class="dx-field-value">\r\n                        {{currentError.message}}\r\n                    </div>\r\n                </div>\r\n                <div class="dx-field">\r\n                    <div class="dx-field-label">Detail</div>\r\n                    <div class="dx-field-value">\r\n                        <div dx-text-area="errorDetails"></div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n');}]);