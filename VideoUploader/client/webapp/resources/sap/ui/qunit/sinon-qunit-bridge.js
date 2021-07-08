/*
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
(function(){"use strict";var q=QUnit.module;function e(E){v(this._oSandbox);throw E;}function f(M){throw new Error("sinon.assert.fail outside of test: "+M);}function m(o,a){Object.keys(a).forEach(function(k){o[k]=a[k];});return o;}function n(){}function p(M){throw new Error("sinon.assert.pass outside of test: "+M);}function s(r){if(r&&typeof r.then==="function"){return r.then(s.bind(this),e.bind(this));}v(this._oSandbox);return r;}function v(S){S.verifyAndRestore();sinon.assert.fail=f;sinon.assert.pass=p;}QUnit.module=function(N,h,a){var A,b,S;if(typeof h==="function"||typeof a==="function"){q.call(this,N);throw new Error("QUnit.module with nested callback not supported");}A=h&&h.afterEach||n;b=h&&h.beforeEach||n;S={beforeEach:function(c){var P=["mock","spy","stub"],u=sinon.config&&sinon.config.useFakeTimers,o;if(u){P.push("clock");}o={injectInto:this,properties:P,useFakeTimers:u};if(sinon.createSandBox){this._oSandbox=sinon.createSandbox(o);}else{this._oSandbox=sinon.sandbox.create(o);}sinon.assert.fail=function(M){c.ok(false,M);};sinon.assert.pass=function(M){c.ok(true,M);};return b.apply(this,arguments);},afterEach:function(c){try{return s.call(this,A.apply(this,arguments));}catch(E){e.call(this,E);}}};q.call(this,N,h?m(m({},h),S):S);};sinon.assert.fail=f;sinon.assert.pass=p;}());