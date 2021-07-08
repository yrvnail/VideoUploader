/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/m/library',"sap/base/security/encodeCSS","sap/ui/core/library"],function(l,e,c){"use strict";var I=l.ImageMode;var A=c.aria.HasPopup;var a={apiVersion:2};a.render=function(r,i){var m=i.getMode(),b=i.getAlt(),t=i.getTooltip_AsString(),h=i.hasListeners("press"),L=i.getDetailBox(),u=i.getUseMap(),d=i.getAriaLabelledBy(),D=i.getAriaDescribedBy(),f=i.getAriaDetails(),g=m===I.Image,j=i.getLazyLoading(),s=i.getAriaHasPopup();if(L){r.openStart("span",i);r.class("sapMLightBoxImage");r.openEnd();r.openStart("span").class("sapMLightBoxMagnifyingGlass").openEnd().close("span");}if(g){r.voidStart("img",!L?i:i.getId()+"-inner");if(j){r.attr("loading","lazy");}}else{r.openStart("span",!L?i:i.getId()+"-inner");}if(!i.getDecorative()){if(d&&d.length>0){r.attr("aria-labelledby",d.join(" "));}if(D&&D.length>0){r.attr("aria-describedby",D.join(" "));}if(f&&f.length>0){r.attr("aria-details",f.join(" "));}}if(g){r.attr("src",i._getDensityAwareSrc());}else{i._preLoadImage(i._getDensityAwareSrc());if(i._isValidBackgroundSizeValue(i.getBackgroundSize())){r.style("background-size",i.getBackgroundSize());}if(i._isValidBackgroundPositionValue(i.getBackgroundPosition())){r.style("background-position",i.getBackgroundPosition());}r.style("background-repeat",e(i.getBackgroundRepeat()));}r.class("sapMImg");if(i.hasListeners("press")||i.hasListeners("tap")){r.class("sapMPointer");}if(u||!i.getDecorative()||h){r.class("sapMImgFocusable");}if(u){if(!(u.startsWith("#"))){u="#"+u;}r.attr("usemap",u);}if(i.getDecorative()&&!u&&!h){r.attr("role","presentation");r.attr("aria-hidden","true");r.attr("alt","");}else if(b||t){r.attr("alt",b||t);}if(b||t){r.attr("aria-label",b||t);}if(t){r.attr("title",t);}if(s!==A.None){r.attr("aria-haspopup",s.toLowerCase());}if(h){r.attr("role","button");r.attr("tabindex",0);}r.style("width",i.getWidth());r.style("height",i.getHeight());g?r.voidEnd():r.openEnd().close("span");if(L){r.close("span");}};return a;},true);