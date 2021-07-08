/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/fl/Utils","sap/base/Log"],function(U,L){"use strict";function e(v){if(!v){return"";}return v;}return function(){return U.ifUShellContainerThen(function(s){var u=s[0];if(!u){return{};}var o=u.getUser();if(!o){return{};}try{var E=e(o.getEmail());var d;if(E){d=e(/@(.*)/.exec(E)[1]);}else{d="";}return{fullName:e(o.getFullName()),firstName:e(o.getFirstName()),lastName:e(o.getLastName()),email:E,domain:d};}catch(a){L.error("Unexpected exception when reading shell user info: "+a.toString());}},["UserInfo"])||{};};});
