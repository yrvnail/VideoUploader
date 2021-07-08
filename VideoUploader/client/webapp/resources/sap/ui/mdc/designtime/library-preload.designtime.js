//@ui5-bundle sap/ui/mdc/designtime/library-preload.designtime.js
/*
 * ! OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.predefine('sap/ui/mdc/designtime/chart/Chart.designtime',[],function(){"use strict";return{name:"{name}",description:"{description}",actions:{}};});
sap.ui.predefine('sap/ui/mdc/designtime/filterbar/FilterBar.designtime',["sap/ui/mdc/p13n/Engine"],function(E){"use strict";return{actions:{settings:function(){return{handler:function(c,p){return E.getInstance().getRTASettingsActionHandler(c,p,"Item");}};}}};});
sap.ui.predefine('sap/ui/mdc/designtime/link/Panel.designtime',[],function(){"use strict";return{tool:{start:function(p){p.setEnablePersonalization(false);},stop:function(p){p.setEnablePersonalization(true);}}};});
sap.ui.predefine('sap/ui/mdc/designtime/link/PanelItem.designtime',[],function(){"use strict";return{domRef:function(p){var $=jQuery.find(".mdcbaseinfoPanelListItem");var a=$.filter(function(P){return jQuery(P).control(0).getParent().getKey()===p.getId();});return a[0];},name:{singular:"p13nDialog.PANEL_ITEM_NAME",plural:"p13nDialog.PANEL_ITEM_NAME_PLURAL"},actions:{remove:function(){return{changeType:"hideItem"};},reveal:function(){return{changeType:"revealItem"};}},isVisible:function(p){return p.getVisible();}};});
sap.ui.predefine('sap/ui/mdc/designtime/p13n/PersistenceProvider.designtime',[],function(){"use strict";return{name:"{name}",description:"{description}",properties:{mode:{ignore:true}}};});
sap.ui.predefine('sap/ui/mdc/designtime/table/Table.designtime',["sap/ui/mdc/p13n/Engine"],function(E){"use strict";return{name:"{name}",description:"{description}",actions:{settings:function(){return{handler:function(c,p){return E.getInstance().getRTASettingsActionHandler(c,p,c.getP13nMode());}};}}};});
/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.predefine('sap/ui/mdc/designtime/library.designtime',[],function(){"use strict";return{};});
//# sourceMappingURL=library-preload.designtime.js.map