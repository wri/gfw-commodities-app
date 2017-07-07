define('utils/Analytics',[], function() {
    'use strict';

    return {

        /**
         * Send an event to Google Analytics
         * @param {string} category - Category of an event, all should be 'Event'
         * @param {string} action - Type of action performed
         * @param {string} label - label describing the action
         * @param {number} value - value associated with the action
         */
        sendEvent: function(category, action, label, value) {

            var payload = {
                'hitType': 'event',
                'eventCategory': category,
                'eventAction': action,
                'eventLabel': label,
                'eventValue': value || 1
            };

            if (ga) {
                ga('A.send', payload);
                ga('B.send', payload);
                ga('C.send', payload);
            }

        },

        /**
         * Send a pageview to Google Analytics
         * @param {string} - [overrideUrl] - Override the page url and send in a different url
         * @param {string} - [overrideTitle] - Override the page title and send in a different title
         */
        sendPageview: function(overrideUrl, overrideTitle) {
            var payload = {
                'hitType': 'pageview'
            };

            // Add in url if it needs to be overwritten
            if (overrideUrl) {
                payload.page = overrideUrl;
            }

            // Add in title if it needs to be overwritten
            if (overrideTitle) {
                payload.title = overrideTitle;
            }

            if (ga) {
                ga('A.send', payload);
                ga('B.send', payload);
                ga('C.send', payload);
            }

        }

    };

});
/**
 * @license
 * lodash 3.8.0 (Custom Build) lodash.com/license | Underscore.js 1.8.3 underscorejs.org/LICENSE
 * Build: `lodash modern -o ./lodash.js`
 */
;(function(){function n(n,t){if(n!==t){var r=n===n,e=t===t;if(n>t||!r||n===w&&e)return 1;if(n<t||!e||t===w&&r)return-1}return 0}function t(n,t,r){for(var e=n.length,u=r?e:-1;r?u--:++u<e;)if(t(n[u],u,n))return u;return-1}function r(n,t,r){if(t!==t)return p(n,r);r-=1;for(var e=n.length;++r<e;)if(n[r]===t)return r;return-1}function e(n){return typeof n=="function"||false}function u(n){return typeof n=="string"?n:null==n?"":n+""}function o(n){return n.charCodeAt(0)}function i(n,t){for(var r=-1,e=n.length;++r<e&&-1<t.indexOf(n.charAt(r)););
return r}function f(n,t){for(var r=n.length;r--&&-1<t.indexOf(n.charAt(r)););return r}function a(t,r){return n(t.a,r.a)||t.b-r.b}function c(n){return $n[n]}function l(n){return Ln[n]}function s(n){return"\\"+Mn[n]}function p(n,t,r){var e=n.length;for(t+=r?0:-1;r?t--:++t<e;){var u=n[t];if(u!==u)return t}return-1}function h(n){return!!n&&typeof n=="object"}function _(n){return 160>=n&&9<=n&&13>=n||32==n||160==n||5760==n||6158==n||8192<=n&&(8202>=n||8232==n||8233==n||8239==n||8287==n||12288==n||65279==n);

}function v(n,t){for(var r=-1,e=n.length,u=-1,o=[];++r<e;)n[r]===t&&(n[r]=z,o[++u]=r);return o}function g(n){for(var t=-1,r=n.length;++t<r&&_(n.charCodeAt(t)););return t}function y(n){for(var t=n.length;t--&&_(n.charCodeAt(t)););return t}function d(n){return zn[n]}function m(_){function $n(n){if(h(n)&&!(To(n)||n instanceof Bn)){if(n instanceof zn)return n;if(Ge.call(n,"__chain__")&&Ge.call(n,"__wrapped__"))return Lr(n)}return new zn(n)}function Ln(){}function zn(n,t,r){this.__wrapped__=n,this.__actions__=r||[],
this.__chain__=!!t}function Bn(n){this.__wrapped__=n,this.__actions__=null,this.__dir__=1,this.__filtered__=false,this.__iteratees__=null,this.__takeCount__=Iu,this.__views__=null}function Mn(){this.__data__={}}function Dn(n){var t=n?n.length:0;for(this.data={hash:du(null),set:new lu};t--;)this.push(n[t])}function Pn(n,t){var r=n.data;return(typeof t=="string"||se(t)?r.set.has(t):r.hash[t])?0:-1}function qn(n,t){var r=-1,e=n.length;for(t||(t=Ue(e));++r<e;)t[r]=n[r];return t}function Kn(n,t){for(var r=-1,e=n.length;++r<e&&false!==t(n[r],r,n););
return n}function Vn(n,t){for(var r=-1,e=n.length;++r<e;)if(!t(n[r],r,n))return false;return true}function Gn(n,t){for(var r=-1,e=n.length,u=-1,o=[];++r<e;){var i=n[r];t(i,r,n)&&(o[++u]=i)}return o}function Jn(n,t){for(var r=-1,e=n.length,u=Ue(e);++r<e;)u[r]=t(n[r],r,n);return u}function Xn(n,t,r,e){var u=-1,o=n.length;for(e&&o&&(r=n[++u]);++u<o;)r=t(r,n[u],u,n);return r}function Hn(n,t){for(var r=-1,e=n.length;++r<e;)if(t(n[r],r,n))return true;return false}function Qn(n,t){return n===w?t:n}function nt(n,t,r,e){
return n!==w&&Ge.call(e,r)?n:t}function tt(n,t,r){var e=Ko(t);fu.apply(e,Zu(t));for(var u=-1,o=e.length;++u<o;){var i=e[u],f=n[i],a=r(f,t[i],i,n,t);(a===a?a===f:f!==f)&&(f!==w||i in n)||(n[i]=a)}return n}function rt(n,t){for(var r=-1,e=null==n,u=!e&&jr(n),o=u&&n.length,i=t.length,f=Ue(i);++r<i;){var a=t[r];f[r]=u?kr(a,o)?n[a]:w:e?w:n[a]}return f}function et(n,t,r){r||(r={});for(var e=-1,u=t.length;++e<u;){var o=t[e];r[o]=n[o]}return r}function ut(n,t,r){var e=typeof n;return"function"==e?t===w?n:zt(n,t,r):null==n?Re:"object"==e?wt(n):t===w?Te(n):bt(n,t);

}function ot(n,t,r,e,u,o,i){var f;if(r&&(f=u?r(n,e,u):r(n)),f!==w)return f;if(!se(n))return n;if(e=To(n)){if(f=wr(n),!t)return qn(n,f)}else{var a=Xe.call(n),c=a==K;if(a!=Y&&a!=B&&(!c||u))return Nn[a]?xr(n,a,t):u?n:{};if(f=br(c?{}:n),!t)return $u(f,n)}for(o||(o=[]),i||(i=[]),u=o.length;u--;)if(o[u]==n)return i[u];return o.push(n),i.push(f),(e?Kn:ht)(n,function(e,u){f[u]=ot(e,t,r,u,n,o,i)}),f}function it(n,t,r){if(typeof n!="function")throw new Pe(L);return su(function(){n.apply(w,r)},t)}function ft(n,t){
var e=n?n.length:0,u=[];if(!e)return u;var o=-1,i=mr(),f=i==r,a=f&&200<=t.length?qu(t):null,c=t.length;a&&(i=Pn,f=false,t=a);n:for(;++o<e;)if(a=n[o],f&&a===a){for(var l=c;l--;)if(t[l]===a)continue n;u.push(a)}else 0>i(t,a,0)&&u.push(a);return u}function at(n,t){var r=true;return zu(n,function(n,e,u){return r=!!t(n,e,u)}),r}function ct(n,t){var r=[];return zu(n,function(n,e,u){t(n,e,u)&&r.push(n)}),r}function lt(n,t,r,e){var u;return r(n,function(n,r,o){return t(n,r,o)?(u=e?r:n,false):void 0}),u}function st(n,t,r){
for(var e=-1,u=n.length,o=-1,i=[];++e<u;){var f=n[e];if(h(f)&&jr(f)&&(r||To(f)||ae(f))){t&&(f=st(f,t,r));for(var a=-1,c=f.length;++a<c;)i[++o]=f[a]}else r||(i[++o]=f)}return i}function pt(n,t){Mu(n,t,me)}function ht(n,t){return Mu(n,t,Ko)}function _t(n,t){return Du(n,t,Ko)}function vt(n,t){for(var r=-1,e=t.length,u=-1,o=[];++r<e;){var i=t[r];No(n[i])&&(o[++u]=i)}return o}function gt(n,t,r){if(null!=n){r!==w&&r in Fr(n)&&(t=[r]),r=-1;for(var e=t.length;null!=n&&++r<e;)n=n[t[r]];return r&&r==e?n:w}
}function yt(n,t,r,e,u,o){if(n===t)return true;var i=typeof n,f=typeof t;if("function"!=i&&"object"!=i&&"function"!=f&&"object"!=f||null==n||null==t)n=n!==n&&t!==t;else n:{var i=yt,f=To(n),a=To(t),c=M,l=M;f||(c=Xe.call(n),c==B?c=Y:c!=Y&&(f=ge(n))),a||(l=Xe.call(t),l==B?l=Y:l!=Y&&ge(t));var s=c==Y,a=l==Y,l=c==l;if(!l||f||s){if(!e&&(c=s&&Ge.call(n,"__wrapped__"),a=a&&Ge.call(t,"__wrapped__"),c||a)){n=i(c?n.value():n,a?t.value():t,r,e,u,o);break n}if(l){for(u||(u=[]),o||(o=[]),c=u.length;c--;)if(u[c]==n){
n=o[c]==t;break n}u.push(n),o.push(t),n=(f?_r:gr)(n,t,i,r,e,u,o),u.pop(),o.pop()}else n=false}else n=vr(n,t,c)}return n}function dt(n,t,r,e,u){for(var o=-1,i=t.length,f=!u;++o<i;)if(f&&e[o]?r[o]!==n[t[o]]:!(t[o]in n))return false;for(o=-1;++o<i;){var a=t[o],c=n[a],l=r[o];if(f&&e[o]?a=c!==w||a in n:(a=u?u(c,l,a):w,a===w&&(a=yt(l,c,u,true))),!a)return false}return true}function mt(n,t){var r=-1,e=jr(n)?Ue(n.length):[];return zu(n,function(n,u,o){e[++r]=t(n,u,o)}),e}function wt(n){var t=Ko(n),r=t.length;if(!r)return Ie(true);

if(1==r){var e=t[0],u=n[e];if(Cr(u))return function(n){return null==n?false:n[e]===u&&(u!==w||e in Fr(n))}}for(var o=Ue(r),i=Ue(r);r--;)u=n[t[r]],o[r]=u,i[r]=Cr(u);return function(n){return null!=n&&dt(Fr(n),t,o,i)}}function bt(n,t){var r=To(n),e=Er(n)&&Cr(t),u=n+"";return n=$r(n),function(o){if(null==o)return false;var i=u;if(o=Fr(o),!(!r&&e||i in o)){if(o=1==n.length?o:gt(o,It(n,0,-1)),null==o)return false;i=Pr(n),o=Fr(o)}return o[i]===t?t!==w||i in o:yt(t,o[i],null,true)}}function xt(n,t,r,e,u){if(!se(n))return n;

var o=jr(t)&&(To(t)||ge(t));if(!o){var i=Ko(t);fu.apply(i,Zu(t))}return Kn(i||t,function(f,a){if(i&&(a=f,f=t[a]),h(f)){e||(e=[]),u||(u=[]);n:{for(var c=a,l=e,s=u,p=l.length,_=t[c];p--;)if(l[p]==_){n[c]=s[p];break n}var p=n[c],v=r?r(p,_,c,n,t):w,g=v===w;g&&(v=_,jr(_)&&(To(_)||ge(_))?v=To(p)?p:jr(p)?qn(p):[]:Fo(_)||ae(_)?v=ae(p)?ye(p):Fo(p)?p:{}:g=false),l.push(_),s.push(v),g?n[c]=xt(v,_,r,l,s):(v===v?v!==p:p===p)&&(n[c]=v)}}else c=n[a],l=r?r(c,f,a,n,t):w,(s=l===w)&&(l=f),!o&&l===w||!s&&(l===l?l===c:c!==c)||(n[a]=l);

}),n}function At(n){return function(t){return null==t?w:t[n]}}function jt(n){var t=n+"";return n=$r(n),function(r){return gt(r,n,t)}}function kt(n,t){for(var r=n?t.length:0;r--;){var e=parseFloat(t[r]);if(e!=u&&kr(e)){var u=e;pu.call(n,e,1)}}}function Ot(n,t){return n+uu(Ou()*(t-n+1))}function Et(n,t,r,e,u){return u(n,function(n,u,o){r=e?(e=false,n):t(r,n,u,o)}),r}function It(n,t,r){var e=-1,u=n.length;for(t=null==t?0:+t||0,0>t&&(t=-t>u?0:u+t),r=r===w||r>u?u:+r||0,0>r&&(r+=u),u=t>r?0:r-t>>>0,t>>>=0,
r=Ue(u);++e<u;)r[e]=n[e+t];return r}function Rt(n,t){var r;return zu(n,function(n,e,u){return r=t(n,e,u),!r}),!!r}function Ct(n,t){var r=n.length;for(n.sort(t);r--;)n[r]=n[r].c;return n}function Wt(t,r,e){var u=dr(),o=-1;return r=Jn(r,function(n){return u(n)}),t=mt(t,function(n){return{a:Jn(r,function(t){return t(n)}),b:++o,c:n}}),Ct(t,function(t,r){var u;n:{u=-1;for(var o=t.a,i=r.a,f=o.length,a=e.length;++u<f;){var c=n(o[u],i[u]);if(c){u=u<a?c*(e[u]?1:-1):c;break n}}u=t.b-r.b}return u})}function St(n,t){
var r=0;return zu(n,function(n,e,u){r+=+t(n,e,u)||0}),r}function Tt(n,t){var e=-1,u=mr(),o=n.length,i=u==r,f=i&&200<=o,a=f?qu():null,c=[];a?(u=Pn,i=false):(f=false,a=t?[]:c);n:for(;++e<o;){var l=n[e],s=t?t(l,e,n):l;if(i&&l===l){for(var p=a.length;p--;)if(a[p]===s)continue n;t&&a.push(s),c.push(l)}else 0>u(a,s,0)&&((t||f)&&a.push(s),c.push(l))}return c}function Ut(n,t){for(var r=-1,e=t.length,u=Ue(e);++r<e;)u[r]=n[t[r]];return u}function Nt(n,t,r,e){for(var u=n.length,o=e?u:-1;(e?o--:++o<u)&&t(n[o],o,n););
return r?It(n,e?0:o,e?o+1:u):It(n,e?o+1:0,e?u:o)}function Ft(n,t){var r=n;r instanceof Bn&&(r=r.value());for(var e=-1,u=t.length;++e<u;){var r=[r],o=t[e];fu.apply(r,o.args),r=o.func.apply(o.thisArg,r)}return r}function $t(n,t,r){var e=0,u=n?n.length:e;if(typeof t=="number"&&t===t&&u<=Wu){for(;e<u;){var o=e+u>>>1,i=n[o];(r?i<=t:i<t)?e=o+1:u=o}return u}return Lt(n,t,Re,r)}function Lt(n,t,r,e){t=r(t);for(var u=0,o=n?n.length:0,i=t!==t,f=t===w;u<o;){var a=uu((u+o)/2),c=r(n[a]),l=c===c;(i?l||e:f?l&&(e||c!==w):e?c<=t:c<t)?u=a+1:o=a;

}return xu(o,Cu)}function zt(n,t,r){if(typeof n!="function")return Re;if(t===w)return n;switch(r){case 1:return function(r){return n.call(t,r)};case 3:return function(r,e,u){return n.call(t,r,e,u)};case 4:return function(r,e,u,o){return n.call(t,r,e,u,o)};case 5:return function(r,e,u,o,i){return n.call(t,r,e,u,o,i)}}return function(){return n.apply(t,arguments)}}function Bt(n){return tu.call(n,0)}function Mt(n,t,r){for(var e=r.length,u=-1,o=bu(n.length-e,0),i=-1,f=t.length,a=Ue(o+f);++i<f;)a[i]=t[i];

for(;++u<e;)a[r[u]]=n[u];for(;o--;)a[i++]=n[u++];return a}function Dt(n,t,r){for(var e=-1,u=r.length,o=-1,i=bu(n.length-u,0),f=-1,a=t.length,c=Ue(i+a);++o<i;)c[o]=n[o];for(i=o;++f<a;)c[i+f]=t[f];for(;++e<u;)c[i+r[e]]=n[o++];return c}function Pt(n,t){return function(r,e,u){var o=t?t():{};if(e=dr(e,u,3),To(r)){u=-1;for(var i=r.length;++u<i;){var f=r[u];n(o,f,e(f,u,r),r)}}else zu(r,function(t,r,u){n(o,t,e(t,r,u),u)});return o}}function qt(n){return fe(function(t,r){var e=-1,u=null==t?0:r.length,o=2<u&&r[u-2],i=2<u&&r[2],f=1<u&&r[u-1];

for(typeof o=="function"?(o=zt(o,f,5),u-=2):(o=typeof f=="function"?f:null,u-=o?1:0),i&&Or(r[0],r[1],i)&&(o=3>u?null:o,u=1);++e<u;)(i=r[e])&&n(t,i,o);return t})}function Kt(n,t){return function(r,e){var u=r?Yu(r):0;if(!Rr(u))return n(r,e);for(var o=t?u:-1,i=Fr(r);(t?o--:++o<u)&&false!==e(i[o],o,i););return r}}function Vt(n){return function(t,r,e){var u=Fr(t);e=e(t);for(var o=e.length,i=n?o:-1;n?i--:++i<o;){var f=e[i];if(false===r(u[f],f,u))break}return t}}function Yt(n,t){function r(){return(this&&this!==Yn&&this instanceof r?e:n).apply(t,arguments);

}var e=Gt(n);return r}function Zt(n){return function(t){var r=-1;t=Oe(be(t));for(var e=t.length,u="";++r<e;)u=n(u,t[r],r);return u}}function Gt(n){return function(){var t=Lu(n.prototype),r=n.apply(t,arguments);return se(r)?r:t}}function Jt(n){function t(r,e,u){return u&&Or(r,e,u)&&(e=null),r=hr(r,n,null,null,null,null,null,e),r.placeholder=t.placeholder,r}return t}function Xt(n,t){return function(r,e,u){u&&Or(r,e,u)&&(e=null);var i=dr(),f=null==e;if(i===ut&&f||(f=false,e=i(e,u,3)),f){if(e=To(r),e||!ve(r))return n(e?r:Nr(r));

e=o}return yr(r,e,t)}}function Ht(n,r){return function(e,u,o){return u=dr(u,o,3),To(e)?(u=t(e,u,r),-1<u?e[u]:w):lt(e,u,n)}}function Qt(n){return function(r,e,u){return r&&r.length?(e=dr(e,u,3),t(r,e,n)):-1}}function nr(n){return function(t,r,e){return r=dr(r,e,3),lt(t,r,n,true)}}function tr(n){return function(){var t=arguments.length;if(!t)return function(){return arguments[0]};for(var r,e=n?t:-1,u=0,o=Ue(t);n?e--:++e<t;){var i=o[u++]=arguments[e];if(typeof i!="function")throw new Pe(L);var f=r?"":Vu(i);

r="wrapper"==f?new zn([]):r}for(e=r?-1:t;++e<t;)i=o[e],f=Vu(i),r=(u="wrapper"==f?Ku(i):null)&&Ir(u[0])&&u[1]==(R|k|E|C)&&!u[4].length&&1==u[9]?r[Vu(u[0])].apply(r,u[3]):1==i.length&&Ir(i)?r[f]():r.thru(i);return function(){var n=arguments;if(r&&1==n.length&&To(n[0]))return r.plant(n[0]).value();for(var e=0,n=o[e].apply(this,n);++e<t;)n=o[e].call(this,n);return n}}}function rr(n,t){return function(r,e,u){return typeof e=="function"&&u===w&&To(r)?n(r,e):t(r,zt(e,u,3))}}function er(n){return function(t,r,e){
return(typeof r!="function"||e!==w)&&(r=zt(r,e,3)),n(t,r,me)}}function ur(n){return function(t,r,e){return(typeof r!="function"||e!==w)&&(r=zt(r,e,3)),n(t,r)}}function or(n){return function(t,r,e){var u={};return r=dr(r,e,3),ht(t,function(t,e,o){o=r(t,e,o),e=n?o:e,t=n?t:o,u[e]=t}),u}}function ir(n){return function(t,r,e){return t=u(t),(n?t:"")+lr(t,r,e)+(n?"":t)}}function fr(n){var t=fe(function(r,e){var u=v(e,t.placeholder);return hr(r,n,null,e,u)});return t}function ar(n,t){return function(r,e,u,o){
var i=3>arguments.length;return typeof e=="function"&&o===w&&To(r)?n(r,e,u,i):Et(r,dr(e,o,4),u,i,t)}}function cr(n,t,r,e,u,o,i,f,a,c){function l(){for(var b=arguments.length,j=b,k=Ue(b);j--;)k[j]=arguments[j];if(e&&(k=Mt(k,e,u)),o&&(k=Dt(k,o,i)),_||y){var j=l.placeholder,O=v(k,j),b=b-O.length;if(b<c){var R=f?qn(f):null,b=bu(c-b,0),C=_?O:null,O=_?null:O,W=_?k:null,k=_?null:k;return t|=_?E:I,t&=~(_?I:E),g||(t&=~(x|A)),k=[n,t,r,W,C,k,O,R,a,b],R=cr.apply(w,k),Ir(n)&&Gu(R,k),R.placeholder=j,R}}if(j=p?r:this,
h&&(n=j[m]),f)for(R=k.length,b=xu(f.length,R),C=qn(k);b--;)O=f[b],k[b]=kr(O,R)?C[O]:w;return s&&a<k.length&&(k.length=a),(this&&this!==Yn&&this instanceof l?d||Gt(n):n).apply(j,k)}var s=t&R,p=t&x,h=t&A,_=t&k,g=t&j,y=t&O,d=!h&&Gt(n),m=n;return l}function lr(n,t,r){return n=n.length,t=+t,n<t&&mu(t)?(t-=n,r=null==r?" ":r+"",je(r,ru(t/r.length)).slice(0,t)):""}function sr(n,t,r,e){function u(){for(var t=-1,f=arguments.length,a=-1,c=e.length,l=Ue(f+c);++a<c;)l[a]=e[a];for(;f--;)l[a++]=arguments[++t];return(this&&this!==Yn&&this instanceof u?i:n).apply(o?r:this,l);

}var o=t&x,i=Gt(n);return u}function pr(n){return function(t,r,e,u){var o=dr(e);return o===ut&&null==e?$t(t,r,n):Lt(t,r,o(e,u,1),n)}}function hr(n,t,r,e,u,o,i,f){var a=t&A;if(!a&&typeof n!="function")throw new Pe(L);var c=e?e.length:0;if(c||(t&=~(E|I),e=u=null),c-=u?u.length:0,t&I){var l=e,s=u;e=u=null}var p=a?null:Ku(n);return r=[n,t,r,e,u,l,s,o,i,f],p&&(e=r[1],t=p[1],f=e|t,u=t==R&&e==k||t==R&&e==C&&r[7].length<=p[8]||t==(R|C)&&e==k,(f<R||u)&&(t&x&&(r[2]=p[2],f|=e&x?0:j),(e=p[3])&&(u=r[3],r[3]=u?Mt(u,e,p[4]):qn(e),
r[4]=u?v(r[3],z):qn(p[4])),(e=p[5])&&(u=r[5],r[5]=u?Dt(u,e,p[6]):qn(e),r[6]=u?v(r[5],z):qn(p[6])),(e=p[7])&&(r[7]=qn(e)),t&R&&(r[8]=null==r[8]?p[8]:xu(r[8],p[8])),null==r[9]&&(r[9]=p[9]),r[0]=p[0],r[1]=f),t=r[1],f=r[9]),r[9]=null==f?a?0:n.length:bu(f-c,0)||0,(p?Pu:Gu)(t==x?Yt(r[0],r[2]):t!=E&&t!=(x|E)||r[4].length?cr.apply(w,r):sr.apply(w,r),r)}function _r(n,t,r,e,u,o,i){var f=-1,a=n.length,c=t.length,l=true;if(a!=c&&(!u||c<=a))return false;for(;l&&++f<a;){var s=n[f],p=t[f],l=w;if(e&&(l=u?e(p,s,f):e(s,p,f)),
l===w)if(u)for(var h=c;h--&&(p=t[h],!(l=s&&s===p||r(s,p,e,u,o,i))););else l=s&&s===p||r(s,p,e,u,o,i)}return!!l}function vr(n,t,r){switch(r){case D:case P:return+n==+t;case q:return n.name==t.name&&n.message==t.message;case V:return n!=+n?t!=+t:n==+t;case Z:case G:return n==t+""}return false}function gr(n,t,r,e,u,o,i){var f=Ko(n),a=f.length,c=Ko(t).length;if(a!=c&&!u)return false;for(var c=u,l=-1;++l<a;){var s=f[l],p=u?s in t:Ge.call(t,s);if(p){var h=n[s],_=t[s],p=w;e&&(p=u?e(_,h,s):e(h,_,s)),p===w&&(p=h&&h===_||r(h,_,e,u,o,i));

}if(!p)return false;c||(c="constructor"==s)}return c||(r=n.constructor,e=t.constructor,!(r!=e&&"constructor"in n&&"constructor"in t)||typeof r=="function"&&r instanceof r&&typeof e=="function"&&e instanceof e)?true:false}function yr(n,t,r){var e=r?Iu:Eu,u=e,o=u;return zu(n,function(n,i,f){i=t(n,i,f),((r?i<u:i>u)||i===e&&i===o)&&(u=i,o=n)}),o}function dr(n,t,r){var e=$n.callback||Ee,e=e===Ee?ut:e;return r?e(n,t,r):e}function mr(n,t,e){var u=$n.indexOf||Dr,u=u===Dr?r:u;return n?u(n,t,e):u}function wr(n){var t=n.length,r=new n.constructor(t);

return t&&"string"==typeof n[0]&&Ge.call(n,"index")&&(r.index=n.index,r.input=n.input),r}function br(n){return n=n.constructor,typeof n=="function"&&n instanceof n||(n=Be),new n}function xr(n,t,r){var e=n.constructor;switch(t){case J:return Bt(n);case D:case P:return new e(+n);case X:case H:case Q:case nn:case tn:case rn:case en:case un:case on:return t=n.buffer,new e(r?Bt(t):t,n.byteOffset,n.length);case V:case G:return new e(n);case Z:var u=new e(n.source,kn.exec(n));u.lastIndex=n.lastIndex}return u;

}function Ar(n,t,r){return null==n||Er(t,n)||(t=$r(t),n=1==t.length?n:gt(n,It(t,0,-1)),t=Pr(t)),t=null==n?n:n[t],null==t?w:t.apply(n,r)}function jr(n){return null!=n&&Rr(Yu(n))}function kr(n,t){return n=+n,t=null==t?Tu:t,-1<n&&0==n%1&&n<t}function Or(n,t,r){if(!se(r))return false;var e=typeof t;return("number"==e?jr(r)&&kr(t,r.length):"string"==e&&t in r)?(t=r[t],n===n?n===t:t!==t):false}function Er(n,t){var r=typeof n;return"string"==r&&dn.test(n)||"number"==r?true:To(n)?false:!yn.test(n)||null!=t&&n in Fr(t);

}function Ir(n){var t=Vu(n);return!!t&&n===$n[t]&&t in Bn.prototype}function Rr(n){return typeof n=="number"&&-1<n&&0==n%1&&n<=Tu}function Cr(n){return n===n&&!se(n)}function Wr(n,t){n=Fr(n);for(var r=-1,e=t.length,u={};++r<e;){var o=t[r];o in n&&(u[o]=n[o])}return u}function Sr(n,t){var r={};return pt(n,function(n,e,u){t(n,e,u)&&(r[e]=n)}),r}function Tr(n){var t;if(!h(n)||Xe.call(n)!=Y||!(Ge.call(n,"constructor")||(t=n.constructor,typeof t!="function"||t instanceof t)))return false;var r;return pt(n,function(n,t){
r=t}),r===w||Ge.call(n,r)}function Ur(n){for(var t=me(n),r=t.length,e=r&&n.length,u=$n.support,u=e&&Rr(e)&&(To(n)||u.nonEnumArgs&&ae(n)),o=-1,i=[];++o<r;){var f=t[o];(u&&kr(f,e)||Ge.call(n,f))&&i.push(f)}return i}function Nr(n){return null==n?[]:jr(n)?se(n)?n:Be(n):we(n)}function Fr(n){return se(n)?n:Be(n)}function $r(n){if(To(n))return n;var t=[];return u(n).replace(mn,function(n,r,e,u){t.push(e?u.replace(An,"$1"):r||n)}),t}function Lr(n){return n instanceof Bn?n.clone():new zn(n.__wrapped__,n.__chain__,qn(n.__actions__));

}function zr(n,t,r){return n&&n.length?((r?Or(n,t,r):null==t)&&(t=1),It(n,0>t?0:t)):[]}function Br(n,t,r){var e=n?n.length:0;return e?((r?Or(n,t,r):null==t)&&(t=1),t=e-(+t||0),It(n,0,0>t?0:t)):[]}function Mr(n){return n?n[0]:w}function Dr(n,t,e){var u=n?n.length:0;if(!u)return-1;if(typeof e=="number")e=0>e?bu(u+e,0):e;else if(e)return e=$t(n,t),n=n[e],(t===t?t===n:n!==n)?e:-1;return r(n,t,e||0)}function Pr(n){var t=n?n.length:0;return t?n[t-1]:w}function qr(n){return zr(n,1)}function Kr(n,t,e,u){
if(!n||!n.length)return[];null!=t&&typeof t!="boolean"&&(u=e,e=Or(n,t,u)?null:t,t=false);var o=dr();if((o!==ut||null!=e)&&(e=o(e,u,3)),t&&mr()==r){t=e;var i;e=-1,u=n.length;for(var o=-1,f=[];++e<u;){var a=n[e],c=t?t(a,e,n):a;e&&i===c||(i=c,f[++o]=a)}n=f}else n=Tt(n,e);return n}function Vr(n){if(!n||!n.length)return[];var t=-1,r=0;n=Gn(n,function(n){return jr(n)?(r=bu(n.length,r),true):void 0});for(var e=Ue(r);++t<r;)e[t]=Jn(n,At(t));return e}function Yr(n,t,r){return n&&n.length?(n=Vr(n),null==t?n:(t=zt(t,r,4),
Jn(n,function(n){return Xn(n,t,w,true)}))):[]}function Zr(n,t){var r=-1,e=n?n.length:0,u={};for(!e||t||To(n[0])||(t=[]);++r<e;){var o=n[r];t?u[o]=t[r]:o&&(u[o[0]]=o[1])}return u}function Gr(n){return n=$n(n),n.__chain__=true,n}function Jr(n,t,r){return t.call(r,n)}function Xr(n,t,r){var e=To(n)?Vn:at;return r&&Or(n,t,r)&&(t=null),(typeof t!="function"||r!==w)&&(t=dr(t,r,3)),e(n,t)}function Hr(n,t,r){var e=To(n)?Gn:ct;return t=dr(t,r,3),e(n,t)}function Qr(n,t,r,e){var u=n?Yu(n):0;return Rr(u)||(n=we(n),
u=n.length),u?(r=typeof r!="number"||e&&Or(t,r,e)?0:0>r?bu(u+r,0):r||0,typeof n=="string"||!To(n)&&ve(n)?r<u&&-1<n.indexOf(t,r):-1<mr(n,t,r)):false}function ne(n,t,r){var e=To(n)?Jn:mt;return t=dr(t,r,3),e(n,t)}function te(n,t,r){return(r?Or(n,t,r):null==t)?(n=Nr(n),t=n.length,0<t?n[Ot(0,t-1)]:w):(n=re(n),n.length=xu(0>t?0:+t||0,n.length),n)}function re(n){n=Nr(n);for(var t=-1,r=n.length,e=Ue(r);++t<r;){var u=Ot(0,t);t!=u&&(e[t]=e[u]),e[u]=n[t]}return e}function ee(n,t,r){var e=To(n)?Hn:Rt;return r&&Or(n,t,r)&&(t=null),
(typeof t!="function"||r!==w)&&(t=dr(t,r,3)),e(n,t)}function ue(n,t){var r;if(typeof t!="function"){if(typeof n!="function")throw new Pe(L);var e=n;n=t,t=e}return function(){return 0<--n&&(r=t.apply(this,arguments)),1>=n&&(t=null),r}}function oe(n,t,r){function e(){var r=t-(wo()-c);0>=r||r>t?(f&&eu(f),r=p,f=s=p=w,r&&(h=wo(),a=n.apply(l,i),s||f||(i=l=null))):s=su(e,r)}function u(){s&&eu(s),f=s=p=w,(v||_!==t)&&(h=wo(),a=n.apply(l,i),s||f||(i=l=null))}function o(){if(i=arguments,c=wo(),l=this,p=v&&(s||!g),
!1===_)var r=g&&!s;else{f||g||(h=c);var o=_-(c-h),y=0>=o||o>_;y?(f&&(f=eu(f)),h=c,a=n.apply(l,i)):f||(f=su(u,o))}return y&&s?s=eu(s):s||t===_||(s=su(e,t)),r&&(y=true,a=n.apply(l,i)),!y||s||f||(i=l=null),a}var i,f,a,c,l,s,p,h=0,_=false,v=true;if(typeof n!="function")throw new Pe(L);if(t=0>t?0:+t||0,true===r)var g=true,v=false;else se(r)&&(g=r.leading,_="maxWait"in r&&bu(+r.maxWait||0,t),v="trailing"in r?r.trailing:v);return o.cancel=function(){s&&eu(s),f&&eu(f),f=s=p=w},o}function ie(n,t){function r(){var e=arguments,u=r.cache,o=t?t.apply(this,e):e[0];

return u.has(o)?u.get(o):(e=n.apply(this,e),u.set(o,e),e)}if(typeof n!="function"||t&&typeof t!="function")throw new Pe(L);return r.cache=new ie.Cache,r}function fe(n,t){if(typeof n!="function")throw new Pe(L);return t=bu(t===w?n.length-1:+t||0,0),function(){for(var r=arguments,e=-1,u=bu(r.length-t,0),o=Ue(u);++e<u;)o[e]=r[t+e];switch(t){case 0:return n.call(this,o);case 1:return n.call(this,r[0],o);case 2:return n.call(this,r[0],r[1],o)}for(u=Ue(t+1),e=-1;++e<t;)u[e]=r[e];return u[t]=o,n.apply(this,u);

}}function ae(n){return h(n)&&jr(n)&&Xe.call(n)==B}function ce(n){return!!n&&1===n.nodeType&&h(n)&&-1<Xe.call(n).indexOf("Element")}function le(n){return h(n)&&typeof n.message=="string"&&Xe.call(n)==q}function se(n){var t=typeof n;return"function"==t||!!n&&"object"==t}function pe(n){return null==n?false:Xe.call(n)==K?Qe.test(Ze.call(n)):h(n)&&En.test(n)}function he(n){return typeof n=="number"||h(n)&&Xe.call(n)==V}function _e(n){return h(n)&&Xe.call(n)==Z}function ve(n){return typeof n=="string"||h(n)&&Xe.call(n)==G;

}function ge(n){return h(n)&&Rr(n.length)&&!!Un[Xe.call(n)]}function ye(n){return et(n,me(n))}function de(n){return vt(n,me(n))}function me(n){if(null==n)return[];se(n)||(n=Be(n));for(var t=n.length,t=t&&Rr(t)&&(To(n)||Fu.nonEnumArgs&&ae(n))&&t||0,r=n.constructor,e=-1,r=typeof r=="function"&&r.prototype===n,u=Ue(t),o=0<t;++e<t;)u[e]=e+"";for(var i in n)o&&kr(i,t)||"constructor"==i&&(r||!Ge.call(n,i))||u.push(i);return u}function we(n){return Ut(n,Ko(n))}function be(n){return(n=u(n))&&n.replace(In,c).replace(xn,"");

}function xe(n){return(n=u(n))&&bn.test(n)?n.replace(wn,"\\$&"):n}function Ae(n,t,r){return r&&Or(n,t,r)&&(t=0),ku(n,t)}function je(n,t){var r="";if(n=u(n),t=+t,1>t||!n||!mu(t))return r;do t%2&&(r+=n),t=uu(t/2),n+=n;while(t);return r}function ke(n,t,r){var e=n;return(n=u(n))?(r?Or(e,t,r):null==t)?n.slice(g(n),y(n)+1):(t+="",n.slice(i(n,t),f(n,t)+1)):n}function Oe(n,t,r){return r&&Or(n,t,r)&&(t=null),n=u(n),n.match(t||Wn)||[]}function Ee(n,t,r){return r&&Or(n,t,r)&&(t=null),h(n)?Ce(n):ut(n,t)}function Ie(n){
return function(){return n}}function Re(n){return n}function Ce(n){return wt(ot(n,true))}function We(n,t,r){if(null==r){var e=se(t),u=e&&Ko(t);((u=u&&u.length&&vt(t,u))?u.length:e)||(u=false,r=t,t=n,n=this)}u||(u=vt(t,Ko(t)));var o=true,e=-1,i=No(n),f=u.length;false===r?o=false:se(r)&&"chain"in r&&(o=r.chain);for(;++e<f;){r=u[e];var a=t[r];n[r]=a,i&&(n.prototype[r]=function(t){return function(){var r=this.__chain__;if(o||r){var e=n(this.__wrapped__);return(e.__actions__=qn(this.__actions__)).push({func:t,args:arguments,
thisArg:n}),e.__chain__=r,e}return r=[this.value()],fu.apply(r,arguments),t.apply(n,r)}}(a))}return n}function Se(){}function Te(n){return Er(n)?At(n):jt(n)}_=_?Zn.defaults(Yn.Object(),_,Zn.pick(Yn,Tn)):Yn;var Ue=_.Array,Ne=_.Date,Fe=_.Error,$e=_.Function,Le=_.Math,ze=_.Number,Be=_.Object,Me=_.RegExp,De=_.String,Pe=_.TypeError,qe=Ue.prototype,Ke=Be.prototype,Ve=De.prototype,Ye=(Ye=_.window)&&Ye.document,Ze=$e.prototype.toString,Ge=Ke.hasOwnProperty,Je=0,Xe=Ke.toString,He=_._,Qe=Me("^"+xe(Xe).replace(/toString|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$"),nu=pe(nu=_.ArrayBuffer)&&nu,tu=pe(tu=nu&&new nu(0).slice)&&tu,ru=Le.ceil,eu=_.clearTimeout,uu=Le.floor,ou=pe(ou=Be.getOwnPropertySymbols)&&ou,iu=pe(iu=Be.getPrototypeOf)&&iu,fu=qe.push,au=pe(au=Be.preventExtensions)&&au,cu=Ke.propertyIsEnumerable,lu=pe(lu=_.Set)&&lu,su=_.setTimeout,pu=qe.splice,hu=pe(hu=_.Uint8Array)&&hu,_u=pe(_u=_.WeakMap)&&_u,vu=function(){
try{var n=pe(n=_.Float64Array)&&n,t=new n(new nu(10),0,1)&&n}catch(r){}return t}(),gu=function(){var n=au&&pe(n=Be.assign)&&n;try{if(n){var t=au({1:0});t[0]=1}}catch(r){try{n(t,"xo")}catch(e){}return!t[1]&&n}return false}(),yu=pe(yu=Ue.isArray)&&yu,du=pe(du=Be.create)&&du,mu=_.isFinite,wu=pe(wu=Be.keys)&&wu,bu=Le.max,xu=Le.min,Au=pe(Au=Ne.now)&&Au,ju=pe(ju=ze.isFinite)&&ju,ku=_.parseInt,Ou=Le.random,Eu=ze.NEGATIVE_INFINITY,Iu=ze.POSITIVE_INFINITY,Ru=Le.pow(2,32)-1,Cu=Ru-1,Wu=Ru>>>1,Su=vu?vu.BYTES_PER_ELEMENT:0,Tu=Le.pow(2,53)-1,Uu=_u&&new _u,Nu={},Fu=$n.support={};

!function(n){function t(){this.x=n}var r=arguments,e=[];t.prototype={valueOf:n,y:n};for(var u in new t)e.push(u);Fu.funcDecomp=/\bthis\b/.test(function(){return this}),Fu.funcNames=typeof $e.name=="string";try{Fu.dom=11===Ye.createDocumentFragment().nodeType}catch(o){Fu.dom=false}try{Fu.nonEnumArgs=!cu.call(r,1)}catch(i){Fu.nonEnumArgs=true}}(1,0),$n.templateSettings={escape:_n,evaluate:vn,interpolate:gn,variable:"",imports:{_:$n}};var $u=gu||function(n,t){return null==t?n:et(t,Zu(t),et(t,Ko(t),n))},Lu=function(){
function n(){}return function(t){if(se(t)){n.prototype=t;var r=new n;n.prototype=null}return r||_.Object()}}(),zu=Kt(ht),Bu=Kt(_t,true),Mu=Vt(),Du=Vt(true),Pu=Uu?function(n,t){return Uu.set(n,t),n}:Re;tu||(Bt=nu&&hu?function(n){var t=n.byteLength,r=vu?uu(t/Su):0,e=r*Su,u=new nu(t);if(r){var o=new vu(u,0,r);o.set(new vu(n,0,r))}return t!=e&&(o=new hu(u,e),o.set(new hu(n,e))),u}:Ie(null));var qu=du&&lu?function(n){return new Dn(n)}:Ie(null),Ku=Uu?function(n){return Uu.get(n)}:Se,Vu=function(){return Fu.funcNames?"constant"==Ie.name?At("name"):function(n){
for(var t=n.name,r=Nu[t],e=r?r.length:0;e--;){var u=r[e],o=u.func;if(null==o||o==n)return u.name}return t}:Ie("")}(),Yu=At("length"),Zu=ou?function(n){return ou(Fr(n))}:Ie([]),Gu=function(){var n=0,t=0;return function(r,e){var u=wo(),o=U-(u-t);if(t=u,0<o){if(++n>=T)return r}else n=0;return Pu(r,e)}}(),Ju=fe(function(n,t){return jr(n)?ft(n,st(t,false,true)):[]}),Xu=Qt(),Hu=Qt(true),Qu=fe(function(t,r){r=st(r);var e=rt(t,r);return kt(t,r.sort(n)),e}),no=pr(),to=pr(true),ro=fe(function(n){return Tt(st(n,false,true));

}),eo=fe(function(n,t){return jr(n)?ft(n,t):[]}),uo=fe(Vr),oo=fe(function(n){var t=n.length,r=n[t-2],e=n[t-1];return 2<t&&typeof r=="function"?t-=2:(r=1<t&&typeof e=="function"?(--t,e):w,e=w),n.length=t,Yr(n,r,e)}),io=fe(function(n,t){return rt(n,st(t))}),fo=Pt(function(n,t,r){Ge.call(n,r)?++n[r]:n[r]=1}),ao=Ht(zu),co=Ht(Bu,true),lo=rr(Kn,zu),so=rr(function(n,t){for(var r=n.length;r--&&false!==t(n[r],r,n););return n},Bu),po=Pt(function(n,t,r){Ge.call(n,r)?n[r].push(t):n[r]=[t]}),ho=Pt(function(n,t,r){
n[r]=t}),_o=fe(function(n,t,r){var e=-1,u=typeof t=="function",o=Er(t),i=jr(n)?Ue(n.length):[];return zu(n,function(n){var f=u?t:o&&null!=n&&n[t];i[++e]=f?f.apply(n,r):Ar(n,t,r)}),i}),vo=Pt(function(n,t,r){n[r?0:1].push(t)},function(){return[[],[]]}),go=ar(Xn,zu),yo=ar(function(n,t,r,e){var u=n.length;for(e&&u&&(r=n[--u]);u--;)r=t(r,n[u],u,n);return r},Bu),mo=fe(function(n,t){if(null==n)return[];var r=t[2];return r&&Or(t[0],t[1],r)&&(t.length=1),Wt(n,st(t),[])}),wo=Au||function(){return(new Ne).getTime();

},bo=fe(function(n,t,r){var e=x;if(r.length)var u=v(r,bo.placeholder),e=e|E;return hr(n,e,t,r,u)}),xo=fe(function(n,t){t=t.length?st(t):de(n);for(var r=-1,e=t.length;++r<e;){var u=t[r];n[u]=hr(n[u],x,n)}return n}),Ao=fe(function(n,t,r){var e=x|A;if(r.length)var u=v(r,Ao.placeholder),e=e|E;return hr(t,e,n,r,u)}),jo=Jt(k),ko=Jt(O),Oo=fe(function(n,t){return it(n,1,t)}),Eo=fe(function(n,t,r){return it(n,t,r)}),Io=tr(),Ro=tr(true),Co=fr(E),Wo=fr(I),So=fe(function(n,t){return hr(n,C,null,null,null,st(t));

}),To=yu||function(n){return h(n)&&Rr(n.length)&&Xe.call(n)==M};Fu.dom||(ce=function(n){return!!n&&1===n.nodeType&&h(n)&&!Fo(n)});var Uo=ju||function(n){return typeof n=="number"&&mu(n)},No=e(/x/)||hu&&!e(hu)?function(n){return Xe.call(n)==K}:e,Fo=iu?function(n){if(!n||Xe.call(n)!=Y)return false;var t=n.valueOf,r=pe(t)&&(r=iu(t))&&iu(r);return r?n==r||iu(n)==r:Tr(n)}:Tr,$o=qt(function(n,t,r){return r?tt(n,t,r):$u(n,t)}),Lo=fe(function(n){var t=n[0];return null==t?t:(n.push(Qn),$o.apply(w,n))}),zo=nr(ht),Bo=nr(_t),Mo=er(Mu),Do=er(Du),Po=ur(ht),qo=ur(_t),Ko=wu?function(n){
var t=null!=n&&n.constructor;return typeof t=="function"&&t.prototype===n||typeof n!="function"&&jr(n)?Ur(n):se(n)?wu(n):[]}:Ur,Vo=or(true),Yo=or(),Zo=qt(xt),Go=fe(function(n,t){if(null==n)return{};if("function"!=typeof t[0])return t=Jn(st(t),De),Wr(n,ft(me(n),t));var r=zt(t[0],t[1],3);return Sr(n,function(n,t,e){return!r(n,t,e)})}),Jo=fe(function(n,t){return null==n?{}:"function"==typeof t[0]?Sr(n,zt(t[0],t[1],3)):Wr(n,st(t))}),Xo=Zt(function(n,t,r){return t=t.toLowerCase(),n+(r?t.charAt(0).toUpperCase()+t.slice(1):t);

}),Ho=Zt(function(n,t,r){return n+(r?"-":"")+t.toLowerCase()}),Qo=ir(),ni=ir(true);8!=ku(Sn+"08")&&(Ae=function(n,t,r){return(r?Or(n,t,r):null==t)?t=0:t&&(t=+t),n=ke(n),ku(n,t||(On.test(n)?16:10))});var ti=Zt(function(n,t,r){return n+(r?"_":"")+t.toLowerCase()}),ri=Zt(function(n,t,r){return n+(r?" ":"")+(t.charAt(0).toUpperCase()+t.slice(1))}),ei=fe(function(n,t){try{return n.apply(w,t)}catch(r){return le(r)?r:new Fe(r)}}),ui=fe(function(n,t){return function(r){return Ar(r,n,t)}}),oi=fe(function(n,t){
return function(r){return Ar(n,r,t)}}),ii=Xt(function(n){for(var t=-1,r=n.length,e=Eu;++t<r;){var u=n[t];u>e&&(e=u)}return e}),fi=Xt(function(n){for(var t=-1,r=n.length,e=Iu;++t<r;){var u=n[t];u<e&&(e=u)}return e},true);return $n.prototype=Ln.prototype,zn.prototype=Lu(Ln.prototype),zn.prototype.constructor=zn,Bn.prototype=Lu(Ln.prototype),Bn.prototype.constructor=Bn,Mn.prototype["delete"]=function(n){return this.has(n)&&delete this.__data__[n]},Mn.prototype.get=function(n){return"__proto__"==n?w:this.__data__[n];

},Mn.prototype.has=function(n){return"__proto__"!=n&&Ge.call(this.__data__,n)},Mn.prototype.set=function(n,t){return"__proto__"!=n&&(this.__data__[n]=t),this},Dn.prototype.push=function(n){var t=this.data;typeof n=="string"||se(n)?t.set.add(n):t.hash[n]=true},ie.Cache=Mn,$n.after=function(n,t){if(typeof t!="function"){if(typeof n!="function")throw new Pe(L);var r=n;n=t,t=r}return n=mu(n=+n)?n:0,function(){return 1>--n?t.apply(this,arguments):void 0}},$n.ary=function(n,t,r){return r&&Or(n,t,r)&&(t=null),
t=n&&null==t?n.length:bu(+t||0,0),hr(n,R,null,null,null,null,t)},$n.assign=$o,$n.at=io,$n.before=ue,$n.bind=bo,$n.bindAll=xo,$n.bindKey=Ao,$n.callback=Ee,$n.chain=Gr,$n.chunk=function(n,t,r){t=(r?Or(n,t,r):null==t)?1:bu(+t||1,1),r=0;for(var e=n?n.length:0,u=-1,o=Ue(ru(e/t));r<e;)o[++u]=It(n,r,r+=t);return o},$n.compact=function(n){for(var t=-1,r=n?n.length:0,e=-1,u=[];++t<r;){var o=n[t];o&&(u[++e]=o)}return u},$n.constant=Ie,$n.countBy=fo,$n.create=function(n,t,r){var e=Lu(n);return r&&Or(n,t,r)&&(t=null),
t?$u(e,t):e},$n.curry=jo,$n.curryRight=ko,$n.debounce=oe,$n.defaults=Lo,$n.defer=Oo,$n.delay=Eo,$n.difference=Ju,$n.drop=zr,$n.dropRight=Br,$n.dropRightWhile=function(n,t,r){return n&&n.length?Nt(n,dr(t,r,3),true,true):[]},$n.dropWhile=function(n,t,r){return n&&n.length?Nt(n,dr(t,r,3),true):[]},$n.fill=function(n,t,r,e){var u=n?n.length:0;if(!u)return[];for(r&&typeof r!="number"&&Or(n,t,r)&&(r=0,e=u),u=n.length,r=null==r?0:+r||0,0>r&&(r=-r>u?0:u+r),e=e===w||e>u?u:+e||0,0>e&&(e+=u),u=r>e?0:e>>>0,r>>>=0;r<u;)n[r++]=t;

return n},$n.filter=Hr,$n.flatten=function(n,t,r){var e=n?n.length:0;return r&&Or(n,t,r)&&(t=false),e?st(n,t):[]},$n.flattenDeep=function(n){return n&&n.length?st(n,true):[]},$n.flow=Io,$n.flowRight=Ro,$n.forEach=lo,$n.forEachRight=so,$n.forIn=Mo,$n.forInRight=Do,$n.forOwn=Po,$n.forOwnRight=qo,$n.functions=de,$n.groupBy=po,$n.indexBy=ho,$n.initial=function(n){return Br(n,1)},$n.intersection=function(){for(var n=[],t=-1,e=arguments.length,u=[],o=mr(),i=o==r,f=[];++t<e;){var a=arguments[t];jr(a)&&(n.push(a),
u.push(i&&120<=a.length?qu(t&&a):null))}if(e=n.length,2>e)return f;var i=n[0],c=-1,l=i?i.length:0,s=u[0];n:for(;++c<l;)if(a=i[c],0>(s?Pn(s,a):o(f,a,0))){for(t=e;--t;){var p=u[t];if(0>(p?Pn(p,a):o(n[t],a,0)))continue n}s&&s.push(a),f.push(a)}return f},$n.invert=function(n,t,r){r&&Or(n,t,r)&&(t=null),r=-1;for(var e=Ko(n),u=e.length,o={};++r<u;){var i=e[r],f=n[i];t?Ge.call(o,f)?o[f].push(i):o[f]=[i]:o[f]=i}return o},$n.invoke=_o,$n.keys=Ko,$n.keysIn=me,$n.map=ne,$n.mapKeys=Vo,$n.mapValues=Yo,$n.matches=Ce,
$n.matchesProperty=function(n,t){return bt(n,ot(t,true))},$n.memoize=ie,$n.merge=Zo,$n.method=ui,$n.methodOf=oi,$n.mixin=We,$n.negate=function(n){if(typeof n!="function")throw new Pe(L);return function(){return!n.apply(this,arguments)}},$n.omit=Go,$n.once=function(n){return ue(2,n)},$n.pairs=function(n){for(var t=-1,r=Ko(n),e=r.length,u=Ue(e);++t<e;){var o=r[t];u[t]=[o,n[o]]}return u},$n.partial=Co,$n.partialRight=Wo,$n.partition=vo,$n.pick=Jo,$n.pluck=function(n,t){return ne(n,Te(t))},$n.property=Te,
$n.propertyOf=function(n){return function(t){return gt(n,$r(t),t+"")}},$n.pull=function(){var n=arguments,t=n[0];if(!t||!t.length)return t;for(var r=0,e=mr(),u=n.length;++r<u;)for(var o=0,i=n[r];-1<(o=e(t,i,o));)pu.call(t,o,1);return t},$n.pullAt=Qu,$n.range=function(n,t,r){r&&Or(n,t,r)&&(t=r=null),n=+n||0,r=null==r?1:+r||0,null==t?(t=n,n=0):t=+t||0;var e=-1;t=bu(ru((t-n)/(r||1)),0);for(var u=Ue(t);++e<t;)u[e]=n,n+=r;return u},$n.rearg=So,$n.reject=function(n,t,r){var e=To(n)?Gn:ct;return t=dr(t,r,3),
e(n,function(n,r,e){return!t(n,r,e)})},$n.remove=function(n,t,r){var e=[];if(!n||!n.length)return e;var u=-1,o=[],i=n.length;for(t=dr(t,r,3);++u<i;)r=n[u],t(r,u,n)&&(e.push(r),o.push(u));return kt(n,o),e},$n.rest=qr,$n.restParam=fe,$n.set=function(n,t,r){if(null==n)return n;var e=t+"";t=null!=n[e]||Er(t,n)?[e]:$r(t);for(var e=-1,u=t.length,o=u-1,i=n;null!=i&&++e<u;){var f=t[e];se(i)&&(e==o?i[f]=r:null==i[f]&&(i[f]=kr(t[e+1])?[]:{})),i=i[f]}return n},$n.shuffle=re,$n.slice=function(n,t,r){var e=n?n.length:0;

return e?(r&&typeof r!="number"&&Or(n,t,r)&&(t=0,r=e),It(n,t,r)):[]},$n.sortBy=function(n,t,r){if(null==n)return[];r&&Or(n,t,r)&&(t=null);var e=-1;return t=dr(t,r,3),n=mt(n,function(n,r,u){return{a:t(n,r,u),b:++e,c:n}}),Ct(n,a)},$n.sortByAll=mo,$n.sortByOrder=function(n,t,r,e){return null==n?[]:(e&&Or(t,r,e)&&(r=null),To(t)||(t=null==t?[]:[t]),To(r)||(r=null==r?[]:[r]),Wt(n,t,r))},$n.spread=function(n){if(typeof n!="function")throw new Pe(L);return function(t){return n.apply(this,t)}},$n.take=function(n,t,r){
return n&&n.length?((r?Or(n,t,r):null==t)&&(t=1),It(n,0,0>t?0:t)):[]},$n.takeRight=function(n,t,r){var e=n?n.length:0;return e?((r?Or(n,t,r):null==t)&&(t=1),t=e-(+t||0),It(n,0>t?0:t)):[]},$n.takeRightWhile=function(n,t,r){return n&&n.length?Nt(n,dr(t,r,3),false,true):[]},$n.takeWhile=function(n,t,r){return n&&n.length?Nt(n,dr(t,r,3)):[]},$n.tap=function(n,t,r){return t.call(r,n),n},$n.throttle=function(n,t,r){var e=true,u=true;if(typeof n!="function")throw new Pe(L);return false===r?e=false:se(r)&&(e="leading"in r?!!r.leading:e,
u="trailing"in r?!!r.trailing:u),Fn.leading=e,Fn.maxWait=+t,Fn.trailing=u,oe(n,t,Fn)},$n.thru=Jr,$n.times=function(n,t,r){if(n=uu(n),1>n||!mu(n))return[];var e=-1,u=Ue(xu(n,Ru));for(t=zt(t,r,1);++e<n;)e<Ru?u[e]=t(e):t(e);return u},$n.toArray=function(n){var t=n?Yu(n):0;return Rr(t)?t?qn(n):[]:we(n)},$n.toPlainObject=ye,$n.transform=function(n,t,r,e){var u=To(n)||ge(n);return t=dr(t,e,4),null==r&&(u||se(n)?(e=n.constructor,r=u?To(n)?new e:[]:Lu(No(e)&&e.prototype)):r={}),(u?Kn:ht)(n,function(n,e,u){
return t(r,n,e,u)}),r},$n.union=ro,$n.uniq=Kr,$n.unzip=Vr,$n.unzipWith=Yr,$n.values=we,$n.valuesIn=function(n){return Ut(n,me(n))},$n.where=function(n,t){return Hr(n,wt(t))},$n.without=eo,$n.wrap=function(n,t){return t=null==t?Re:t,hr(t,E,null,[n],[])},$n.xor=function(){for(var n=-1,t=arguments.length;++n<t;){var r=arguments[n];if(jr(r))var e=e?ft(e,r).concat(ft(r,e)):r}return e?Tt(e):[]},$n.zip=uo,$n.zipObject=Zr,$n.zipWith=oo,$n.backflow=Ro,$n.collect=ne,$n.compose=Ro,$n.each=lo,$n.eachRight=so,
$n.extend=$o,$n.iteratee=Ee,$n.methods=de,$n.object=Zr,$n.select=Hr,$n.tail=qr,$n.unique=Kr,We($n,$n),$n.add=function(n,t){return(+n||0)+(+t||0)},$n.attempt=ei,$n.camelCase=Xo,$n.capitalize=function(n){return(n=u(n))&&n.charAt(0).toUpperCase()+n.slice(1)},$n.clone=function(n,t,r,e){return t&&typeof t!="boolean"&&Or(n,t,r)?t=false:typeof t=="function"&&(e=r,r=t,t=false),r=typeof r=="function"&&zt(r,e,1),ot(n,t,r)},$n.cloneDeep=function(n,t,r){return t=typeof t=="function"&&zt(t,r,1),ot(n,true,t)},$n.deburr=be,
$n.endsWith=function(n,t,r){n=u(n),t+="";var e=n.length;return r=r===w?e:xu(0>r?0:+r||0,e),r-=t.length,0<=r&&n.indexOf(t,r)==r},$n.escape=function(n){return(n=u(n))&&hn.test(n)?n.replace(sn,l):n},$n.escapeRegExp=xe,$n.every=Xr,$n.find=ao,$n.findIndex=Xu,$n.findKey=zo,$n.findLast=co,$n.findLastIndex=Hu,$n.findLastKey=Bo,$n.findWhere=function(n,t){return ao(n,wt(t))},$n.first=Mr,$n.get=function(n,t,r){return n=null==n?w:gt(n,$r(t),t+""),n===w?r:n},$n.has=function(n,t){if(null==n)return false;var r=Ge.call(n,t);

return r||Er(t)||(t=$r(t),n=1==t.length?n:gt(n,It(t,0,-1)),t=Pr(t),r=null!=n&&Ge.call(n,t)),r},$n.identity=Re,$n.includes=Qr,$n.indexOf=Dr,$n.inRange=function(n,t,r){return t=+t||0,"undefined"===typeof r?(r=t,t=0):r=+r||0,n>=xu(t,r)&&n<bu(t,r)},$n.isArguments=ae,$n.isArray=To,$n.isBoolean=function(n){return true===n||false===n||h(n)&&Xe.call(n)==D},$n.isDate=function(n){return h(n)&&Xe.call(n)==P},$n.isElement=ce,$n.isEmpty=function(n){return null==n?true:jr(n)&&(To(n)||ve(n)||ae(n)||h(n)&&No(n.splice))?!n.length:!Ko(n).length;

},$n.isEqual=function(n,t,r,e){return r=typeof r=="function"&&zt(r,e,3),!r&&Cr(n)&&Cr(t)?n===t:(e=r?r(n,t):w,e===w?yt(n,t,r):!!e)},$n.isError=le,$n.isFinite=Uo,$n.isFunction=No,$n.isMatch=function(n,t,r,e){var u=Ko(t),o=u.length;if(!o)return true;if(null==n)return false;if(r=typeof r=="function"&&zt(r,e,3),n=Fr(n),!r&&1==o){var i=u[0];if(e=t[i],Cr(e))return e===n[i]&&(e!==w||i in n)}for(var i=Ue(o),f=Ue(o);o--;)e=i[o]=t[u[o]],f[o]=Cr(e);return dt(n,u,i,f,r)},$n.isNaN=function(n){return he(n)&&n!=+n},$n.isNative=pe,
$n.isNull=function(n){return null===n},$n.isNumber=he,$n.isObject=se,$n.isPlainObject=Fo,$n.isRegExp=_e,$n.isString=ve,$n.isTypedArray=ge,$n.isUndefined=function(n){return n===w},$n.kebabCase=Ho,$n.last=Pr,$n.lastIndexOf=function(n,t,r){var e=n?n.length:0;if(!e)return-1;var u=e;if(typeof r=="number")u=(0>r?bu(e+r,0):xu(r||0,e-1))+1;else if(r)return u=$t(n,t,true)-1,n=n[u],(t===t?t===n:n!==n)?u:-1;if(t!==t)return p(n,u,true);for(;u--;)if(n[u]===t)return u;return-1},$n.max=ii,$n.min=fi,$n.noConflict=function(){
return _._=He,this},$n.noop=Se,$n.now=wo,$n.pad=function(n,t,r){n=u(n),t=+t;var e=n.length;return e<t&&mu(t)?(e=(t-e)/2,t=uu(e),e=ru(e),r=lr("",e,r),r.slice(0,t)+n+r):n},$n.padLeft=Qo,$n.padRight=ni,$n.parseInt=Ae,$n.random=function(n,t,r){r&&Or(n,t,r)&&(t=r=null);var e=null==n,u=null==t;return null==r&&(u&&typeof n=="boolean"?(r=n,n=1):typeof t=="boolean"&&(r=t,u=true)),e&&u&&(t=1,u=false),n=+n||0,u?(t=n,n=0):t=+t||0,r||n%1||t%1?(r=Ou(),xu(n+r*(t-n+parseFloat("1e-"+((r+"").length-1))),t)):Ot(n,t)},$n.reduce=go,
$n.reduceRight=yo,$n.repeat=je,$n.result=function(n,t,r){var e=null==n?w:n[t];return e===w&&(null==n||Er(t,n)||(t=$r(t),n=1==t.length?n:gt(n,It(t,0,-1)),e=null==n?w:n[Pr(t)]),e=e===w?r:e),No(e)?e.call(n):e},$n.runInContext=m,$n.size=function(n){var t=n?Yu(n):0;return Rr(t)?t:Ko(n).length},$n.snakeCase=ti,$n.some=ee,$n.sortedIndex=no,$n.sortedLastIndex=to,$n.startCase=ri,$n.startsWith=function(n,t,r){return n=u(n),r=null==r?0:xu(0>r?0:+r||0,n.length),n.lastIndexOf(t,r)==r},$n.sum=function(n,t,r){r&&Or(n,t,r)&&(t=null);

var e=dr(),u=null==t;if(e===ut&&u||(u=false,t=e(t,r,3)),u){for(n=To(n)?n:Nr(n),t=n.length,r=0;t--;)r+=+n[t]||0;n=r}else n=St(n,t);return n},$n.template=function(n,t,r){var e=$n.templateSettings;r&&Or(n,t,r)&&(t=r=null),n=u(n),t=tt($u({},r||t),e,nt),r=tt($u({},t.imports),e.imports,nt);var o,i,f=Ko(r),a=Ut(r,f),c=0;r=t.interpolate||Rn;var l="__p+='";r=Me((t.escape||Rn).source+"|"+r.source+"|"+(r===gn?jn:Rn).source+"|"+(t.evaluate||Rn).source+"|$","g");var p="sourceURL"in t?"//# sourceURL="+t.sourceURL+"\n":"";

if(n.replace(r,function(t,r,e,u,f,a){return e||(e=u),l+=n.slice(c,a).replace(Cn,s),r&&(o=true,l+="'+__e("+r+")+'"),f&&(i=true,l+="';"+f+";\n__p+='"),e&&(l+="'+((__t=("+e+"))==null?'':__t)+'"),c=a+t.length,t}),l+="';",(t=t.variable)||(l="with(obj){"+l+"}"),l=(i?l.replace(fn,""):l).replace(an,"$1").replace(cn,"$1;"),l="function("+(t||"obj")+"){"+(t?"":"obj||(obj={});")+"var __t,__p=''"+(o?",__e=_.escape":"")+(i?",__j=Array.prototype.join;function print(){__p+=__j.call(arguments,'')}":";")+l+"return __p}",
t=ei(function(){return $e(f,p+"return "+l).apply(w,a)}),t.source=l,le(t))throw t;return t},$n.trim=ke,$n.trimLeft=function(n,t,r){var e=n;return(n=u(n))?n.slice((r?Or(e,t,r):null==t)?g(n):i(n,t+"")):n},$n.trimRight=function(n,t,r){var e=n;return(n=u(n))?(r?Or(e,t,r):null==t)?n.slice(0,y(n)+1):n.slice(0,f(n,t+"")+1):n},$n.trunc=function(n,t,r){r&&Or(n,t,r)&&(t=null);var e=W;if(r=S,null!=t)if(se(t)){var o="separator"in t?t.separator:o,e="length"in t?+t.length||0:e;r="omission"in t?u(t.omission):r}else e=+t||0;

if(n=u(n),e>=n.length)return n;if(e-=r.length,1>e)return r;if(t=n.slice(0,e),null==o)return t+r;if(_e(o)){if(n.slice(e).search(o)){var i,f=n.slice(0,e);for(o.global||(o=Me(o.source,(kn.exec(o)||"")+"g")),o.lastIndex=0;n=o.exec(f);)i=n.index;t=t.slice(0,null==i?e:i)}}else n.indexOf(o,e)!=e&&(o=t.lastIndexOf(o),-1<o&&(t=t.slice(0,o)));return t+r},$n.unescape=function(n){return(n=u(n))&&pn.test(n)?n.replace(ln,d):n},$n.uniqueId=function(n){var t=++Je;return u(n)+t},$n.words=Oe,$n.all=Xr,$n.any=ee,$n.contains=Qr,
$n.detect=ao,$n.foldl=go,$n.foldr=yo,$n.head=Mr,$n.include=Qr,$n.inject=go,We($n,function(){var n={};return ht($n,function(t,r){$n.prototype[r]||(n[r]=t)}),n}(),false),$n.sample=te,$n.prototype.sample=function(n){return this.__chain__||null!=n?this.thru(function(t){return te(t,n)}):te(this.value())},$n.VERSION=b,Kn("bind bindKey curry curryRight partial partialRight".split(" "),function(n){$n[n].placeholder=$n}),Kn(["dropWhile","filter","map","takeWhile"],function(n,t){var r=t!=$,e=t==N;Bn.prototype[n]=function(n,u){
var o=this.__filtered__,i=o&&e?new Bn(this):this.clone();return(i.__iteratees__||(i.__iteratees__=[])).push({done:false,count:0,index:0,iteratee:dr(n,u,1),limit:-1,type:t}),i.__filtered__=o||r,i}}),Kn(["drop","take"],function(n,t){var r=n+"While";Bn.prototype[n]=function(r){var e=this.__filtered__,u=e&&!t?this.dropWhile():this.clone();return r=null==r?1:bu(uu(r)||0,0),e?t?u.__takeCount__=xu(u.__takeCount__,r):Pr(u.__iteratees__).limit=r:(u.__views__||(u.__views__=[])).push({size:r,type:n+(0>u.__dir__?"Right":"")
}),u},Bn.prototype[n+"Right"]=function(t){return this.reverse()[n](t).reverse()},Bn.prototype[n+"RightWhile"]=function(n,t){return this.reverse()[r](n,t).reverse()}}),Kn(["first","last"],function(n,t){var r="take"+(t?"Right":"");Bn.prototype[n]=function(){return this[r](1).value()[0]}}),Kn(["initial","rest"],function(n,t){var r="drop"+(t?"":"Right");Bn.prototype[n]=function(){return this[r](1)}}),Kn(["pluck","where"],function(n,t){var r=t?"filter":"map",e=t?wt:Te;Bn.prototype[n]=function(n){return this[r](e(n));

}}),Bn.prototype.compact=function(){return this.filter(Re)},Bn.prototype.reject=function(n,t){return n=dr(n,t,1),this.filter(function(t){return!n(t)})},Bn.prototype.slice=function(n,t){n=null==n?0:+n||0;var r=this;return 0>n?r=this.takeRight(-n):n&&(r=this.drop(n)),t!==w&&(t=+t||0,r=0>t?r.dropRight(-t):r.take(t-n)),r},Bn.prototype.toArray=function(){return this.drop(0)},ht(Bn.prototype,function(n,t){var r=$n[t];if(r){var e=/^(?:filter|map|reject)|While$/.test(t),u=/^(?:first|last)$/.test(t);$n.prototype[t]=function(){
function t(n){return n=[n],fu.apply(n,o),r.apply($n,n)}var o=arguments,i=this.__chain__,f=this.__wrapped__,a=!!this.__actions__.length,c=f instanceof Bn,l=o[0],s=c||To(f);return s&&e&&typeof l=="function"&&1!=l.length&&(c=s=false),c=c&&!a,u&&!i?c?n.call(f):r.call($n,this.value()):s?(f=n.apply(c?f:new Bn(this),o),u||!a&&!f.__actions__||(f.__actions__||(f.__actions__=[])).push({func:Jr,args:[t],thisArg:$n}),new zn(f,i)):this.thru(t)}}}),Kn("concat join pop push replace shift sort splice split unshift".split(" "),function(n){
var t=(/^(?:replace|split)$/.test(n)?Ve:qe)[n],r=/^(?:push|sort|unshift)$/.test(n)?"tap":"thru",e=/^(?:join|pop|replace|shift)$/.test(n);$n.prototype[n]=function(){var n=arguments;return e&&!this.__chain__?t.apply(this.value(),n):this[r](function(r){return t.apply(r,n)})}}),ht(Bn.prototype,function(n,t){var r=$n[t];if(r){var e=r.name;(Nu[e]||(Nu[e]=[])).push({name:t,func:r})}}),Nu[cr(null,A).name]=[{name:"wrapper",func:null}],Bn.prototype.clone=function(){var n=this.__actions__,t=this.__iteratees__,r=this.__views__,e=new Bn(this.__wrapped__);

return e.__actions__=n?qn(n):null,e.__dir__=this.__dir__,e.__filtered__=this.__filtered__,e.__iteratees__=t?qn(t):null,e.__takeCount__=this.__takeCount__,e.__views__=r?qn(r):null,e},Bn.prototype.reverse=function(){if(this.__filtered__){var n=new Bn(this);n.__dir__=-1,n.__filtered__=true}else n=this.clone(),n.__dir__*=-1;return n},Bn.prototype.value=function(){var n=this.__wrapped__.value();if(!To(n))return Ft(n,this.__actions__);var t,r=this.__dir__,e=0>r;t=n.length;for(var u=this.__views__,o=0,i=-1,f=u?u.length:0;++i<f;){
var a=u[i],c=a.size;switch(a.type){case"drop":o+=c;break;case"dropRight":t-=c;break;case"take":t=xu(t,o+c);break;case"takeRight":o=bu(o,t-c)}}t={start:o,end:t},u=t.start,o=t.end,t=o-u,u=e?o:u-1,o=xu(t,this.__takeCount__),f=(i=this.__iteratees__)?i.length:0,a=0,c=[];n:for(;t--&&a<o;){for(var u=u+r,l=-1,s=n[u];++l<f;){var p=i[l],h=p.iteratee,_=p.type;if(_==N){if(p.done&&(e?u>p.index:u<p.index)&&(p.count=0,p.done=false),p.index=u,!(p.done||(_=p.limit,p.done=-1<_?p.count++>=_:!h(s))))continue n}else if(p=h(s),
_==$)s=p;else if(!p){if(_==F)continue n;break n}}c[a++]=s}return c},$n.prototype.chain=function(){return Gr(this)},$n.prototype.commit=function(){return new zn(this.value(),this.__chain__)},$n.prototype.plant=function(n){for(var t,r=this;r instanceof Ln;){var e=Lr(r);t?u.__wrapped__=e:t=e;var u=e,r=r.__wrapped__}return u.__wrapped__=n,t},$n.prototype.reverse=function(){var n=this.__wrapped__;return n instanceof Bn?(this.__actions__.length&&(n=new Bn(this)),new zn(n.reverse(),this.__chain__)):this.thru(function(n){
return n.reverse()})},$n.prototype.toString=function(){return this.value()+""},$n.prototype.run=$n.prototype.toJSON=$n.prototype.valueOf=$n.prototype.value=function(){return Ft(this.__wrapped__,this.__actions__)},$n.prototype.collect=$n.prototype.map,$n.prototype.head=$n.prototype.first,$n.prototype.select=$n.prototype.filter,$n.prototype.tail=$n.prototype.rest,$n}var w,b="3.8.0",x=1,A=2,j=4,k=8,O=16,E=32,I=64,R=128,C=256,W=30,S="...",T=150,U=16,N=0,F=1,$=2,L="Expected a function",z="__lodash_placeholder__",B="[object Arguments]",M="[object Array]",D="[object Boolean]",P="[object Date]",q="[object Error]",K="[object Function]",V="[object Number]",Y="[object Object]",Z="[object RegExp]",G="[object String]",J="[object ArrayBuffer]",X="[object Float32Array]",H="[object Float64Array]",Q="[object Int8Array]",nn="[object Int16Array]",tn="[object Int32Array]",rn="[object Uint8Array]",en="[object Uint8ClampedArray]",un="[object Uint16Array]",on="[object Uint32Array]",fn=/\b__p\+='';/g,an=/\b(__p\+=)''\+/g,cn=/(__e\(.*?\)|\b__t\))\+'';/g,ln=/&(?:amp|lt|gt|quot|#39|#96);/g,sn=/[&<>"'`]/g,pn=RegExp(ln.source),hn=RegExp(sn.source),_n=/<%-([\s\S]+?)%>/g,vn=/<%([\s\S]+?)%>/g,gn=/<%=([\s\S]+?)%>/g,yn=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\n\\]|\\.)*?\1)\]/,dn=/^\w*$/,mn=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g,wn=/[.*+?^${}()|[\]\/\\]/g,bn=RegExp(wn.source),xn=/[\u0300-\u036f\ufe20-\ufe23]/g,An=/\\(\\)?/g,jn=/\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g,kn=/\w*$/,On=/^0[xX]/,En=/^\[object .+?Constructor\]$/,In=/[\xc0-\xd6\xd8-\xde\xdf-\xf6\xf8-\xff]/g,Rn=/($^)/,Cn=/['\n\r\u2028\u2029\\]/g,Wn=RegExp("[A-Z\\xc0-\\xd6\\xd8-\\xde]+(?=[A-Z\\xc0-\\xd6\\xd8-\\xde][a-z\\xdf-\\xf6\\xf8-\\xff]+)|[A-Z\\xc0-\\xd6\\xd8-\\xde]?[a-z\\xdf-\\xf6\\xf8-\\xff]+|[A-Z\\xc0-\\xd6\\xd8-\\xde]+|[0-9]+","g"),Sn=" \t\x0b\f\xa0\ufeff\n\r\u2028\u2029\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000",Tn="Array ArrayBuffer Date Error Float32Array Float64Array Function Int8Array Int16Array Int32Array Math Number Object RegExp Set String _ clearTimeout document isFinite parseInt setTimeout TypeError Uint8Array Uint8ClampedArray Uint16Array Uint32Array WeakMap window".split(" "),Un={};

Un[X]=Un[H]=Un[Q]=Un[nn]=Un[tn]=Un[rn]=Un[en]=Un[un]=Un[on]=true,Un[B]=Un[M]=Un[J]=Un[D]=Un[P]=Un[q]=Un[K]=Un["[object Map]"]=Un[V]=Un[Y]=Un[Z]=Un["[object Set]"]=Un[G]=Un["[object WeakMap]"]=false;var Nn={};Nn[B]=Nn[M]=Nn[J]=Nn[D]=Nn[P]=Nn[X]=Nn[H]=Nn[Q]=Nn[nn]=Nn[tn]=Nn[V]=Nn[Y]=Nn[Z]=Nn[G]=Nn[rn]=Nn[en]=Nn[un]=Nn[on]=true,Nn[q]=Nn[K]=Nn["[object Map]"]=Nn["[object Set]"]=Nn["[object WeakMap]"]=false;var Fn={leading:false,maxWait:0,trailing:false},$n={"\xc0":"A","\xc1":"A","\xc2":"A","\xc3":"A","\xc4":"A","\xc5":"A",
"\xe0":"a","\xe1":"a","\xe2":"a","\xe3":"a","\xe4":"a","\xe5":"a","\xc7":"C","\xe7":"c","\xd0":"D","\xf0":"d","\xc8":"E","\xc9":"E","\xca":"E","\xcb":"E","\xe8":"e","\xe9":"e","\xea":"e","\xeb":"e","\xcc":"I","\xcd":"I","\xce":"I","\xcf":"I","\xec":"i","\xed":"i","\xee":"i","\xef":"i","\xd1":"N","\xf1":"n","\xd2":"O","\xd3":"O","\xd4":"O","\xd5":"O","\xd6":"O","\xd8":"O","\xf2":"o","\xf3":"o","\xf4":"o","\xf5":"o","\xf6":"o","\xf8":"o","\xd9":"U","\xda":"U","\xdb":"U","\xdc":"U","\xf9":"u","\xfa":"u",
"\xfb":"u","\xfc":"u","\xdd":"Y","\xfd":"y","\xff":"y","\xc6":"Ae","\xe6":"ae","\xde":"Th","\xfe":"th","\xdf":"ss"},Ln={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","`":"&#96;"},zn={"&amp;":"&","&lt;":"<","&gt;":">","&quot;":'"',"&#39;":"'","&#96;":"`"},Bn={"function":true,object:true},Mn={"\\":"\\","'":"'","\n":"n","\r":"r","\u2028":"u2028","\u2029":"u2029"},Dn=Bn[typeof exports]&&exports&&!exports.nodeType&&exports,Pn=Bn[typeof module]&&module&&!module.nodeType&&module,qn=Bn[typeof self]&&self&&self.Object&&self,Kn=Bn[typeof window]&&window&&window.Object&&window,Vn=Pn&&Pn.exports===Dn&&Dn,Yn=Dn&&Pn&&typeof global=="object"&&global&&global.Object&&global||Kn!==(this&&this.window)&&Kn||qn||this,Zn=m();

typeof define=="function"&&typeof define.amd=="object"&&define.amd?(Yn._=Zn, define('lodash',[],function(){return Zn})):Dn&&Pn?Vn?(Pn.exports=Zn)._=Zn:Dn._=Zn:Yn._=Zn}).call(this);
define('report/config',[], function() {

    var geometryServiceUrl = 'http://gis-gfw.wri.org/arcgis/rest/services/Utilities/Geometry/GeometryServer',
        clearanceAlertsUrl = 'http://gis-gfw.wri.org/arcgis/rest/services/image_services/forma_500/ImageServer',

        gladUrl = 'http://gis-gfw.wri.org/arcgis/rest/services/image_services/glad_alerts_analysis/ImageServer/computeHistograms',
        gladUrlConfidence = 'http://gis-gfw.wri.org/arcgis/rest/services/image_services/glad_alerts_con_analysis/ImageServer/computeHistograms',

        imageServiceUrl = 'http://gis-gfw.wri.org/arcgis/rest/services/image_services/analysis/ImageServer',
        soyCalcUrl = 'http://gis-gfw.wri.org/arcgis/rest/services/image_services/soy_total/ImageServer',
        suitabilityUrl = 'http://gis-gfw.wri.org/arcgis/rest/services/image_services/kpss_mosaic/ImageServer',
        firesQueryUrl = 'http://gis-gfw.wri.org/arcgis/rest/services/Fires/Global_Fires/MapServer',
        fieldAssessmentUrl = 'http://www.wri.org/publication/how-identify-degraded-land-sustainable-palm-oil-indonesia',
        clearanceAnalysisUrl = 'http://gis-gfw.wri.org/arcgis/rest/services/image_services/analysis_wm/ImageServer',
        boundariesUrl = 'http://gis.wri.org/arcgis/rest/services/CountryBoundaries/CountryBoundaries/MapServer/0';

    // Totoal Loss
    var lossBounds = [1, 14],
        lossLabels = [2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014];

    // Prodes
    var prodesBounds = [1, 14],
        prodesLabels = [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014],
        prodesColors = ['#25941F', '#25941F', '#25941F', '#25941F', '#25941F', '#25941F', '#209F1F', '#459F1F', '#279F1F', '#257F1F', '#269F1F', '#459F1F', '#253F1F', '#25941F', '#25941F'];

    // Guyra
    var guyraBounds = [1, 5],
        guyraLabels = [2011, 2012, 2013, 2014, 2015]; // 9/2011 - 10/2015
        // guyraColors = ['#25941F', '#25941F', '#25941F', '#25941F', '#25941F', '#25941F', '#209F1F', '#459F1F', '#279F1F', '#257F1F', '#269F1F', '#459F1F', '#253F1F', '#25941F', '#25941F'];

    // GLAD
    var gladBounds = [1, 14],
        gladLabels = [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014],
        gladColors = ['#25941F', '#25941F', '#25941F', '#25941F', '#25941F', '#25941F', '#209F1F', '#459F1F', '#279F1F', '#257F1F', '#269F1F', '#459F1F', '#253F1F', '#25941F', '#25941F'];


    // Plantation Type
    var plantationsTypeBounds = [1, 4],
        plantationsTypeLabels = ['Large industrial plantation', 'Clearing/ very young plantation', 'Mosaic of medium-sized plantations', 'Mosaic of small-sized plantations'],
        plantationsTypeColors = ['#FEBEBF', '#874546', '#FEBFE7', '#8ACD6B'];

    // Plantation Species
    var plantationsSpeciesBounds = [1, 6],
        plantationsSpeciesLabels = ['Oil palm', 'Wood Fiber/Timber', 'Oil Palm Mix', 'Wood fiber/timber mix', 'Other', 'Recently cleared'],
        plantationsSpeciesColors = ['#FD8081', '#FEBEBF', '#B6D6A1', '#FFFD7E', '#6E4786', '#22C6FC'];

    // Tree Cover Density
    var treeCoverLabels = ['31 - 50%', '51 - 74%', '75 - 100%'],
        treeCoverBounds = [1, 3],
        treeCoverColors = ['#ccf1a5', '#859a59', '#4b5923'];

    // RSPO
    var rspoBounds = [0, 3],
        rspoColors = ['#87CEEB', '#00AA00', '#DD0000', '#8A2BE2'];

    // Primary Forest
    var primaryForestLabels = ['Primary Degraded', 'Primary Intact'],
        primaryForestBounds = [1, 2],
        primaryForestColors = ['#259F1F', '#186513'];

    // Legal Classes
    var legalClassLabels = ['Convertible Production Forest', 'Limited Production Forest', 'Non-forest', 'Production Forest', 'Protected Area'],
        legalClassBounds = [1, 5],
        legalClassColors = ['rgb(230, 152, 0)', 'rgb(116, 196, 118)', 'rgb(255, 255, 190)', 'rgb(199, 233, 192)', 'rgb(35, 139, 69)'];

    var moratoriumLabels = ['Moratorium area'],
        moratoriumBounds = [0, 1],
        moratoriumColors = ['#5fc29a'];

    // Protected Areas
    var protectedAreaLabels = ['Protected Area'],
        protectedAreaBounds = [0, 1],
        protectedAreaColors = ['#296eaa'];

    // // Carbon Stocks
    // var carbonStockLabels = ['1-19', '20 - 79', 'Greater than 80'], //['0', '1 - 10', '11 - 20', '21- 35', '36 - 70', '71 - 100', '101 - 150', '151 - 200', '201 - 300', 'Greater than 300'],
    //     carbonStockBounds = [0, 2], //[0, 9],
    //     carbonStockColors = ['#fdffcc', '#f1bc8b', '#d56f4a']; //['#fdffcc', '#faeeb9', '#f6ddaa', '#f4ca99', '#f1bc8b', '#eca97a', '#e89c6f', '#e08b5e', '#db7c54', '#d56f4a'];

    var carbonStockLabels = ['0-100', '101 - 200', '201 - 300', '301 - 400', '401 - 500', 'Greater than 500'],
        carbonStockBounds = [1, 6],
        carbonStockColors = ['#fdffcc', '#faeeb9', '#f6ddaa', '#f4ca99', '#f1bc8b', '#eca97a'];


  // Brazil Biomes
    var brazilBiomesLabels = ['Pampa', 'Caatinga', 'Cerrado', 'Amazônia', 'Mata Atlântica', 'Pantanal'],
        brazilBiomesBounds = [0, 5],
        brazilBiomesColors = ['#4E7311', '#A6FD7C', '#C0E7AE', '#76B276', '#A3D3FD', '#084E73'];

    // Intact Forests
    var intactForestLabels = ['Intact Forest'],
        intactForestBounds = [0, 1],
        intactForestColors = ['#186513'];

    // Peat Lands
    var peatLandsLabels = ['Peat'],
        peatLandsBounds = [0, 1],
        peatLandsColors = ['#161D9C'];

    // Soy
    var soyBounds = [1, 13],
        soyLabels = [2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013],
        soyColors = ['#d89827', '#26fc79', '#b1e3fc', '#fdffb6', '#000', '#d89827', '#5fa965', '#161D9C', '#eeb368', '#c7ffb6', '#fca0bf', '#538996', '#745b37'];

    var lcGlobalLabels = ['Agriculture', 'Mixed agriculture and forest', 'Secondary forest', 'Primary forest', 'Mixed forest and grassland', 'Grassland / shrub', 'Swamp', 'Settlements', 'Bare land', 'Water bodies', 'Snow / ice'],
        lcGlobalBounds = [1, 11],
        lcGlobalColors = ['#E0A828', '#8BFB3B', '#D4FEC0', '#76B276', '#B98D5A', '#FFFEC1', '#689AA7', '#FCB7CB', '#D3CE63', '#77B5FC', '#FFFFFF'];

    // var lcGlobalLabels = ['Agriculture', 'Mixed agriculture and forest', 'Open broadleaved forest', 'Closed broadleaved forest', 'Open needleleaved forest', 'Closed needleleaved forest', 'Open mixed forest', 'Mixed forest and grassland', 'Grassland / shrub', 'Flooded forest', 'Wetland', 'Settlements', 'Bare land', 'Water bodies', 'Snow / ice', 'No data'],
    //     lcGlobalBounds = [1, 16],
    //     lcGlobalColors = ['#E0A828', '#8BFB3B', '#51952F', '#287310', '#B6D6A1', '#89C364', '#888749', '#B98D5A', '#FFFEC1', '#19A785', '#689AA7', '#FCB7CB', '#D3CE63', '#77B5FC', '#FFFFFF', '#B3B3B3'];

    var lcAsiaLabels = ['Agriculture', 'Agroforestry', 'Fish pond', 'Grassland / Shrub', 'Mining', 'Oil Palm Plantation', 'Primary Forest', 'Rubber Plantation', 'Secondary Forest', 'Settlements', 'Swamp', 'Timber Plantation', 'Water Bodies'],
        lcAsiaBounds = [1, 13],
        lcAsiaColors = ['#d89827', '#26fc79', '#b1e3fc', '#fdffb6', '#000', '#d89827', '#5fa965', '#eeb368', '#c7ffb6', '#fca0bf', '#538996', '#745b37', '#65a2f8'];

    var lcIndoLabels = ['Agriculture', 'Estate crop plantation', 'Fish pond', 'Grassland / Shrub', 'Mining', 'Primary Forest', 'Secondary Forest', 'Settlements', 'Swamp', 'Timber Plantation', 'Water Bodies'],
        lcIndoBounds = [1, 11],
        lcIndoColors = ['#d89827', '#eeb368', '#b1e3fc', '#fdffb6', '#000', '#5fa965', '#c7ffb6', '#fca0bf', '#538996', '#745b37', '#65a2f8'];

    return {

        corsEnabledServers: [
            'http://gis-gfw.wri.org',
            'http://175.41.139.43',
            'http://54.164.126.73',
            'http://46.137.239.227',
            'https://gfw-fires.wri.org'
        ],

        urls: {
            imageService: 'http://gis-gfw.wri.org/arcgis/rest/services/image_services/analysis/ImageServer'
        },

        messages: {
            largeAreaWarning: 'The area for this analysis request is quite large and may take some time to process.'
        },

        rasterFunctions: {
            range: {
                'rasterFunction': 'histogram16bit',
                'outputPixelType': 'U16',
                'rasterFunctionArguments': {
                    'Rasters': ['$529']
                }
            },
            combination: {
                'rasterFunction': 'Combination',
                'variableName': 'AnalysisRaster',
                'rasterFunctionArguments': {
                    'RasterRange': [1, 140],
                    'Raster2Length': [4],
                    'Raster': {
                        'rasterFunction': 'Combination',
                        'variableName': 'AnalysisRaster',
                        'rasterFunctionArguments': {
                            'RasterRange': [1, 14], // Change these values
                            'Raster2Length': [10], // Change these values
                            'Raster': '$530', // Change these values
                            'Raster2': '$2' // Change these values
                        }
                    },
                    'Raster2': {
                        'rasterFunction': 'Remap',
                        'rasterFunctionArguments': {
                            'InputRanges': [
                                946, 946,
                                947, 947,
                                948, 948,
                                949, 949
                            ],
                            'OutputValues': [1, 2, 3, 4],
                            'Raster': '$529',
                            'AllowUnmatched': false
                        },
                        'variableName': 'Raster'
                    }
                }
            }
        },

        boundariesUrl: boundariesUrl,
        geometryServiceUrl: geometryServiceUrl,
        imageServiceUrl: imageServiceUrl,
        soyCalcUrl: soyCalcUrl,
        clearanceAnalysisUrl: clearanceAnalysisUrl,

        printUrl: 'http://gis-gfw.wri.org/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task/execute',

        alertUrl: {
            forma: 'http://gfw-apis.appspot.com/subscribe',
            fires: 'https://gfw-fires.wri.org/subscribe_by_polygon'
        },

        millPointInfo: {
            'concession': {
                'title': 'Concession Analysis',
                'content': 'A risk assessment for concession areas within a 50km sourcing radius of a palm oil mill.'
            },
            'radius': {
                'title': 'Radius Analysis',
                'content': 'A risk assessment for the entire area within a 50km sourcing radius around a palm oil mill.'
            }
        },

        /*
          Below is all the config items for the Analysis portion of the report
        */

        pixelSize: 100,

        /* Begin Main Layers for Analyses */
        totalLoss: {
            rasterId: '$530',
            bounds: lossBounds,
            labels: lossLabels
        },

        prodesLayer: {
          rasterId: '$555',
          bounds: prodesBounds,
          labels: prodesLabels
        },

        guyraLayer: {
          rasterId: '$565',
          bounds: guyraBounds,
          labels: guyraLabels
        },

        gladLayer: {
          rasterId: '$1', //12
          bounds: gladBounds,
          labels: gladLabels,
          clearanceChart: {
              title: 'Glad Alerts',
              type: 'bar'
          },
          lcHistogram: {
              renderRule: {
                'rasterFunction': 'Local',
                'rasterFunctionArguments': {
                  'Operation': 67, //max value; ignores no data
                  'Rasters': [{
                    'rasterFunction': 'Remap',
                    'rasterFunctionArguments': {
                      'InputRanges': [0, 150, 150, 366],
                      'OutputValues': [0, 1],
                      'Raster': '$1', //2015
                      'AllowUnmatched': false
                    }
                  }, {
                    'rasterFunction': 'Remap',
                    'rasterFunctionArguments': {
                      'InputRanges': [0, 20, 20, 366],
                      'OutputValues': [0, 1],
                      'Raster': '$2', //2016
                      'AllowUnmatched': false
                    }
                  }]
                }
              }
          }
        },

        clearanceAlerts: {
            rasterId: '$17'
            // rasterId: '$2'
        },

        millPoints: {
            url: 'http://api.risk-api.appspot.com/',
            title: 'PALM Risk Tool',
            rootNode: 'millPoints'
        },

        suitability: {
            url: suitabilityUrl,
            title: 'Suitability',
            rootNode: 'suitabilityAnalysis',
            rasterFunction: 'PalmOilSuitability_Histogram',
            geometryType: 'esriGeometryPolygon',
            lcHistogram: {
                renderRule: {
                    rasterFunction: 'lc_histogram',
                    rasterFunctionArguments: {
                        'LCRaster': '$12',
                        'LCInpR': [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8],
                        'LCOutV': [0, 1, 2, 3, 4, 5, 6, 7, 8]
                    }
                },
                renderRuleSuitable: {
                    rasterFunction: 'classify_suitability',
                    rasterFunctionArguments: {
                        'TargetRaster': '$12',
                        'InpTarget': [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8],
                        'OutVTarget': [0, 1, 2, 3, 4, 5, 6, 7, 8]
                    }
                },
                classIndices: {
                    'convertible': [1],
                    'production': [2, 4],
                    'other': [3]
                }
            },
            roadHisto: {
                mosaicRule: {
                    'mosaicMethod': 'esriMosaicLockRaster',
                    'lockRasterIds': [14],
                    'ascending': true,
                    'mosaicOperation': 'MT_FIRST'
                },
                className: 'ROAD_DISTANCE_KM'
            },
            concessions: {
                url: 'http://gis-gfw.wri.org/arcgis/rest/services/CommoditiesAnalyzer/moremaps_EN/MapServer',
                layer: '10'
            },
            localRights: {
                content: 'Local rights/interests:  Unknown.  To be determined through field assessments.',
                fieldAssessmentUrl: fieldAssessmentUrl,
                fieldAssessmentLabel: 'Learn about field assessments.'
            },
            chart: {
                title: 'Suitability by Legal Classification',
                suitable: {
                    color: '#461D7C',
                    name: 'Suitable',
                    id: 'donut-Suitable'
                },
                unsuitable: {
                    color: '#FDD023',
                    name: 'Unsuitable',
                    id: 'donut-Unsuitable'
                },
                childrenLabels: ['HP/HPT', 'HPK', 'APL'],
                childrenColors: ['#74C476', '#E69800', '#FFFFBE']
            }
        },

        // The following is a dependency for all clearance alerts queries, this gets the number of labels and bounds
        // and must be used before any queries for clearanceAlerts will work
        clearanceBounds: {
            url: clearanceAlertsUrl,
            baseYearLabel: 15
        },

        /* End Main Layers for Analyses */

        /* Here are all the other Layers used in the results */
        rspo: {
            rootNode: 'rspoData',
            title: 'RSPO Land Use Change Analysis',
            rasterId: '$5',
            bounds: rspoBounds,
            lossBounds: [5, 13],
            colors: rspoColors
        },

        primaryForest: {
            rootNode: 'primaryForest',
            title: 'Primary Forests - Indonesia',
            rasterId: '$519', //11
            formaId: '$11',
            bounds: primaryForestBounds,
            labels: primaryForestLabels,
            clearanceChart: {
                title: 'Clearance Alerts in Primary Forests since Jan 2015',
                type: 'pie'
            },
            lossChart: {
                title: 'Annual Tree Cover Loss (in hectares) in Primary Forests',
                removeBelowYear: 2005
            },
            compositionAnalysis: {
                rasterId: 519,
                histogramSlice: 1
            },
            colors: primaryForestColors,
            fireKey: 'primaryForest' // Key to the Fires Config for items related to this
        },

        treeCover: {
            rootNode: 'treeCoverDensity',
            title: 'Tree Cover Density',
            rasterId: '$520', //13
            formaId: '$12',
            includeFormaIdInRemap: true,
            rasterRemap: {
                'rasterFunction': 'Remap',
                'rasterFunctionArguments': {
                    'InputRanges': [31, 51, 51, 75, 75, 101],
                    'OutputValues': [1, 2, 3],
                    'Raster': '$520',
                    'AllowUnmatched': false
                }
            },
            bounds: treeCoverBounds,
            labels: treeCoverLabels,
            clearanceChart: {
                title: 'Clearance Alerts on Tree Cover Density since Jan 2015',
                type: 'pie'
            },
            lossChart: {
                title: 'Annual Tree Cover Loss (in hectares) on Tree Cover Density'
            },
            compositionAnalysis: {
                title: 'Tree Cover Density (30%-100%)',
                rasterId: 520,
                histogramSlice: 31
            },
            colors: treeCoverColors,
            fireKey: 'treeCover', // Key to the Fires Config for items related to this
            errors: {
                composition: 'No Tree Cover Density greater than 30% detected in this area.'
            }
        },

        // plantationsTypeLayer: {
        //     rootNode: 'plantationsTypeLayer',
        //     title: 'Plantations by Type',
        //     rasterId: '$558',
        //     formaId: '$12',
        //     includeFormaIdInRemap: true,
        //     rasterRemap: {
        //         'rasterFunction': 'Remap',
        //         'rasterFunctionArguments': {
        //             'InputRanges': [31, 51, 51, 75, 75, 101],
        //             'OutputValues': [1, 2, 3],
        //             'Raster': '$558',
        //             'AllowUnmatched': false
        //         }
        //     },
        //     bounds: plantationsTypeBounds,
        //     labels: plantationsTypeLabels,
        //     clearanceChart: {
        //         title: 'plantationsTypesince Jan 2015',
        //         type: 'pie'
        //     },
        //     lossChart: {
        //         title: 'plantation sTypeeee'
        //     },
        //     compositionAnalysis: {
        //         title: 'plantations Typeee',
        //         rasterId: 558//,
        //         // histogramSlice: 31
        //     },
        //     colors: plantationsTypeColors,
        //     fireKey: 'plantationsType', // Key to the Fires Config for items related to this
        //     errors: {
        //         composition: 'NplantationsTypeBoundsn 30% detected in this area.'
        //     }
        // },
        //
        // plantationsSpeciesLayer: {
        //     rootNode: 'plantationsSpeciesLayer',
        //     title: 'Plantations by Species',
        //     rasterId: '$559',
        //     formaId: '$12',
        //     includeFormaIdInRemap: true,
        //     rasterRemap: {
        //         'rasterFunction': 'Remap',
        //         'rasterFunctionArguments': {
        //             'InputRanges': [31, 51, 51, 75, 75, 101],
        //             'OutputValues': [1, 2, 3],
        //             'Raster': '$559',
        //             'AllowUnmatched': false
        //         }
        //     },
        //     bounds: plantationsTypeBounds,
        //     labels: plantationsTypeLabels,
        //     clearanceChart: {
        //         title: 'plantationsTypesince Jan 2015',
        //         type: 'pie'
        //     },
        //     lossChart: {
        //         title: 'plantation speciess'
        //     },
        //     compositionAnalysis: {
        //         title: 'plantations Typeee',
        //         rasterId: 559//,
        //         // histogramSlice: 31
        //     },
        //     colors: plantationsTypeColors,
        //     fireKey: 'plantationsType', // Key to the Fires Config for items related to this
        //     errors: {
        //         composition: 'No Tree Cover Density greater than 30% detected in this area.'
        //     }
        // },

        treeCoverLoss: {
            rootNode: 'treeCoverLoss',
            title: 'Tree Cover Loss',
            rasterId: '$517',
            // mosaicRule: {
            //     'mosaicMethod': 'esriMosaicLockRaster',
            //     'lockRasterIds': [530],
            //     'ascending': true,
            //     'mosaicOperation': 'MT_FIRST'
            // },
            renderingRule: {
              rasterFunction: 'Arithmetic',
              rasterFunctionArguments: {
                Raster: {
                    rasterFunction: 'Remap',
                    rasterFunctionArguments: {
                        InputRanges: [0, 30, 30, 101],
                        OutputValues: [0, 1],
                        Raster: '$520',
                        AllowUnmatched: false
                    }
                },
                Raster2: '$530',
                Operation: 3
            }
          },
            lossChart: {
                title: 'Annual Tree Cover Loss (in hectares)'
            },
            compositionAnalysis: {
                rasterId: 530,
                histogramSlice: 1
            },
            bounds: treeCoverBounds,
            color: '#DB6598',
            labels: []
        },

        legalClass: {
            rootNode: 'legalClasses',
            title: 'Legal Classifications',
            rasterId: '$7',
            bounds: legalClassBounds,
            labels: legalClassLabels,
            clearanceChart: {
                title: 'Clearance Alerts on Legal Classifications since Jan 2015',
                type: 'pie'
            },
            lossChart: {
                title: 'Annual Tree Cover Loss (in hectares) on Legal Classifications',
                removeBelowYear: 2005
            },
            colors: legalClassColors,
            fireKey: 'legalClass' // Key to the Fires Config for items related to this
        },

        indonesiaMoratorium: {
            rootNode: 'indoMoratorium',
            title: 'Indonesia Moratorium',
            rasterId: '$522',
            formaId: '$14',
            bounds: moratoriumBounds,
            labels: moratoriumLabels,
            clearanceChart: {
                title: 'Clearance alerts on Moratorium Areas since Jan 2015',
                type: 'bar'
            },
            lossChart: {
                title: 'Annual Tree Cover Loss (in hectares) on Indonesia Moratorium',
                removeBelowYear: 2011
            },
            colors: moratoriumColors,
            fireKey: 'indonesiaMoratorium',
            compositionAnalysis: {
                rasterId: 522,
                histogramSlice: 1
            }
        },

        prodes: {
            rootNode: 'prodes',
            title: 'Prodes Deforestation',
            rasterId: '$555',
            // formaId: '$14',
            bounds: prodesBounds,
            labels: prodesLabels,
            mosaicRule: {
                'mosaicMethod': 'esriMosaicLockRaster',
                'lockRasterIds': [555],
                'ascending': true,
                'mosaicOperation': 'MT_FIRST'
            },
            clearanceChart: {
                title: 'PRODES',
                type: 'bar'
            },
            lossChart: {
                title: 'PRODES'//,
                //removeBelowYear: 2001
            },
            colors: prodesColors,
            fireKey: 'prodes',
            compositionAnalysis: {
                rasterId: 555,
                histogramSlice: 1
            }
        },

        guyra: {
            rootNode: 'guyra',
            title: 'Gran Chaco deforestation (Asociación Guyra Paraguay)',
            rasterId: '$565',
            mosaicRule: {
                'mosaicMethod': 'esriMosaicLockRaster',
                'lockRasterIds': [565],
                'ascending': true,
                'mosaicOperation': 'MT_FIRST'
            },
            lossChart: {
                title: 'Guyra Loss (in hectares)'
            },
            fireKey: 'guyra',
            compositionAnalysis: {
                rasterId: 565,
                histogramSlice: 1
            },
            bounds: guyraBounds,
            color: '#DB6598',
            labels: guyraLabels
        },

        glad: {
            rootNode: 'glad',
            title: 'GLAD Alerts',
            rasterId: ['$6', '$4', '$9'],
            url: gladUrl,
            confidentUrl: gladUrlConfidence,
            bounds: gladBounds,
            labels: gladLabels,
            mosaicRule: {
                'mosaicMethod': 'esriMosaicLockRaster',
                'lockRasterIds': [6],
                'ascending': true,
                'mosaicOperation': 'MT_FIRST'
            },

            colors: gladColors,
            fireKey: 'glad' // Key to the Fires Config for items related to this
        },

        protectedArea: {
            rootNode: 'protectedAreas',
            title: 'Protected Areas',
            rasterId: '$10',
            bounds: protectedAreaBounds,
            labels: protectedAreaLabels,
            clearanceChart: {
                title: 'Clearance Alerts on Protected Areas since Jan 2015',
                type: 'bar'
            },
            lossChart: {
                title: 'Annual Tree Cover Loss (in hectares) on Protected Areas'
            },
            compositionAnalysis: {
                rasterId: 10,
                histogramSlice: 1
            },
            colors: protectedAreaColors,
            fireKey: 'protectedArea', // Key to the Fires Config for items related to this
            errors: {
                composition: 'No protected areas detected in this area.'
            }
        },

        carbonStock: {
            rootNode: 'carbonStocks',
            title: 'Aboveground Biomass Density',
            rasterId: '$560', //'$524',
            bounds: carbonStockBounds,
            labels: carbonStockLabels,
            clearanceChart: {
                title: 'Clearance Alerts on Aboveground Biomass Density since Jan 2015',
                type: 'pie'
            },
            lossChart: {
                title: 'Annual Tree Cover Loss (in hectares) on Aboveground Biomass Density (Mg C /Ha)'//,
                // removeBelowYear: 2005
            },
            includeFormaIdInRemap: true,
            formaId: '$28', //'$15',
            rasterRemap: {
                'rasterFunction': 'Remap',
                'rasterFunctionArguments': {
                    'InputRanges': [0, 101, 101, 201, 201, 301, 301, 401, 401, 501, 501, 1000], //[1, 20, 20, 80, 80, 370],
                    'OutputValues': [1, 2, 3, 4, 5, 6],
                    'Raster': '$560',
                    'AllowUnmatched': false
                },
                'outputPixelType': 'U8'
            },
            colors: carbonStockColors,
            fireKey: 'carbonStock' // Key to the Fires Config for items related to this
        },

        plantationsTypeLayer: {
            rootNode: 'plantationsTypeLayer',
            title: 'Plantations by Type',
            rasterId: '$558',
            bounds: plantationsTypeBounds,
            labels: plantationsTypeLabels,
            clearanceChart: {
                title: 'Plantations by Type',
                type: 'pie'
            },
            lossChart: {
                title: 'Plantations by Type'
            },
            // includeFormaIdInRemap: false,
            // formaId: '$15',
            colors: plantationsTypeColors,
            fireKey: 'plantationsType' // Key to the Fires Config for items related to this
        },

        plantationsSpeciesLayer: {
            rootNode: 'plantationsSpeciesLayer',
            title: 'Plantations by Species',
            rasterId: '$559',
            bounds: plantationsSpeciesBounds,
            labels: plantationsSpeciesLabels,
            clearanceChart: {
                title: 'Plantations by Species',
                type: 'pie'
            },
            lossChart: {
                title: 'Plantations by Species'
            },
            // includeFormaIdInRemap: false,
            // formaId: '$15',
            // rasterRemap: {
            //     'rasterFunction': 'Remap',
            //     'rasterFunctionArguments': { //todo: this, correctly
            //         // 'InputRanges': [1, 20, 20, 80, 80, 370],
            //         // 'OutputValues': [0, 1, 2],
            //         'InputRanges': [13, 13, 2, 2, 8, 8, 1, 1, 4, 4, 5, 5],
            //         'OutputValues': [1, 2, 3, 4, 5, 6],
            //         'Raster': '$559',
            //         'AllowUnmatched': false
            //     }
            // },
            colors: plantationsSpeciesColors,
            fireKey: 'plantationsSpecies' // Key to the Fires Config for items related to this
        },

        brazilBiomes: {
            rootNode: 'brazilBiomes',
            title: 'Brazil Biomes',
            rasterId: '$531',
            bounds: brazilBiomesBounds,
            labels: brazilBiomesLabels,
            clearanceChart: {
                title: 'Clearance Alerts on Brazil Biomes since Jan 2015',
                type: 'pie'
            },
            lossChart: {
                title: 'Annual Tree Cover Loss (in hectares) on Brazil Biomes (Mg C /Ha)',
                removeBelowYear: 2004
            },
            // includeFormaIdInRemap: true,
            formaId: '$21',
            colors: brazilBiomesColors,
            fireKey: 'brazilBiomes' // Key to the Fires Config for items related to this
        },

        intactForest: {
            rootNode: 'intactForestLandscape',
            title: 'Intact Forest Landscapes',
            rasterId: '$9',
            bounds: intactForestBounds,
            labels: intactForestLabels,
            clearanceChart: {
                title: 'Clearance Alerts on Intact Forest Landscapes since Jan 2015',
                type: 'bar'
            },
            lossChart: {
                title: 'Annual Tree Cover Loss (in hectares) on Intact Forest Landscapes'
            },
            colors: intactForestColors,
            fireKey: 'intactForest', // Key to the Fires Config for items related to this
            errors: {
                composition: 'No intact forest landscapes data available in this area.'
            }
        },

        peatLands: {
            rootNode: 'peatLands',
            title: 'Peat Lands',
            rasterId: '$8',
            bounds: peatLandsBounds,
            labels: peatLandsLabels,
            clearanceChart: {
                title: 'Clearance Alerts on Peat Lands since Jan 2015',
                type: 'bar'
            },
            lossChart: {
                title: 'Annual Tree Cover Loss (in hectares) on Peat Lands',
                removeBelowYear: 2002
            },
            compositionAnalysis: {
                rasterId: 8,
                histogramSlice: 1
            },
            colors: peatLandsColors,
            fireKey: 'peatLands', // Key to the Fires Config for items related to this
            errors: {
                composition: 'No peat land detected in this area according to indonesia peat data.'
            }
        },

        soy: {
            rootNode: 'soy',
            title: 'Soy on Tree Cover Loss',
            rasterId: '$566',
            bounds: soyBounds,
            labels: soyLabels,
            clearanceChart: {
                title: 'Clearance Alerts on Soy Lands since Jan 2015',
                type: 'bar'
            },

            // renderingRule: { //todo: use this if we dont want tree cover density in our soy % equation!
            //     "rasterFunction": "Arithmetic",
            //     "rasterFunctionArguments": {
            //         "Raster": "$530",
            //         "Raster2": "$566",
            //         "Operation": 3
            //     }
            // }

            renderingRule: {
              rasterFunction: 'Arithmetic',
              rasterFunctionArguments: {
                Operation: 3,
                Raster: {
                    rasterFunction: 'Remap',
                    rasterFunctionArguments: {
                        InputRanges: [0, 30, 30, 101],
                        OutputValues: [0, 1],
                        Raster: '$520',
                        AllowUnmatched: false
                    }
                },
                Raster2: {
                    rasterFunction: 'Arithmetic',
                    rasterFunctionArguments: {
                        Raster: '$530',
                        Raster2: '$566',
                        Operation: 3
                    },
                    outputPixelType: 'U8'
                }
            }
          },

            lossChart: {
                title: '2013-2014 Cerrado Soy (in hectares) on <br>2001–2013 Annual Tree Cover Loss',
                removeBelowYear: 2002
            },
            compositionAnalysis: {
                rasterId: 566,
                histogramSlice: 1
            },
            colors: soyColors,
            fireKey: 'soy', // Key to the Fires Config for items related to this
            errors: {
                composition: 'No Soy on Tree Cover Loss detected in this area.'
            }
        },

        landCoverGlobal: {
            rootNode: 'globalLandCover',
            title: 'Land Cover - Global',
            rasterId: '$544', //'$525',
            bounds: lcGlobalBounds,
            labels: lcGlobalLabels,
            clearanceChart: {
                title: 'Clearance Alerts on Land Cover - Global since Jan 2015',
                type: 'pie'
            },
            lossChart: {
                title: 'Annual Tree Cover Loss (in hectares) on Land Cover - Global',
                removeBelowYear: 2004
            },
            // includeFormaIdInRemap: true,
            formaId: '$22',
            colors: lcGlobalColors,
            fireKey: 'landCoverGlobal' // Key to the Fires Config for items related to this
        },
        landCoverAsia: {
            rootNode: 'asiaLandCover',
            title: 'Land Cover - Southeast Asia',
            rasterId: '$4',
            bounds: lcAsiaBounds,
            labels: lcAsiaLabels,
            clearanceChart: {
                title: 'Clearance Alerts on Land Cover - Southeast Asia since Jan 2015',
                type: 'pie'
            },
            lossChart: {
                title: 'Annual Tree Cover Loss (in hectares) on Land Cover - Southeast Asia',
                removeBelowYear: 2005
            },
            colors: lcAsiaColors,
            fireKey: 'landCoverAsia' // Key to the Fires Config for items related to this
        },
        landCoverIndo: {
            rootNode: 'indoLandCover',
            title: 'Land Cover - Indonesia',
            rasterId: '$6',
            bounds: lcIndoBounds,
            labels: lcIndoLabels,
            clearanceChart: {
                title: 'Clearance Alerts on Land Cover - Indonesia since Jan 2015',
                type: 'pie'
            },
            lossChart: {
                title: 'Annual Tree Cover Loss (in hectares) on Land Cover - Indonesia',
                removeBelowYear: 2006
            },
            colors: lcIndoColors,
            fireKey: 'landCoverIndo' // Key to the Fires Config for items related to this
        },


        // If the bounds for the fire queries are different from the bounds on the clearance and loss
        // analysis, specify them below, otherwise, use the same variable as the analysis above
        fires: {
            url: firesQueryUrl,
            primaryForest: {
                type: 'pie',
                field: 'primary_fo',
                labels: primaryForestLabels,
                bounds: primaryForestBounds,
                colors: primaryForestColors,
                title: 'Active Fires in Primary Forests over the past 7 days',
                badgeDesc: 'in primary forests out of'
            },
            treeCover: {
                type: 'pie',
                field: 'treecover',
                labels: treeCoverLabels,
                bounds: [1, 5], // These are different from the bounds used in loss and clearance analysis
                colors: treeCoverColors,
                title: 'Active Fires by Tree Cover Density over the past 7 days',
                badgeDesc: 'on tree cover density out of'
            },
            legalClass: {
                type: 'pie',
                field: 'legal',
                labels: legalClassLabels,
                bounds: legalClassBounds,
                colors: legalClassColors,
                title: 'Active Fires by Legal Classifications over the past 7 days',
                badgeDesc: 'on legal classes out of'
            },
            carbonStock: {
                type: 'pie',
                field: 'carbon',
                labels: carbonStockLabels,
                bounds: carbonStockBounds,
                colors: carbonStockColors,

                title: 'Active Fires by Aboveground Biomass Density over the past 7 days',
                badgeDesc: 'on Aboveground Biomass Density out of'
            },
            plantationsTypeLayer: {
                type: 'pie',
                field: 'plantationsType',
                labels: plantationsTypeLabels,
                bounds: plantationsTypeBounds,
                colors: plantationsTypeColors,
                title: 'Active Fires by Plantations (by Type) over the past 7 days',
                badgeDesc: 'on fires by plantation out of'
            },
            plantationsSpeciesLayer: {
                type: 'pie',
                field: 'plantationsSpecies',
                labels: plantationsSpeciesLabels,
                bounds: plantationsSpeciesBounds,
                colors: plantationsSpeciesColors,
                title: 'Active Fires by Plantations (by Species) over the past 7 days',
                badgeDesc: 'on fires by plantation out of'
            },
            brazilBiomes: {
                type: 'pie',
                field: 'biomes',
                labels: brazilBiomesLabels,
                bounds: brazilBiomesBounds,
                colors: brazilBiomesColors,

                title: 'Active Fires by Brazilian Biomes over the past 7 days',
                badgeDesc: 'on Brazilian Biomes out of'
            },
            protectedArea: {
                type: 'badge',
                field: 'wdpa',
                badgeDesc: 'in protected areas out of'
            },
            intactForest: {
                type: 'badge',
                field: 'ifl',
                badgeDesc: 'on intact forest landscapes out of'
            },
            peatLands: {
                type: 'badge',
                field: 'soy',
                badgeDesc: 'on soy lands out of'
            },
            soy: {
                type: 'badge',
                field: 'peat',
                badgeDesc: 'on peat lands out of'
            },
            landCoverGlobal: {
                type: 'pie',
                field: 'lc_global',
                labels: lcGlobalLabels,
                bounds: lcGlobalBounds,
                colors: lcGlobalColors,
                title: 'Active Fires by Land Cover - Global over the past 7 days',
                badgeDesc: 'on land cover global out of'
            },
            landCoverAsia: {
                type: 'pie',
                field: 'lc_seasia',
                labels: lcAsiaLabels,
                bounds: lcAsiaBounds,
                colors: lcAsiaColors,
                title: 'Active Fires by Land Cover - Southeast Asia over the past 7 days',
                badgeDesc: 'on land cover southeast asia out of'
            },
            landCoverIndo: {
                type: 'pie',
                field: 'lc_ind',
                labels: lcIndoLabels,
                bounds: lcIndoBounds,
                colors: lcIndoColors,
                title: 'Active Fires by Land Cover - Indonesia over the past 7 days',
                badgeDesc: 'on land cover indonesia out of'
            },
            indonesiaMoratorium: {
                type: 'badge',
                field: 'moratorium',
                badgeDesc: 'on indonesia moratorium out of'
            },
            prodes: {
                type: 'badge',
                field: 'prodes',
                badgeDesc: 'on Prodes out of'
            },
            plantationsType: {
                type: 'badge',
                field: 'plantationsType',
                badgeDesc: 'on Plantations Type out of'
            },
            plantationsSpecies: {
                type: 'badge',
                field: 'plantationsSpecies',
                badgeDesc: 'on Plantations Species out of'
            }
        },

        /**
        * This contains an array of labels and keys, these are in the order the columns should appear
        * If the API response format changes, the keys here must be updated
        */
        millCSVDescriptor: [
          // General categories
          { label: 'Mill Name', info: {
            path: 'mill_name'
          }},
          { label: 'latitude', info: {
            path: 'latitude'
          }},
          { label: 'longitude', info: {
            path: 'longitude'
          }},
          { label: 'priority_risk', info: {
            path: 'priority_level'
          }},
          { label: 'total_historic_risk', info: {
            path: 'historic_loss'
          }},
          { label: 'total_future_risk', info: {
            path: 'future_risk'
          }},
          // Combined values
          { label: 'combined_tree_loss_risk', info: {
            path: 'tree_cover.risk'
          }},
          { label: 'combined_primary_forest_risk', info: {
            path: 'primary_forest.risk'
          }},
          { label: 'combined_peat_risk', info: {
            path: 'peat.risk'
          }},
          { label: 'combined_protected_risk', info: {
            path: 'protected_areas.risk'
          }},
          { label: 'combined_carbon_dense_area_risk', info: {
            path: 'carbon.risk'
          }},
          { label: 'combined_fires_risk', info: {
            path: 'fire.risk'
          }},
          // Historic data
          { label: 'historic_tree_loss_risk', info: {
            path: 'tree_cover.loss.rank'
          }},
          { label: 'historic_tree_loss_value (ha/year)', info: {
            path: 'tree_cover.loss.amount',
            precision: 0
          }},
          { label: 'historic_primary_forest_risk', info: {
            path: 'primary_forest.loss.rank'
          }},
          { label: 'historic_primary_forest_value (ha)', info: {
            path: 'primary_forest.loss.amount',
            precision: 0
          }},
          { label: 'historic_peat_risk', info: {
            path: 'peat.loss.rank'
          }},
          { label: 'historic_peat_value (ha)', info: {
            path: 'peat.loss.amount',
            precision: 0
          }},
          { label: 'historic_protected_risk', info: {
            path: 'protected_areas.loss.rank'
          }},
          { label: 'historic_protected_value (ha)', info: {
            path: 'protected_areas.loss.amount',
            precision: 0
          }},
          { label: 'historic_carbon_dense_area_risk', info: {
            path: 'carbon.loss.rank'
          }},
          { label: 'historic_carbon_dense_area_value (ha)', info: {
            path: 'carbon.loss.amount',
            precision: 0
          }},
          { label: 'historic_fires_risk', info: {
            path: 'fire.loss.rank'
          }},
          { label: 'historic_fires_value (fires/ha/year)', info: {
            path: 'fire.loss.amount',
            precision: 5
          }},
          // Future data
          { label: 'future_tree_loss_risk', info: {
            path: 'tree_cover.extent.rank'
          }},
          { label: 'future_tree_loss_value (ha/year)', info: {
            path: 'tree_cover.extent.amount',
            precision: 0
          }},
          { label: 'future_primary_forest_risk', info: {
            path: 'primary_forest.extent.rank'
          }},
          { label: 'future_primary_forest_value (%)', info: {
            path: 'primary_forest.extent.amount',
            precision: 0
          }},
          { label: 'future_peat_risk', info: {
            path: 'peat.extent.rank'
          }},
          { label: 'future_peat_value (%)', info: {
            path: 'peat.extent.amount',
            precision: 0
          }},
          { label: 'future_protected_risk', info: {
            path: 'protected_areas.extent.rank'
          }},
          { label: 'future_protected_value (%)', info: {
            path: 'protected_areas.extent.amount',
            precision: 0
          }},
          { label: 'future_carbon_dense_area_risk', info: {
            path: 'carbon.extent.rank'
          }},
          { label: 'future_high_carbon_value (%)', info: {
            path: 'carbon.extent.amount',
            precision: 0
          }},
          { label: 'future_fires_risk', info: {
            path: 'fire.extent.rank'
          }},
          { label: 'future_fires_value (fires/ha/year)', info: {
            path: 'fire.extent.amount',
            precision: 5
          }}
        ]

    };

});

define('report/CSVExporter',[
	'dojo/number',
	'dojo/_base/array'
], function (number, arrayUtils) {

	/**
	* Take some data and encode it into base64 format, see comments in function
	*/
	function encodeToBase64 (data) {
		//  discuss at: http://phpjs.org/functions/base64_encode/
		//  original by: Tyler Akins (http://rumkin.com)
		//  improved by: Bayron Guevara
		//  improved by: Thunder.m
		//  improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
		//  improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
		//  improved by: Rafał Kukawski (http://kukawski.pl)
		//  bugfixed by: Pellentesque Malesuada
		//   example 1: base64_encode('Kevin van Zonneveld');
		//   returns 1: 'S2V2aW4gdmFuIFpvbm5ldmVsZA=='
		//   example 2: base64_encode('a');
		//   returns 2: 'YQ=='
		var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
		var o1, o2, o3, h1, h2, h3, h4, bits,
				i = 0,
				ac = 0,
				enc = '',
				tmp_arr = [];

		if (!data) {
			return data;
		}

		do {
			// Pack three octets into four hexets
			o1 = data.charCodeAt(i++);
			o2 = data.charCodeAt(i++);
			o3 = data.charCodeAt(i++);

			bits = o1 << 16 | o2 << 8 | o3;

			h1 = bits >> 18 & 0x3f;
			h2 = bits >> 12 & 0x3f;
			h3 = bits >> 6 & 0x3f;
			h4 = bits & 0x3f;

			// Use hexets to index into b64 and append result to encoded string
			tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);

		} while (i < data.length);

		enc = tmp_arr.join('');

		var r = data.length % 3;

		return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);

	}

	/**
	* Take some base64 data and encode it into blob friendly format, this is needed to export the csv in the proper
	* format so Excel can read it correctly
	*/
	function base64ToBlob (base64Data, contentType) {
		// Taken From: http://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
		contentType = contentType || '';
		var sliceSize = 1024;
		var byteCharacters = atob(base64Data);
		var bytesLength = byteCharacters.length;
		var slicesCount = Math.ceil(bytesLength / sliceSize);
		var byteArrays = new Array(slicesCount);

		for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {

			var begin = sliceIndex * sliceSize;
			var end = Math.min(begin + sliceSize, bytesLength);

			var bytes = new Array(end - begin);
			var i = 0;

			for (var offset = begin; offset < end; ++i, ++offset) {
				bytes[i] = byteCharacters[offset].charCodeAt(0);
			}

			byteArrays[sliceIndex] = new Uint8Array(bytes);

		}

		return new Blob(byteArrays, { type: contentType });

	}

	/**
	* @param {object} chart - Takes a HighChart chart object
	* @return {array} - array of csv ready string data, each entry in the array represents one line in the csv export
	*/
	function exportCompositionAnalysis (chart) {
		var series = chart.series,
				csvData = [],
				values = [];
		// Create the headers first
    arrayUtils.forEach(series[0].data, function (dataObject) {
        values.push(dataObject.category);
    });
    // Push in those values with Suitability as the first Value
    csvData.push('Suitability,' + values.join(','));
    // Now push the data from the individual series in
    arrayUtils.forEach(series, function (serie) {
        values = [];
        values.push(serie.name);
        arrayUtils.forEach(serie.data, function (dataObject) {
            values.push(Math.abs(dataObject.y.toFixed(2)));
        });
        csvData.push(values.join(','));
    });

    return csvData;
	}

	/**
	* This works for bar charts, line charts, and column charts whose categories are on the xAxis
	* NOTE: Highcharts sometimes rotates charts so it may look like the yAxis but look where the data starts
	* @param {object} chart - Takes a HighChart chart object
	* @return {array} - array of csv ready string data, each entry in the array represents one line in the csv export
	*/
	function exportSimpleChartAnalysis (chart) {
		var series = chart.series,
				csvData = [],
				values = [],
				categories;

		categories = chart.xAxis[0].categories;
    // Push in the header categories
    arrayUtils.forEach(categories, function (category) {
        values.push(category);
    });
    // Add Name Catgory for First value and then join the headers
    csvData.push('Type,' + values.join(','));
    // Start creating a row for each series
    arrayUtils.forEach(series, function (serie) {
        values = [];
        values.push(serie.name);
        arrayUtils.forEach(serie.data, function (dataObject) {
            values.push(dataObject.y);
        });
        csvData.push(values.join(','));
    });

    return csvData;
	}

	function exportAlternateChartAnalysis (chart) {
		var series = chart.series,
				csvData = [],
				values = [],
				lineEndings = '\r\n',
				output;

		csvData = ['Custom Feature #1 - Glad Alerts', 'Day,Glad Alerts'];

		series[0].processedXData.forEach(function(date, index) {
			const d = new Date(date);
			var datestring = (d.getMonth() + 1) + '-' + d.getDate() + '-' + d.getFullYear();
			values.push(datestring);
			values.push(series[0].processedYData[index]);
			csvData.push(values.join(','));
			values = [];
		});

		output = csvData.join(lineEndings);
		return output;

	}

	/**
	* @param {object} chart - Takes a HighChart chart object
	* @return {array} - array of csv ready string data, each entry in the array represents one line in the csv export
	*/
	function exportSuitabilityByLegalClass (chart) {
		var unsuitable = ['Unsuitable'],
				suitable = ['Suitable'],
				series = chart.series,
				hptUnsuit = 0,
        hpkUnsuit = 0,
        aplUnsuit = 0,
        hptSuit = 0,
        hpkSuit = 0,
        aplSuit = 0,
				csvData = [],
				values = [],
				serie;

		// Push in the categories first
    csvData.push('Suitability,Total,HP/HPT,HPK,APL');
    // Handle Totals first
    serie = series[0];
    // There should only be two values here, if the ordering changes, function
    // will need to be updated to account for the serie being the the legal area data instead
    arrayUtils.forEach(serie.data, function (dataObject) {
        if (dataObject.name === 'Suitable') {
            suitable.push(dataObject.y);
        } else {
            unsuitable.push(dataObject.y);
        }
    });
    // Now Push in the Legal Areas
    serie = series[1];
    arrayUtils.forEach(serie.data, function (dataObject) {
        switch (dataObject.name) {
            case "HP/HPT":
                if (dataObject.parentId === "donut-Suitable") {
                    hptSuit = dataObject.y || 0;
                } else {
                    hptUnsuit = dataObject.y || 0;
                }
            break;
            case "APL":
                if (dataObject.parentId === "donut-Suitable") {
                    aplSuit = dataObject.y || 0;
                } else {
                    aplUnsuit = dataObject.y || 0;
                }
            break;
            case "HPK":
                if (dataObject.parentId === "donut-Suitable") {
                    hpkSuit = dataObject.y || 0;
                } else {
                    hpkUnsuit = dataObject.y || 0;
                }
            break;
        }
    });
    // Push these values into the appropriate array in the correct order
    suitable = suitable.concat([hptSuit, hpkSuit, aplSuit]);
    unsuitable = unsuitable.concat([hptUnsuit, hpkUnsuit, aplUnsuit]);
    // Push these arrays into the content array
    csvData.push(suitable.join(','));
    csvData.push(unsuitable.join(','));

    return csvData;
	}

	/**
	* Very Specific for parsing data from a table
	* @return {array} - array of csv ready string data, each entry in the array represents one line in the csv export
	*/
	function exportSuitabilityStatistics () {
		var featureTitle = document.getElementById('title').innerHTML,
				rows = $("#suitabilityAnalysis_content tr"),
				csvData = [],
				temp;

		// Push in Type of Output, Feature Title, and Headers
		csvData.push('Suitability Statistics');
		csvData.push(featureTitle);
		csvData.push('Parameter, Value');

		arrayUtils.forEach(rows, function (row) {
			temp = row.cells[1].innerHTML.replace(',','');
			csvData.push(row.cells[0].innerHTML + ',' + temp);
		});

		return csvData;

	}

	/**
	* Takes Mill API Results and formats them into a CSV file
	* @param {object[]} mills - Array of mills from the response
	* @param {object[]} descriptors - Array of labels and infos
	* @param {string} - descriptors[n].label - Column header to be used in CSV output
	* @param {object} - descriptors[n].info - Info object containing info for parsing and formatting
	* @param {string} - descriptors[n].info.path - Path to data, e.g 'fire.risk' finds value in - { fire: { risk: 'value' }}
	* @param {number} - descriptors[n].info.precision - Precision for formatting the number
	* @return {string} results - Array of strings, each string represents one line in the CSV file
	*/
	function prepareMillAnalysis (mills, descriptors) {
		var lineEnding = '\r\n',
				unavailable = 'N/A',
				results = [],
				row;

		// Helper function to parse object at path, 12 = getValueForPath('a.b', {a: { b: 12}});
		// Info should have path and optionally a precision value
		// precision means data is expected to be a number and tells how many places it should round to
		function formatValueAtPath (info, item) {
			var keys = info.path.split('.');
			var result = keys.every(function (key) {
				if (item[key] !== undefined) {
					item = item[key];
					return true;
				}
			});
			// Format value here if necessary, check precision against undefined as precision can be 0 which is falsy
			return result ? (
				info.precision !== undefined ? number.round(item, info.precision) : item
			) : unavailable;
		}
		// Create the column headings by pushing in the labels to results
		row = descriptors.map(function (descriptor) { return descriptor.label; });
		// Push the row in to the results after each operation
		results.push(row.join(','));
		// Now grab the values
		mills.forEach(function (mill) {
			row = descriptors.map(function (descriptor) { return formatValueAtPath(descriptor.info, mill); });
			results.push(row.join(','));
		});
		return results.join(lineEnding);
	}

	var Exporter = {

		exportCSV: function (exportData) {

			var hrefType = 'data:application/vnd.ms-excel;base64,',
					blobType = 'text/csv;charset=utf-8',
					filename = 'data.csv',
					link = document.createElement('a'),
					blob;

			// If FileSaver loaded successfully and Blob's are supported
			if (saveAs && !!new Blob) {

				blob = base64ToBlob(encodeToBase64(exportData), blobType);
				saveAs(blob, filename);

			} else if (link.download === '') {

				link.href = hrefType + encodeToBase64(exportData);
				link.target = '_blank';
				link.download = filename;
				link.click();

			} else {

				window.open(hrefType + encodeToBase64(exportData));

			}

		},

		// Export Helper Functions
		exportSuitabilityByLegalClass: exportSuitabilityByLegalClass,
		exportSuitabilityStatistics: exportSuitabilityStatistics,
		exportCompositionAnalysis: exportCompositionAnalysis,
		exportSimpleChartAnalysis: exportSimpleChartAnalysis,
		exportAlternateChartAnalysis: exportAlternateChartAnalysis,
		prepareMillAnalysis: prepareMillAnalysis

	};

	return Exporter;

});

define('report/Renderer',[
  "report/config",
  "dojo/number",
  "dijit/Dialog",
  "dojo/_base/array",
  "dojo/on",
  "dojo/dom",
  "dojo/dom-style",
  "report/CSVExporter",
  "esri/geometry/geometryEngine",
  "utils/Analytics"
], function (ReportConfig, number, Dialog, arrayUtils, on, dom, domStyle, CSVExporter, geometryEngine, Analytics) {
  'use strict';

  // Container IDS for charts and tables are as Follows
  // config.rootNode + '_loss'
  // config.rootNode + '_clearance'
  // config.rootNode + '_fire'
  // config.rootNode + '_mill'
  // Suitability Analysis
  // config.rootNode + '_content'
  // config.rootNode + '_chart'

  var exportButtonImagePath = 'url(./app/css/images/download-icon.svg)';

  return {

    /*
      @param {object} config
    */
    renderContainers: function (config) {
      var fragment = document.createDocumentFragment(),
          node = document.createElement('div'),
          map = document.getElementById('print-map');

      node.id = config.rootNode;
      node.className = "result-container";
      node.innerHTML = "<div class='title'>" + config.title + "</div>" +
          "<div class='result-block total-loss'>" +
            "<div class='top-panel' id='" + config.rootNode + "_composition'></div>" +
            "<div class='left-panel'>" +
              "<div class='loss-chart' id='" + config.rootNode + "_loss'><div class='loader-wheel'>total loss</div></div>" +
            "</div>" +
            "<div class='right-panel'>" +
              "<div class='fires-chart' id='" + config.rootNode + "_fire'><div class='loader-wheel'>active fires</div></div>" +
            "</div>" +
          "</div>" +
          "<div class='result-block clearance-alerts'>" +
            "<div class='clearance-chart' id='" + config.rootNode + "_clearance'><div class='loader-wheel'>clearance alerts</div></div>" +
          "</div>" +
          "<div class='result-block mill-points'>" +
            "<div class='mill-table' id='" + config.rootNode + "_mill'></div>" +
          "</div>";

      // Append root to fragment and then fragment to document
      fragment.appendChild(node);
      document.getElementById('report-results-section').insertBefore(fragment, map);
    },

    /*
      @param {object} config
    */
    renderTotalLossContainer: function (config) {
      var fragment = document.createDocumentFragment(),
          node = document.createElement('div'),
          map = document.getElementById('print-map');

      node.id = config.rootNode;
      node.className = "result-container";
      node.innerHTML = "<div class='title'>" + config.title + "</div>" +
          "<div class='result-block total-loss'>" +
            "<div class='top-panel' id='" + config.rootNode + "_composition'></div>" +
            "<div class='left-panel'>" +
              "<div class='loss-chart' id='" + config.rootNode + "_loss'><div class='loader-wheel'>total loss</div></div>" +
            "</div>" +
          "</div>";

      // Append root to fragment and then fragment to document
      fragment.appendChild(node);
      document.getElementById('report-results-section').insertBefore(fragment, map);
    },

    /*
      @param {object} config
    */
    renderProdesContainer: function (config) {
      var fragment = document.createDocumentFragment(),
          node = document.createElement('div'),
          map = document.getElementById('print-map');

      node.id = config.rootNode;
      node.className = "result-container";
      node.innerHTML = "<div class='title'>" + config.title + "</div>" +
          "<div class='result-block prodes'>" +
            "<div class='top-panel' id='" + config.rootNode + "_composition'></div>" +
            "<div class='left-panel'>" +
              "<div class='prodes-chart' id='" + config.rootNode + "_prodes'><div class='loader-wheel'>prodes</div></div>" +
            "</div>" +
          "</div>";

      // Append root to fragment and then fragment to document
      fragment.appendChild(node);
      document.getElementById('report-results-section').insertBefore(fragment, map);
    },

    /*
      @param {object} config
    */
    renderSoyContainer: function (config) {
      var fragment = document.createDocumentFragment(),
          node = document.createElement('div'),
          map = document.getElementById('print-map');

      node.id = config.rootNode;
      node.className = 'result-container';
      node.innerHTML = "<div class='title'>" + config.title + '</div>' +
          "<div class='result-block soy'>" +
            "<div class='top-panel' id='" + config.rootNode + "_composition'></div>" +
            "<div class='left-panel'>" +
              "<div class='soy-chart' id='" + config.rootNode + "_soy'><div class='loader-wheel'>soy</div></div>" +
            '</div>' +
          '</div>';

      // Append root to fragment and then fragment to document
      fragment.appendChild(node);
      document.getElementById('report-results-section').insertBefore(fragment, map);
    },

    /*
      @param {object} config
    */
    renderGuyraContainer: function (config) {
      var fragment = document.createDocumentFragment(),
          node = document.createElement('div'),
          map = document.getElementById('print-map');

      node.id = config.rootNode;
      node.className = 'result-container';
      node.innerHTML = "<div class='title'>" + config.title + '</div>' +
          "<div class='result-block guyra'>" +
            // "<div class='top-panel' id='" + config.rootNode + "_composition'></div>" +
            '<div>' +
              "<div class='guyra-chart' id='" + config.rootNode + "_guyra'><div class='loader-wheel'>guyra</div></div>" +
            '</div>' +
          '</div>';

      // Append root to fragment and then fragment to document
      fragment.appendChild(node);
      document.getElementById('report-results-section').insertBefore(fragment, map);
    },

    /*
      @param {object} config
    */
    renderGladContainer: function (config) {
      var fragment = document.createDocumentFragment(),
          node = document.createElement('div'),
          map = document.getElementById('print-map');

      node.id = config.rootNode;
      node.className = 'result-container';
      node.innerHTML = "<div class='title'>" + config.title + '</div>' +
          "<div class='result-block glad'>" +
            // "<div class='top-panel' id='" + config.rootNode + "_composition'></div>" +
            '<div>' +
              "<div class='glad-chart' id='" + config.rootNode + "_glad'><div class='loader-wheel'>glad</div></div>" +
            '</div>' +
          '</div>';

      // Append root to fragment and then fragment to document
      fragment.appendChild(node);
      document.getElementById('report-results-section').insertBefore(fragment, map);
    },

    /*
      @param {object} config
    */
    renderRSPOContainer: function (config) {
      var fragment = document.createDocumentFragment(),
          node = document.createElement('div'),
          map = document.getElementById('print-map');

      node.id = config.rootNode;
      node.className = "result-container";
      node.innerHTML = "<div class='title'>" + config.title + "</div>" +
          "<div class='rspo-table-container' id='" + config.rootNode + "_table'><div class='loader-wheel'>rspo analysis</div></div>" +
          "<div class='rspo-chart-container' id='" + config.rootNode + "_chart'></div>";

      // Append root to fragment and then fragment to document
      fragment.appendChild(node);
      document.getElementById('report-results-section').insertBefore(fragment, map);

    },

    /*
      @param {object} config
    */
    renderSuitabilityContainer: function (config) {
      var fragment = document.createDocumentFragment(),
          node = document.createElement('div'),
          map = document.getElementById('print-map');

      node.id = config.rootNode;
      node.className = "result-container";
      node.innerHTML = "<div class='title'>" + config.title + "</div>" +
          "<div class='suitability-container'>" +
            "<div class='left-panel'>" +
              "<div id='suitability-table-csv' class='csv-download' title='Download CSV'></div>" +
              "<div id='" + config.rootNode + "_content' class='suitability-content'><div class='loader-wheel'>suitability</div></div>" +
            "</div>" +
            "<div class='right-panel'>" +
              "<div id='" + config.rootNode + "_chart' class='suitability-chart'><div class='loader-wheel'>suitability</div></div>" +
            "</div>" +
            "<div class='clearFix'></div>" +
            "<div class='left-panel'>" +
              "<div class='suitability-settings-table-header'>Suitability Settings</div>" +
              "<div id='suitability-settings-csv' class='csv-download' title='Download CSV'></div>" +
              "<div id='suitability-settings-table'></div>" +
            "</div>" +
            "<div class='right-panel'>" +
              "<div id='suitability-composition-analysis'><div class='loader-wheel'>composition</div></div>" +
            "</div>" +
          "</div>";

      // Append root to fragment and then fragment to document
      fragment.appendChild(node);
      document.getElementById('report-results-section').insertBefore(fragment, map);
    },

    /*
      @param {object} config
    */
    renderMillContainer: function (config) {
      var fragment = document.createDocumentFragment(),
          node = document.createElement('div'),
          map = document.getElementById('print-map'),
          downloadButton;

      downloadButton = "<button id='mill-download' class='mill-download-button' title='Download csv'></button>";
      node.id = config.rootNode;
      node.className = 'result-container relative';
      node.innerHTML = "<div class='title'>" + config.title + downloadButton + '</div>' +
          "<div id='mill-overall-container'></div>" +
          "<div class='mill-table-container' id='" + config.rootNode + "_table'><div class='loader-wheel'>risk assessment</div></div>";

      // Append root to fragment and then fragment to document
      fragment.appendChild(node);
      document.getElementById('report-results-section').insertBefore(fragment, map);
    },

    renderCompositionAnalysisLoader: function(config) {
      document.getElementById(config.rootNode + '_composition').innerHTML = '<div class="loader-wheel">composition analysis</div>';
    },

    renderCompositionAnalysis: function (histogramData, pixelSize, config, soyAreaResult) {
      var fragment = document.createDocumentFragment(),
          node = document.createElement('div'),
          dest = document.getElementById(config.rootNode + '_composition'),
          compositionConfig = config.compositionAnalysis,
          title = compositionConfig.title || config.title,
          areaLabel,
          percentage,
          area;


      if (compositionConfig.histogramSlice) {
        area = histogramData.slice(compositionConfig.histogramSlice);
      }

      if (area.length === 0) {
        this.renderAsUnavailable('composition', config);
        return;
      }

      area = (area.reduce(function(a, b){return a + b;}) * pixelSize * pixelSize) / 10000;
      areaLabel = number.format(area);


      report.areaPromise.then(function(){
        percentage = number.format((area / report.area) * 100, {places: 0});

        node.className = 'composition-analysis-container';

        if (config.rootNode === 'soy') {

          var soyD = histogramData.slice(1);

          var soyNumerator = 0;
          var totalSoyLoss = 0;

          for (var i = 1; i < 14; i++) {
            if (soyD[i - 1]) {
              totalSoyLoss += soyD[i - 1];
              soyNumerator += (soyD[i - 1] * i);
            }
          }

          var soyHectares = (soyAreaResult.reduce(function(a, b){return a + b;}) * pixelSize * pixelSize) / 10000;

          var soyDenominator = 13 * soyHectares;
          var soyRecentness = soyNumerator / soyDenominator;

          soyRecentness = soyRecentness.toFixed(2);

          var noData = histogramData[0];
          var soyPercentage = noData / report.area;

          soyPercentage = soyPercentage * 100;
          soyPercentage = Math.round(soyPercentage);

          if (soyAreaResult) {

            if (area.length === 0) {
              this.renderAsUnavailable('composition', config);
              return;
            }

            soyAreaResult = (soyAreaResult.reduce(function(a, b){return a + b;}) * pixelSize * pixelSize) / 10000;
            areaLabel = number.format(soyAreaResult);
            soyPercentage = (soyAreaResult - totalSoyLoss) / soyAreaResult;
            soyPercentage = soyPercentage * 100;
            soyPercentage = Math.round(soyPercentage);
          }

          node.innerHTML = '<div class="tree-cover-density-label"><i>Tree canopy density analyzed at </i>' +
          report.minDensity + '% <i>(Default is 30%)</i></div><br><div> Total soy in selected area: ' +
          areaLabel + " ha <a class='whats-this-soy' href='http://blog.globalforestwatch.org/data/deep-dive-soy-data-for-brazils-cerrado.html' target='_blank'><img src='app/css/images/info-orange.svg' class='layer-info-icon-report'></img></a></div>" +
                            '<div>Percent of area converted prior to 2001 or non-forest: ' + soyPercentage + "% <a class='whats-this-soy' href='http://blog.globalforestwatch.org/data/deep-dive-soy-data-for-brazils-cerrado.html' target='_blank'><img src='app/css/images/info-orange.svg' class='layer-info-icon-report'></img></a></div>" +
                            "<div class='soy-recentness'>Recent Loss Index: " + soyRecentness + " <a class='whats-this-soy' href='http://blog.globalforestwatch.org/data/deep-dive-soy-data-for-brazils-cerrado.html' target='_blank'><img src='app/css/images/info-orange.svg' class='layer-info-icon-report'></img></a></div>";
        } else {
          node.innerHTML = '<div>Total ' + title + ' in selected area: ' + areaLabel + ' ha</div>' +
                            '<div>Percent of total area comprised of ' + title + ': ' + percentage + '%</div>';
        }

        // Append root to fragment and then fragment to document
        fragment.appendChild(node);
        dest.innerHTML = '';
        dest.appendChild(fragment);

        function setIconHover () {
          $(this).attr('src', 'app/css/images/info-grey.svg');
        }

        function setIconBack () {
          $(this).attr('src', 'app/css/images/info-orange.svg');
        }

        $('.layer-info-icon-report').on('mouseenter', setIconHover);
        $('.layer-info-icon-report').on('mouseleave', setIconBack);

      });
    },

    /*
      @param {array} histogramData
      @param {number} pixelSize
      @param {object} config
      @param {function} encoder
      @param {boolean} useSimpleEncoderRule
    */
    renderLossData: function (histogramData, pixelSize, config, encoder, useSimpleEncoderRule) {
      var lossConfig = ReportConfig.totalLoss,
          yLabels = config.labels,
          xLabels = lossConfig.labels,
          yMapValues = arrayFromBounds(config.bounds),
          xMapValues = arrayFromBounds(lossConfig.bounds),
          mapFunction = function(item){return (item*pixelSize*pixelSize)/10000; },
          series = [],
          colors = [],
          location,
          sliceIndex,
          data,
          i, j;

      if (useSimpleEncoderRule) {
        // Remove first value as that is all the 0 values we dont want
        data = histogramData.slice(1).map(mapFunction);
        // Pad the array with 0's for all remaining years if data is missing
        if (data.length !== xLabels.length) {
          for (var index = 0; index < xLabels.length; index++) {
            if (data[index] === undefined) data[index] = 0;
          }
        }

        series.push({
          'name': yLabels[0],
          'data': data
        });
        colors.push(config.colors[0]);
      } else {

        for (i = 0; i < yMapValues.length; i++) {
          data = [];
          for (j = 0; j < xMapValues.length; j++) {
            // Get location from encoder
            location = encoder.encode(xMapValues[j], yMapValues[i]);
            data.push(histogramData[location] || 0);
          }
          series.push({
            'name': yLabels[i],
            'data': data.map(mapFunction)
          });
          colors.push(config.colors[i]);
        }
      }

      // Format the data based on some config value, removeBelowYear
      // get index of removeBelowYear and use that to splice the data arrays and the xlabels
      if (config.lossChart.removeBelowYear) {
        sliceIndex = xLabels.indexOf(config.lossChart.removeBelowYear);
        xLabels = xLabels.slice(sliceIndex);
        arrayUtils.forEach(series, function (serie) {
          serie.data = serie.data.slice(sliceIndex);
        });
      }

      $("#" + config.rootNode + '_loss').highcharts({
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: null,
          type: 'bar',
          events: {
            load: function () {
              // $('#' + config.tclChart.container + " .highcharts-legend").appendTo('#' + config.tclChart.container + "-legend");
              // this.setSize(300, 400);
            }
          }
        },
        colors: colors,
        title: {
          text: config.lossChart.title
        },
        exporting: {
          buttons: {
            contextButton: { enabled: false },
            exportButton: {
              menuItems: Highcharts.getOptions().exporting.buttons.contextButton.menuItems,
              symbol: exportButtonImagePath
            }
          }
        },
        xAxis: {
          categories: xLabels,
          maxPadding: 0.35,
          title: {
            text: null
          }
        },
        yAxis: {
          stackLabels: {
            enabled: true
          },
          title: {
            text: null
          }
        },
        legend: {
          enabled: true,
          verticalAlign: 'bottom'
        },
        plotOptions: {
          series: {
            stacking: 'normal'
          }
        },
        series: series,
        credits: {
          enabled: false
        }
      });

    },


    /*
      @param {array} histogramData
      @param {number} pixelSize
      @param {object} config
    */
    renderTreeCoverLossData: function (histogramData, pixelSize, config) {

      var lossConfig = ReportConfig.totalLoss,
          yLabels = config.labels,
          xLabels = lossConfig.labels,
          yMapValues = arrayFromBounds(config.bounds),
          xMapValues = arrayFromBounds(lossConfig.bounds),
          mapFunction = function(item){return (item*pixelSize*pixelSize)/10000; },
          series = [],
          colors = [],
          location,
          sliceIndex,
          data,
          i, j;

      series.push({
        'name': yLabels[0],
        'data': histogramData.slice(1).map(mapFunction) // Remove first value as that is all the 0 values we dont want
      });
      colors.push(config.color);

      // Format the data based on some config value, removeBelowYear
      // get index of removeBelowYear and use that to splice the data arrays and the xlabels
      if (config.lossChart.removeBelowYear) {
        sliceIndex = xLabels.indexOf(config.lossChart.removeBelowYear);
        xLabels = xLabels.slice(sliceIndex);
        arrayUtils.forEach(series, function (serie) {
          serie.data = serie.data.slice(sliceIndex);
        });
      }

      // Show All 0's if no data is present
      if (series[0].data.length !== xLabels.length) {
        for (var index = 0; index < xLabels.length; index++) {
          if (series[0].data[index] === undefined) series[0].data[index] = 0;
        }
      }


      $("#" + config.rootNode + '_loss').highcharts({
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: null,
          type: 'bar',
          events: {
            load: function () {
              // $('#' + config.tclChart.container + " .highcharts-legend").appendTo('#' + config.tclChart.container + "-legend");
              // this.setSize(300, 400);
            }
          }
        },
        exporting: {
          buttons: {
            contextButton: { enabled: false },
            exportButton: {
              menuItems: Highcharts.getOptions().exporting.buttons.contextButton.menuItems,
              symbol: exportButtonImagePath
            }
          }
        },
        colors: colors,
        title: {
          text: config.lossChart.title
        },
        xAxis: {
          categories: xLabels,
          maxPadding: 0.35,
          title: {
            text: null
          }
        },
        yAxis: {
          stackLabels: {
            enabled: true
          },
          title: {
            text: null
          }
        },
        legend: {
          enabled: false,
          verticalAlign: 'bottom'
        },
        plotOptions: {
          series: {
            stacking: 'normal'
          }
        },
        series: series,
        credits: {
          enabled: false
        }
      });

    },

    /*
      @param {array} histogramData
      @param {number} pixelSize
      @param {object} config
    */
    renderProdesData: function (histogramData, pixelSize, config) {

      var prodesConfig = ReportConfig.prodesLayer,
          yLabels = config.labels,
          xLabels = prodesConfig.labels,
          mapFunction = function(item){return (item * pixelSize * pixelSize) / 10000; },
          series = [],
          colors = [];

      series.push({
        'name': yLabels[0],
        'data': histogramData.slice(1).map(mapFunction) // Remove first value as that is all the 0 values we dont want
      });
      colors.push(config.color);

      // Show All 0's if no data is present
      if (series[0].data.length !== xLabels.length) {
        for (var index = 0; index < xLabels.length; index++) {
          if (series[0].data[index] === undefined) series[0].data[index] = 0;
        }
      }

      $("#" + config.rootNode + '_prodes').highcharts({
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: null,
          type: 'bar',
          events: {
            load: function () {
              // $('#' + config.tclChart.container + " .highcharts-legend").appendTo('#' + config.tclChart.container + "-legend");
              // this.setSize(300, 400);
            }
          }
        },
        exporting: {
          buttons: {
            contextButton: { enabled: false },
            exportButton: {
              menuItems: Highcharts.getOptions().exporting.buttons.contextButton.menuItems,
              symbol: exportButtonImagePath
            }
          }
        },
        colors: colors,
        title: {
          text: config.lossChart.title
        },
        xAxis: {
          categories: xLabels,
          maxPadding: 0.35,
          title: {
            text: null
          }
        },
        yAxis: {
          stackLabels: {
            enabled: true
          },
          title: {
            text: null
          }
        },
        legend: {
          enabled: false,
          verticalAlign: 'bottom'
        },
        plotOptions: {
          series: {
            stacking: 'normal'
          }
        },
        series: series,
        credits: {
          enabled: false
        }
      });

    },

    /*
      @param {array} histogramData
      @param {number} pixelSize
      @param {object} config
    */
    renderSoyData: function (histogramData, pixelSize, config, soyGeom) {

      var soyConfig = ReportConfig.soy,
          yLabels = config.labels,
          xLabels = soyConfig.labels,
          mapFunction = function(item){return (item * pixelSize * pixelSize) / 10000; },
          series = [],
          colors = soyConfig.colors;

      series.push({
        'name': yLabels[0],
        'data': histogramData.slice(1).map(mapFunction) // Remove first value as that is all the 0 values we dont want
      });

      // Show All 0's if no data is present
      if (series[0].data.length !== xLabels.length) {
        for (var index = 0; index < xLabels.length; index++) {
          if (series[0].data[index] === undefined) {
            series[0].data[index] = 0;
          }
        }
      }

      if (series && series[0] && series[0].data && series[0].data.length === 14) {
        series[0].data.pop(); //Removing the 2014 data from the chart
      }

      $('#' + config.rootNode + '_soy').highcharts({
        tooltip: { enabled: false },
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: null,
          type: 'bar',
          events: {
            load: function () {
              // $('#' + config.tclChart.container + " .highcharts-legend").appendTo('#' + config.tclChart.container + "-legend");
              // this.setSize(300, 400);
            }
          }
        },
        exporting: {
          buttons: {
            contextButton: { enabled: false },
            exportButton: {
              menuItems: Highcharts.getOptions().exporting.buttons.contextButton.menuItems,
              symbol: exportButtonImagePath
            }
          }
        },
        colors: colors,
        title: {
          text: config.lossChart.title
        },
        xAxis: {
          categories: xLabels,
          maxPadding: 0.35,
          title: {
            text: null
          }
        },
        yAxis: {
          stackLabels: {
            enabled: true
          },
          title: {
            text: null
          }
        },
        legend: {
          enabled: false,
          verticalAlign: 'bottom'
        },
        plotOptions: {
          series: {
            stacking: 'normal'
          }
        },
        series: series,
        credits: {
          enabled: false
        }
      });

    },

    /*
      @param {array} histogramData
      @param {number} pixelSize
      @param {object} config
    */
    renderGuyraData: function (histogramData, pixelSize, config) {

      var guyraConfig = ReportConfig.guyraLayer,
          yLabels = config.labels,
          xLabels = guyraConfig.labels,
          mapFunction = function(item){return (item * pixelSize * pixelSize) / 10000; },
          series = [],
          colors = [];

      var data = histogramData.slice(1).map(mapFunction);

      var baseMonth = 9;
      data.forEach(function (value, index) {
        //- index represents the month after the base month, so first value is for september, 2nd for October, etc.
        //- the - 1 is because the months are indexed base, new Date('2016', 9, 1) yields October, not September
        series.push([new Date('2011', (index + baseMonth - 1), 1).getTime(), value]);
      });
      // series.push({
      //   'name': yLabels[0],
      //   'data': histogramData.slice(1).map(mapFunction) // Remove first value as that is all the 0 values we dont want
      // });
      colors.push(config.color);

      // // Show All 0's if no data is present
      // if (series[0].data.length !== xLabels.length) {
      //   for (var index = 0; index < xLabels.length; index++) {
      //     if (series[0].data[index] === undefined) {
      //       series[0].data[index] = 0;
      //     }
      //   }
      // }
      Highcharts.setOptions({
        lang: {
          thousandsSep: ','
        }
      });

      $('#' + config.rootNode + '_guyra').highcharts({
        chart: {
          zoomType: 'x',
          resetZoomButton: {
            position: {
              align: 'left',
              y: 0
            }
          }
        },
        exporting: {
          buttons: {
            contextButton: { enabled: false },
            exportButton: {
              menuItems: Highcharts.getOptions().exporting.buttons.contextButton.menuItems,
              symbol: exportButtonImagePath
            }
          }
        },
        title: { text: null },
        xAxis: {
          type: 'datetime'
        },
        credits: { enabled: false },
        yAxis: { title: { text: 'hectares' }, min: 0 },
        plotOptions: {
          column: {
            color: config.color
          }
        },
        tooltip: {
          dateTimeLabelFormats: { hour: '%B, %Y' }
          // formatter: function () {
          //   var date
          //       return 'The value for <b>%b</b> is <b>' + this.x + '</b>';
          //   }
        },
        legend: {
          enabled: false
        },
        series: [{
          type: 'column',
          name: config.title,
          data: series,
          tooltip: {
            valueSuffix: ' ha'
          }
        }]
      });

    },


    /*
      @param {array} histogramData
      @param {number} pixelSize
      @param {object} config
      @param {function} encoder
      @param {boolean} useSimpleEncoderRule
    */
    renderClearanceData: function (histogramData, pixelSize, config, encoder, useSimpleEncoderRule) {
      var yLabels = config.labels,
          yMapValues = arrayFromBounds(config.bounds),
          xMapValues = arrayFromBounds(report.clearanceBounds),
          // mapFunction = function(item){return (item*pixelSize*pixelSize)/10000; },
          series = [],
          data = [],
          location,
          value,
          i, j;


      // Config eventually needs to be updated as this is no longer a pie chart
      // Pie chart code and config are staying this way until client approves
      // Will still need the if else, the else section constructs a series with only one value

      if (config.clearanceChart.type === 'pie') {
        // for (i = 0; i < yMapValues.length; i++) {
        //  value = 0;
        //  for (j = 0; j < xMapValues.length; j++) {
        //    location = encoder.encode(xMapValues[j], yMapValues[i]);
        //    value += (histogramData[location] || 0);
        //  }
        //  series.push(value);
        // }

        // Account for pixelSize
        // series.map(mapFunction);

        // for (i = 0; i < series.length; i++) {
        //  data.push([yLabels[i], series[i]]);
        // }

        // $('#' + config.rootNode + '_clearance').highcharts({
        //  chart: {
        //    plotBackgroundColor: null,
        //    plotBorderWidth: null,
        //    plotShadow: false
        //  },
        //  colors: config.colors,
        //  title: {
        //    text: config.clearanceChart.title
        //  },
        //  plotOptions: {
        //    pie: {
        //      allowPointSelect: true,
        //      cursor: 'pointer',
        //      showInLegend: true,
        //      dataLabels: {
        //        enabled: false
        //      }
        //    }
        //  },
        //  credits: {
        //    enabled: false
        //  },
        //  legend: {
        //    enabled: true
        //  },
        //  series: [{
        //    type: 'pie',
        //    name: 'Monthly Alerts',
        //    data: data
        //  }]
        // });

        // Format data for line chart
        for (i = 0; i < yMapValues.length; i++) {
          value = 0;
          data = [];
          for (j = 0; j < xMapValues.length; j++) {
            location = encoder.encode(xMapValues[j], yMapValues[i]);
            data.push(histogramData[location] || 0);
          }
          series.push({
            name: yLabels[i],
            data: data
          });
        }

        // if (series.length === 0) {
        //  this.renderAsUnavailable('clearance', config);
        //  return;
        // }

        $('#' + config.rootNode + '_clearance').highcharts({
          chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
          },
          exporting: {
            buttons: {
              contextButton: { enabled: false },
              exportButton: {
                menuItems: Highcharts.getOptions().exporting.buttons.contextButton.menuItems,
                symbol: exportButtonImagePath
              }
            }
          },
          colors: config.colors,
          title: {
            text: config.clearanceChart.title
          },
          xAxis: {
            categories: report.clearanceLabels
          },
          yAxis: {
            title: null,
            min: 0
          },
          legend: {
            enabled: true
          },
          credits: {
            enabled: false
          },
          series: series
        });


      } else {

        if (useSimpleEncoderRule) {
          // Remove first value as that is all the 0 values we dont want
          series = histogramData.slice(1);

          // Pad the array with 0's for all remaining years if data is missing
          if (series.length !== xMapValues.length) {
            for (var index = 0; index < xMapValues.length; index++) {
              if (series[index] === undefined) series[index] = 0;
            }
          }

        } else {
          for (i = 0; i < xMapValues.length; i++) {
            value = 0;
            for(j = 0; j < yMapValues.length; j++) {
              location = encoder.encode(xMapValues[i], yMapValues[j]);
              value += (histogramData[location] || 0);
            }
            series.push(value);
          }
        }

        //series = series.slice(series.length - 6, series.length); //todo: Remove this slice hack after the 2014 data has been taken out of the service

        $('#' + config.rootNode + '_clearance').highcharts({
          chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
          },
          exporting: {
            buttons: {
              contextButton: { enabled: false },
              exportButton: {
                menuItems: Highcharts.getOptions().exporting.buttons.contextButton.menuItems,
                symbol: exportButtonImagePath
              }
            }
          },
          colors: ['#fb00b3'],
          title: {
            text: config.clearanceChart.title
          },
          xAxis: {
            categories: report.clearanceLabels
          },
          yAxis: {
            title: null,
            min: 0
          },
          legend: {
            enabled: false
          },
          credits: {
            enabled: false
          },
          series: [{
            'name': config.title,
            'data': series
          }]
        });

      }

    },

    renderGladData: function (histogramData, config) {

      $('#' + config.rootNode + '_glad').highcharts({
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false
        },
        lang: {
            gladButtonTitle: 'Download Chart Data'
        },
        exporting: {
          buttons: {
            contextButton: { enabled: false },
            exportButton: {
              // align: 'center',
              // x: 40,
              _titleKey: 'gladButtonTitle',
              menuItems: Highcharts.getOptions().exporting.buttons.contextButton.menuItems,
              symbol: exportButtonImagePath
            }
          }
        },
        colors: ['#fb00b3'],
        title: { text: null },
        // xAxis: {
        //   categories: report.clearanceLabels
        // },
        xAxis: { type: 'datetime' },
        // yAxis: {
        //   title: null,
        //   min: 0
        // },
        yAxis: { title: { text: 'Tree Cover Loss Alerts' }, min: 0},
        legend: {
          enabled: false
        },
        credits: {
          enabled: false
        },
        plotOptions: {
          area: {
            threshold: null,
            lineWidth: 1,
            states: { hover: { lineWidth: 1 }},
            fillColor: {
              linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
              stops: [
                [0, 'rgba(220,102,153, 1)'],
                [1, 'rgba(220,102,153, 0)']
              ]
            }
          }
        },
        tooltip: {
          dateTimeLabelFormats: { hour: '%A, %b %e' }
        },
        series: [{
          type: 'area',
          name: config.title,
          data: histogramData
        }]
      });

    },

    /*
      Render Pie Chart and Badge as appropriate for the individual layers
      @param {object} configObjects
      @param {array} results
    */
    renderFireData: function (configObjects, results) {
      // Combine the Results
      // var features = results[0].features.concat(results[1].features),
      var features = results[0].features,
          datasetTotal,
          chartData,
          rootNode,
          config,
          i;

      // Helper Functions
      /*
        @param {string} rootNode
        @param {number} activeFires number fires intersecting with dataset
        @param {number} totalActiveFires total number of fires in geometry
        @param {string} description description for the dataset used in the badge
      */
      function createBadge(rootNode, activeFires, totalActiveFires, description) {
        var fragment = document.createDocumentFragment(),
            node = document.createElement('div'),
            dest = document.getElementById(rootNode + '_fire');

        node.className = "active-fires-badge";
        node.innerHTML = "<div>There are currently</div>" +
            "<div class='active-fires-label'>" +
              "<div>" + number.format(activeFires) + "</div>" +
              "<span>active fires</span>" +
            "</div>" +
            "<div>" + description + "</div>" +
            "<div class='total-active-fires-label'><span>" + number.format(totalActiveFires) + " total active fires</span></div>";

        // Append root to fragment and then fragment to document
        fragment.appendChild(node);
        dest.innerHTML = "";
        dest.appendChild(fragment);
      }

      /*
        THIS FUNCTION EXPECTS EXACTLY 2 LABELS AND DATA VALUES, NO MORE OR LESS
        @param {string} rootNode
        @param {array} bounds signifies the bounds of the data classes
        @param {array} data number fires intersecting with dataset in array relative to labels
        @param {array} labels array of labels describing which classes have fires in them
        @param {number} totalFires total number of fires
      */
      function createSpecialBadge(rootNode, data, bounds, labels, totalFires) {
        var fragment = document.createDocumentFragment(),
            node = document.createElement('div'),
            dest = document.getElementById(rootNode + '_fire'),
            values = [];

        for (var i = 0; i < data.length; i++) {
          if (i >= bounds[0] && i <= bounds[1]) {
            values.push(data[i]);
          }
        }

        node.className = "active-fires-badge special";
        node.innerHTML = "<div>Active fires are detected in:</div>" +
                         "<div class='active-fires-label'>" +
                              "<span>" + labels[0] + " Forests</span>" +
                              "<div>" + number.format(values[0] || 0) + "</div>" +
                            "</div>" +
                            "<div class='active-fires-label'>" +
                              "<span>" + labels[1] + " Forests</span>" +
                              "<div>" + number.format(values[1] || 0) + "</div>" +
                            "</div>" +
                            "<div class='total-active-fires-label'><span>out of " + number.format(totalFires) + " total active fires</span></div>" +
                         "</div>";
        // Append root to fragment and then fragment to document
        fragment.appendChild(node);
        dest.innerHTML = "";
        dest.appendChild(fragment);
      }

      /*
        @param {string} rootNode
        @param {array} data
        @param {string} labels
        @param {string} colors
        @param {string} bounds
        @param {string} title
        @param {string} description
      */
      function createChart(rootNode, data, labels, colors, bounds, title, description) {
        var resultingData = [],
            labelCounter = 0,
            chartColors = [],
            i;

        for (i = 0; i < data.length; i++) {
          if (i >= bounds[0] && i <= bounds[1]) {
            if (data[i] !== 0 && !isNaN(data[i])) {
              resultingData.push([labels[labelCounter], data[i]]);
              chartColors.push(colors[labelCounter]);
            }
            labelCounter++;
          }
        }

        if (resultingData.length === 0) {
          createBadge(rootNode, 0, 0, description);
        } else if (labels.length === 2) {
          // For Values with only two labels, redirect to a specific type of badge
          createSpecialBadge(rootNode, data, bounds, labels, features.length);
        } else {
          $("#" + rootNode + "_fire").highcharts({
            chart: {
              plotBackgroundColor: null,
              plotBorderWidth: null,
              plotShadow: null
            },
            colors: chartColors,
            title: {
              text: "Active Fires"
            },
            exporting: {
              buttons: {
                contextButton: { enabled: false },
                exportButton: {
                  menuItems: Highcharts.getOptions().exporting.buttons.contextButton.menuItems,
                  symbol: exportButtonImagePath
                }
              }
            },
            plotOptions: {
              pie: {
                size: '75%',
                allowPointSelect: true,
                cursor: 'pointer',
                showInLegend: true,
                dataLabels: {
                  enabled: false
                }
              }
            },
            credits: {
              enabled: true
            },
            legend: {
              enabled: false
            },
            series: [{
              type: 'pie',
              name: 'Fires',
              data: resultingData
            }]
          });

        }

      }
      // Helper Functions


      arrayUtils.forEach(configObjects, function (item) {

        rootNode = item.rootNode;
        config = ReportConfig.fires[item.fireKey];

        // First IF is Temporary until fires layers are merged and we dont need to query two layers
        if (results.length > 1 && item.fireKey === 'indonesiaMoratorium') {
          var total = 0;
          arrayUtils.forEach(results[1].features, function (result) {
            total += +result.attributes[config.field];
          });
          createBadge(rootNode, total, features.length, config.badgeDesc);
          return;
        }

        if (features.length === 0) {

          createBadge(rootNode, 0, 0, config.badgeDesc);
        } else if (config.type === 'pie') {
          chartData = [];
          // Set initial values to 0 for all labels
          for (i = 0; i <= config.labels.length; i++) {
            chartData[i] = 0;
          }
          arrayUtils.forEach(features, function (feature) {
            chartData[feature.attributes[config.field]]++;
          });
          createChart(rootNode, chartData, config.labels, config.colors, config.bounds, config.title, config.badgeDesc);
        } else {
          console.log('config.field', config.field);
          // debugger
          datasetTotal = 0;
          arrayUtils.forEach(features, function (feature) {
            datasetTotal += isNaN(parseInt(feature.attributes[config.field])) ? 0 : parseInt(feature.attributes[config.field]);
          });
          createBadge(rootNode, datasetTotal, features.length, config.badgeDesc);
        }
      });

    },

    /*
      Add No Data Available Text to the Appropriate location
      @param {object} response
      @param {object} config
      @param {function} encoder
    */
    renderRSPOData: function (response, config, encoder) {
      var lossValues = arrayFromBounds(ReportConfig.rspo.lossBounds),
          self = this;

      // If there are results, build the table, else, mark dataNotAvailable to true
      if (response.histograms.length > 0) {
        var BASEYEAR = 2005,
            MAXCOUNT = 8,
            // variables to be used
            resultContent = "",
            agroPart = "",
            priPart = "",
            secPart = "",
            nonPart = "",
            years = [],
            agro = [],
            pri = [],
            sec = [],
            non = [],
            location,
            counts,
            i, j, n;

        // Start building the table and build the headers
        resultContent = "<div id='rspo-table-csv' class='csv-download' title='Download CSV'></div><table class='rspo-results-table'><tr><th>Forest Type</th>";
        for (i = 0; i <= MAXCOUNT; i++) {
          years.push(BASEYEAR + i);
          resultContent += "<th>" + (BASEYEAR + i) + "</th>";
        }
        resultContent += "</tr>";

        // Pull the correct values out of the histogram
        counts = response.histograms[0].counts;

        for (j = 0; j < lossValues.length; j++) {
          // Primary Forest
          location = encoder.encode(lossValues[j], 2);
          pri.push(counts[location] || 0);
          // Secondary Forest
          location = encoder.encode(lossValues[j], 3);
          sec.push(counts[location] || 0);
          // Agroforesty Forest
          location = encoder.encode(lossValues[j], 1);
          agro.push(counts[location] || 0);
          // Non-Forest
          location = encoder.encode(lossValues[j], 0);
          non.push(counts[location] || 0);
        }

        priPart = "<tr><td>Primary</td>";
        secPart = "<tr><td>Secondary</td>";
        agroPart = "<tr><td>Agroforestry</td>";
        nonPart = "<tr><td>Non-Forest</td>";

        for (n = 0; n < pri.length; n++) {
          priPart += "<td>" + (number.format(pri[n]) || 0) + "</td>";
          secPart += "<td>" + (number.format(sec[n]) || 0) + "</td>";
          agroPart += "<td>" + (number.format(agro[n]) || 0) + "</td>";
          nonPart += "<td>" + (number.format(non[n]) || 0) + "</td>";
        }

        priPart += "</tr>";
        secPart += "</tr>";
        agroPart += "</tr>";
        nonPart += "</tr>";

        resultContent += priPart + secPart + agroPart + nonPart + "</table>";
        resultContent += "<div class='change-area-unit'>(Change in Hectares)</div>";

        document.getElementById(config.rootNode + '_table').innerHTML = resultContent;
        this.renderRSPOChart(config, pri, sec, agro, non, years);

        // Add Click Handler for downloading CSV Data
        // Everything is handled in this callback because Im not sure we need this feature
        // The chart that renders below this table has an export already and it is the exact same thing
        $('#rspo-table-csv').click(function () {
          var lineEnding = '\r\n';
          var csvData = [];
          var values = [];
          var output = '';

          csvData.push('RSPO Land Use Change Analysis');
          csvData.push(document.getElementById('title').innerHTML);

          arrayUtils.forEach(years, function (year) {
            values.push(year);
          });
          csvData.push('Forest Type,' + values.join(','));

          values = [];
          arrayUtils.forEach(pri, function (year) {
            values.push(year);
          });
          csvData.push('Primary,' + values.join(','));

          values = [];
          arrayUtils.forEach(sec, function (year) {
            values.push(year);
          });
          csvData.push('Secondary,' + values.join(','));

          values = [];
          arrayUtils.forEach(agro, function (year) {
            values.push(year);
          });
          csvData.push('Agroforestry,' + values.join(','));

          values = [];
          arrayUtils.forEach(non, function (year) {
            values.push(year);
          });
          csvData.push('Non-Forest,' + values.join(','));

          output = csvData.join(lineEnding);

          CSVExporter.exportCSV(output);

          Analytics.sendEvent('Event', 'Download CSV', 'User downloaded RSPO results table.');

        });

      } else {
        document.getElementById(config.rootNode + '_table').innerHTML = "<div class='data-not-available'>No RSPO Data Available for this Site.</div>";
        return;
      }

    },

    /*
      Add No Data Available Text to the Appropriate location
      @param {object} config
      @param {array} primary
      @param {array} secondary
      @param {array} agroforestry
      @param {array} nonforest
      @param {array} years
    */
    renderRSPOChart: function (config, primary, secondary, agroforestry, nonforest, years) {

      var textColorObject = {
        color: '#000'
      },
      labelsDesign = {
        style: textColorObject
      };

      $("#" + config.rootNode + '_chart').highcharts({
        chart: {
          backgroundColor: '#FFF',
          type: 'column'
        },
        exporting: {
          buttons: {
            contextButton: { enabled: false },
            exportButton: {
              menuItems: Highcharts.getOptions().exporting.buttons.contextButton.menuItems,
              symbol: exportButtonImagePath
            }
          }
        },
        colors: config.colors,
        title: {
          text: null
        },
        legend: {
          align: 'center',
          verticalAlign: 'top',
          enabled: true
        },
        xAxis: {
          categories: years,
          labels: labelsDesign
        },
        yAxis: {
          title: {
            text: '',
            style: textColorObject
          },
          labels: labelsDesign
        },
        plotOptions: {
          column: {
            stacking: 'normal'
          }
        },
        tooltip: {
          formatter: function () {
            return '<strong>' + this.key + '</strong><br/>' +
                    this.series.name + ': ' + number.format(this.y) + '<br/>' +
                    'Total: ' + number.format(this.point.stackTotal);
          }
        },
        credits: {
          enabled: false
        },
        series: [
          {'name': 'Primary', data: primary },
          {'name': 'Secondary', data: secondary},
          {'name': 'Agroforestry', data: agroforestry},
          {'name': 'Non-Forest', data: nonforest}
        ]
      });
    },

    /*
      Gather an array of payloads from the report/Suitability module and create an output
      @param {object} config
      @param {array} payloads
        0 - getSuitableAreas
        1 - getLCHistogramData
        2 - getRoadData
        3 - getConcessionData
        4 - computeLegalHistogram
        Note: Each payload looks like this except for getConcessionData:
        { data: histoData, pixelSize: 'pixelSize used in calculating'}
        getConcessionData just has a value: { value: 'Yes or No'}
    */
    renderSuitabilityData: function (config, payloads) {
      var classIndices = config.lcHistogram.classIndices,
          content = "<table>",
          convFactor,
          unsuitable,
          suitable,
          area,
          roadDistance,
          concession,
          productionUse,
          convertibleUse,
          otherUse,
          histogram;

      // Get Suitabile Areas
      histogram = payloads[0];
      if (histogram) {
        convFactor = Math.pow(histogram.pixelSize / 100, 2);
        if (!histogram.data.counts[1]) {
          suitable = 0;
          unsuitable = number.format(histogram.data.counts[0] * convFactor);
          //area = number.format(histogram[0] * convFactor) || "---";
        } else {
          suitable = number.format(histogram.data.counts[1] * convFactor) || histogram.data.counts[1];
          unsuitable = number.format(histogram.data.counts[0] * convFactor) || histogram.data.counts[0];
          //area = number.format((histogram[0] + histogram[1]) * convFactor) || "---";
        }
      } else {
        suitable = 'N/A';
        unsuitable = 'N/A';
        //area = 'N/A';
      }

      // Get LC Histogram Data
      histogram = payloads[1];
      if (histogram) {
        convFactor = Math.pow(histogram.pixelSize / 100, 2);
        var getValue = function(indices) {
          var value = 0;
          for (var i = 0; i < indices.length; i++) {
            if (histogram.data.counts[indices[i]]) {
              value += (histogram.data.counts[indices[i]] * convFactor);
            }
          }
          return number.format(value);
        };
        productionUse = getValue(classIndices.production);
        convertibleUse = getValue(classIndices.convertible);
        otherUse = getValue(classIndices.other);
      } else {
        productionUse = 'N/A';
        convertibleUse = 'N/A';
        otherUse = 'N/A';
      }

      // Get Road Data
      histogram = payloads[2];
      if (histogram) {
        roadDistance = parseFloat(histogram.data.min / 1000).toFixed(1);
      } else {
        roadDistance = 'N/A';
      }

      // Get Concession Data
      histogram = payloads[3];
      if (histogram) {
        concession = histogram.value;
      } else {
        concession = 'N/A';
      }

      // Set Suitabile Areas content
      content += "<tr><td>Suitable(ha):</td><td>" + suitable + "</td></tr>";
      content += "<tr><td>Unsuitable(ha):</td><td>" + unsuitable + "</td></tr>";
      // Set Road Data Content
      content += "<tr><td>Distance to nearest road(km):</td><td>" + roadDistance + "</td></tr>";
      // Set Concession Data Content
      content += "<tr><td>Existing concessions(Yes/No):</td><td>" + concession + "</td></tr>";
      // Set LC Histogram Data
      content += "<tr><td>Legal Classification(ha):</td><td></td></tr>";
      content += "<tr><td class='child-row'>Production forest(HP/HPT):</td><td>" + productionUse + "</td></tr>";
      content += "<tr><td class='child-row'>Convertible forest(HPK):</td><td>" + convertibleUse + "</td></tr>";
      content += "<tr><td class='child-row'>Other land uses(APL):</td><td>" + otherUse + "</td></tr>";
      content += "</table>";
      // Add Local rights/interests and field assessment links
      content += "<p>" + config.localRights.content + "</p>";
      content += "<div class='field-assessment-link'>" +
                   "<a href='" + config.localRights.fieldAssessmentUrl + "'>" + config.localRights.fieldAssessmentLabel + "</a>" +
                  "</div>";

      document.getElementById(config.rootNode + '_content').innerHTML = content;
      this.renderSuitabilityChart(config, payloads[4]);
      this.renderSuitabilitySettingsTable();

    },

    /**
    * Takes global variable payload.suitability.csv and parses that out to render it to a table
    */
    renderSuitabilitySettingsTable: function () {
      var settings = payload && payload.suitability && payload.suitability.csv,
          content = "<table><thead><tr>",
          settingsArray,
          headerRow,
          table,
          label,
          value,
          data;

      if (settings) {
        // Split the string by newline settings, splice the csv content and leave the header separate
        table = settings.split('\n');
        settingsArray = table.splice(1);
        headerRow = table[0].split(',');

        content += '<th>Parameter</th><th>Setting</th></tr></thead><tbody>';

        arrayUtils.forEach(settingsArray, function (setting) {
          data = setting.split(',');
          label = data[0];
          value = data[1];
          if (label !== undefined && label !== '') {
            content += '<tr><td>' + label + '</td><td>' + value.replace(/\;/g,',') + '</td></tr>';
          }
        });

        content += '</tbody></table>';

        $('#suitability-settings-table').html(content);

      }

    },

    /**
    * @param {object} results - array of result objects containing suitable & unsuitable pixel counts and a label
    */
    renderSuitabilityCompositionChart: function (results) {
      var unsuitableValues = [],
          suitableValues = [],
          labels = [],
          tempTotal;

      // Format the results into two arrays, one of labels and one of percentages
      // First calcualte the percentages, sort the array, then create the two arrays
      arrayUtils.forEach(results, function (result) {
        tempTotal = result.suitable + result.unsuitable;
        result.suitable = (result.suitable / tempTotal) * 100;
        // These values need to be negative so multiply by negative 1 to invert the values
        result.unsuitable = ((result.unsuitable / tempTotal) * 100) * -1;
      });

      // Sort them based on the highest percentage of suitability, strangely highcharts is reversing them
      // for this particular chart, below puts least suitable on top so when highcharts reverses it, it
      // renders the most suitable on top
      results.sort(function (a, b) {
        if (a.suitable > b.suitable) return 1;
        if (b.suitable > a.suitable) return -1;
        return 0;
      });

      arrayUtils.forEach(results, function (result) {
        unsuitableValues.push(result.unsuitable);
        suitableValues.push(result.suitable);
        labels.push(result.label);
      });

      // Now Create the Chart, the dom node to insert it into is suitability-composition-analysis
      $('#suitability-composition-analysis').highcharts({
        chart: { type: 'bar' },
        title: { text: 'Suitability Composition Analysis' },
        colors: ['#FDD023','#461D7C'],
        credits: { enabled: false },
        xAxis: [{
          categories: labels,
          reversed: false
        }, {
          labels: {
            enabled: false
          },
          opposite: true,
          reversed: false,
          linkedTo: 0,  // Link to the first axis so it takes the same min and max
          //minorTickLength: 0
          tickLength: 0
        }],
        yAxis: {
          title: {
            text: null
          },
          min: -100,
          max: 100,
          labels: {
            formatter: function () {
              return Math.abs(this.value) + (this.value !== 0 ? '%' : '');
            }
          }
        },
        tooltip: {
          formatter: function () {
            return (
              '<b>' + this.point.category + '</b><br/>' +
              '<b>' + this.series.name + ':</b>\t' + Highcharts.numberFormat(Math.abs(this.point.y), 2) + '%'
            );
          }
        },
        plotOptions: {
          series: {
            stacking: 'normal'
          }
        },
        series: [{
          name: 'Unsuitable',
          data: unsuitableValues
        }, {
          name: 'Suitable',
          data: suitableValues
        }],
        exporting: {
          buttons: {
            contextButton: { enabled: false },
            exportButton: {
              menuItems: Highcharts.getOptions().exporting.buttons.contextButton.menuItems,
              symbol: exportButtonImagePath
            }
          }
        }
      });

    },

    /*
      Take the payload related to the chart and render the chart or a data not available
      @param {object} config
      @param {object} payload
    */
    renderSuitabilityChart: function (config, payload) {

      if (!payload) {
        document.getElementById(config.rootNode + "_chart").innerHTML = "<div class='data-not-available'>No Suitability Data Available to chart for this Site.</div>";
        return;
      }

      var classIndices = config.lcHistogram.classIndices,
          convFactor = Math.pow(payload.pixelSize / 100, 2),
          chartConfig = config.chart,
          chartData = [],
          innerValues = [],
          outerValues = [],
          convertible,
          production,
          other;


      // Build data Objects for chart
      function buildValues(indices) {
        var value = {
          suitable: 0,
          unsuitable: 0
        };

        for (var i = 0; i < indices.length; i++) {
          if (payload.data.counts[indices[i]]) {
            value.unsuitable += (payload.data.counts[indices[i]] * convFactor);
            value.suitable += (payload.data.counts[indices[i] + 10] * convFactor);
          }
        }
        return value;
      }

      convertible = buildValues(classIndices.convertible);
      production = buildValues(classIndices.production);
      other = buildValues(classIndices.other);

      // Format the Two Main Entries with the inner entries as children
      chartData.push({
        y: (convertible.suitable + production.suitable + other.suitable),
        color: chartConfig.suitable.color,
        name: chartConfig.suitable.name,
        id: chartConfig.suitable.id,
        children: {
          categories: chartConfig.childrenLabels,
          colors: chartConfig.childrenColors,
          data: [production.suitable, convertible.suitable, other.suitable]
        }
      });

      chartData.push({
        y: (convertible.unsuitable + production.unsuitable + other.unsuitable),
        color: chartConfig.unsuitable.color,
        name: chartConfig.unsuitable.name,
        id: chartConfig.unsuitable.id,
        children: {
          categories: chartConfig.childrenLabels,
          colors: chartConfig.childrenColors,
          data: [production.unsuitable, convertible.unsuitable, other.unsuitable]
        }
      });

      // Begin Building the Chart
      for (var i = 0; i < chartData.length; i++) {
        if (chartData[i].y > 0) {
          innerValues.push({
            color: chartData[i].color,
            name: chartData[i].name,
            id: chartData[i].id,
            y: chartData[i].y
          });
          for (var j = 0; j < chartData[i].children.data.length; j++) {
            if (chartData[i].children.data[j] > 0) {
              outerValues.push({
                name: chartData[i].children.categories[j],
                color: chartData[i].children.colors[j],
                y: chartData[i].children.data[j],
                parentId: chartData[i].id
              });
            }
          }
        }
      }

      $("#" + config.rootNode + "_chart").highcharts({
        chart: {
          type: 'pie',
          backgroundColor: '#FFF',
          plotBorderWidth: null
        },
        title: {
          text: chartConfig.title
        },
        tooltip: {
          valueSuffix: ''
        },
        exporting: {
          buttons: {
            contextButton: { enabled: false },
            exportButton: {
              menuItems: Highcharts.getOptions().exporting.buttons.contextButton.menuItems,
              symbol: exportButtonImagePath
            }
          }
        },
        plotOptions: {
          series: {
            point: {
              events: {
                legendItemClick: function () {
                  var id = this.id,
                      data = this.series.chart.series[1].data;
                  data.forEach(function (item) {
                    if (item.parentId === id) {
                      if (item.visible) { item.setVisible(false);} else { item.setVisible(true);}
                    }
                  });
                }
              }
            }
          }
        },
        legend: {
          itemStyle: {
            color: "#000"
          }
        },
        credits: {
          enabled: false
        },
        series: [{
          name: 'Area',
          data: innerValues,
          size: "60%",
          showInLegend: true,
          dataLabels: {
            enabled: false
          }
        }, {
          name: 'Legal Area',
          data: outerValues,
          size: "80%",
          innerSize: "60%",
          dataLabels: {
            color: 'black',
            distance: 5
          }
        }]
      });


    },

    /*
      @param {array} mills An array of mill objects as part of the results, max should be 5
      @param {object} config
    */
    renderMillAssessment: function (mills, config) {

      var millTables = [],
          content = "",
          title;

      arrayUtils.forEach(mills, function (mill, index) {
        // Create Header, if mill_name exits, use that, else, loop over report.mills and find a
        // matching id and use that
        content = "";

        if (mill.mill_name) {
          title = mill.mill_name;
        } else if (report.mills) {
          arrayUtils.some(report.mills, function (millAttrs) {
            if (mill.id === millAttrs.millId) {
              title = millAttrs.label;
              return true;
            }
          });
        }

        if (title === undefined) {
          title = window.payload.title;
        }

        // Group Mill Results table if more then one mill
        if(mills.length > 1 && index == 0) {
          // Table header
          content += "<table class='mill-table-v2'><thead class='mill-table-header-v2'><tr><td class='dark' rowspan='2'></td><td class='dark' rowspan='2'>Overall Priority Level</td><td class='dark' rowspan='2'>Historic Loss</td><td class='dark' rowspan='2'>Future Potential Loss</td><td class='white span-60' colspan='6'>Environmental Indicators</td></tr>" +
            "<tr><td class='white'>Tree Cover</td><td class='white'>Primary Forest</td><td class='white'>Peat</td><td class='white'>Protected Areas</td><td class='white'>Carbon</td><td class='white'>Fires</td></tr></thead>";

          // Table body
          content += "<tbody class='mill-table-container-v2'>";
          for (var element = 0; element < mills.length; element++) {
            content += generateGroupMillRow(mills[element]);
          }

        }

        //Single Mill Result
        content += generateSingleMillTableTop(mills[index]);
        content += generateSingleMillTableBottom(mills[index]);

        millTables.push(content);

      });

      /**
        @param {string} name - Represents Name in table row
        @param {object} data - Represents segment of response
        @param {string} parentClass - (OPTIONAL) - class of parent and child
        @param {string} childClass - (OPTIONAL) - class of child, same as parent
        @return String - HTML Fragment which is a <tr>
      */
      function generateChildRow(name, data, childClass) {
        // If child is to be open by default, add open class below if parentClass is defined,
        // so data-row parent open are all in if parentClass is defined
        var rowClass = 'data-row' + (childClass ? ' child ' + childClass : '');
        var frag = "<tr class='" + rowClass + "'><td class='row-name'><span>" + name + "</span></td>";
        frag += "<td class='" + data.concession.risk + "'><span class='large-swatch'></span><span class='risk-label'>" + data.concession.risk + "</span></td>";
        // frag += "<td>" + data.concession.raw + "</td>";
        frag += "<td class='" + data.radius.risk + "'><span class='large-swatch'></span><span class='risk-label'>" + data.radius.risk + "</span></td>";
        // frag += "<td>" + data.radius.raw + "</td>";
        frag += "</tr>";
        return frag;
      }

      /**
        @param {string} name - Represents Name in table row
        @param {object} data - Represents segment of response
        @param {string} parentClass - class of parent and child
        @param {string} fieldPrefix - prefix for field name in the json to extract data from
        @return String - HTML Fragment which is a <tr>
      */
      // function generateParentRow(name, data, className, fieldPrefix) {
      //   var rowClass = 'data-row parent';
      //   var frag = "<tr class='" + rowClass + "' data-class='" + className + "'><td class='row-name'>" +
      //              "<span class='toggle-icon'></span><span>" + name + "</span></td>";
      //
      //   frag += "<td class='" + (data[fieldPrefix + '_concession'] || 'N/A') + "'><span class='large-swatch'></span><span class='risk-label'>" + (data[fieldPrefix + '_concession'] || 'N/A') + "</span></td>";
      //   frag += "<td class='" + (data[fieldPrefix + '_radius'] || 'N/A') + "'><span class='large-swatch'></span><span class='risk-label'>" + (data[fieldPrefix + '_radius'] || 'N/A') + "</span></td>";
      //   frag += "</tr>";
      //
      //   return frag;
      // }

      /**
        @param {string} name - Represents Name in table row
        @param {object} data - Represents segment of response
        @param {string} fieldPrefix - field prefix in the json to extract data from
          - some json values are nested in objects, if no fieldName is provided, this function assumes thats the case
        @return String - HTML Fragment which is a <tr>
      */
      // function generateBasicRow(name, data, fieldPrefix) {
      //   var frag = "<tr class='data-row'><td class='row-name'><span>" + name + "</span></td>";
      //   var concession = (fieldPrefix ? data[fieldPrefix + '_concession'] : data.concession.risk);
      //   var radius = (fieldPrefix ? data[fieldPrefix + '_radius'] : data.radius.risk);
      //
      //   frag += "<td class='" + concession + "'><span class='large-swatch'></span><span class='risk-label'>" + concession + "</span></td>";
      //   frag += "<td class='" + radius + "'><span class='large-swatch'></span><span class='risk-label'>" + radius + "</span></td>";
      //   frag += "</tr>";
      //
      //   return frag;
      // }

      /**
        @param {object} mill - Represents segment of response
        @return String - HTML Fragment which is <tr>
      */
      function generateGroupMillRow(mill) {
        var smallSwatch = "'><span class='small-swatch'></span>";

        var frag  = "<tr class='data-row'>";
            frag += "<td class='mill_name'><span>" + mill.mill_name + "</span></td>";
            frag += "<td class='" + mill.priority_level + smallSwatch + mill.priority_level + "</td>";
            frag += "<td class='" + mill.historic_loss + smallSwatch + mill.historic_loss + "</td>";
            frag += "<td class='" + mill.future_risk + smallSwatch + mill.future_risk + "</td>";
            frag += "<td class='" + mill.tree_cover.risk + smallSwatch + mill.tree_cover.risk + "</td>";
            frag += "<td class='" + mill.primary_forest.risk + smallSwatch + mill.primary_forest.risk + "</td>";
            frag += "<td class='" + mill.peat.risk + smallSwatch + mill.peat.risk + "</td>";
            frag += "<td class='" + mill.protected_areas.risk + smallSwatch + mill.protected_areas.risk + "</td>";
            frag += "<td class='" + mill.carbon.risk + smallSwatch + mill.carbon.risk + "</td>";
            frag += "<td class='" + mill.fire.risk + smallSwatch + mill.fire.risk + "</td>";
            frag += "</tr>";

        return frag;
      }

      /**
       @param {object} mill - Represents segment of response
       @return String - HTML Fragment which is <div> and <table>
      */
      function generateSingleMillTableTop(mill) {
        var smallSwatch = "'><span class='small-swatch'></span>";
        var millName = mill.mill_name ? mill.mill_name : 'Unknown';

        var className;

        if (mill.priority_level === 'low') {
          className = 'low';
        } else if (mill.priority_level === 'medium low') {
          className = 'medium-low';
        } else if (mill.priority_level === 'medium') {
          className = 'low';
        } else if (mill.priority_level === 'medium high') {
          className = 'medium-high';
        } else {
          className = 'high';
        }

        // var frag = '<div class="mill-header-single-title"><span class="mill-title">' + millName + '</span><span class="mill-risk-level-single-title medium"><span class="large-swatch"></span>Mill Priority: <span class="overall-risk">' + mill.priority_level + '</span></span></div>';
        var frag = "<table class='single-mill-table-header-v2'>";
        // frag += "<table class='single-mill-table-header-v2'>";
            // frag += "<tr class='single-mill-header'><th colspan='4'><span class='title'>" + millName + "</span></th><th colspan='4'><span class='title medium overall-risk'>Mill Priority: " + mill.priority_level + "</span></th></tr>";
            frag += "<tr class='single-mill-header'><div class='mill-header-single-title'><span class='mill-title'>Mill Name: " + millName + "</span><span class='mill-risk-level-single-title " + className + "'>Mill Priority: <span class='overall-risk'>" + mill.priority_level + "</span></div></tr>";

            frag += "<tr class=''>";
            frag += "<tr><th>Combined Indicator</th><th>Rank </th><th>Combined Indicator</th><th>Rank </th></tr>";
            frag += "<tr><td>Tree cover</td><td class='" + mill.tree_cover.risk + smallSwatch + mill.tree_cover.risk + "</td><td>Protected Areas</td><td class='" + mill.protected_areas.risk + smallSwatch + mill.protected_areas.risk + "</td></tr>";
            frag += "<tr><td>Primary Forest</td><td class='" + mill.primary_forest.risk + smallSwatch + mill.primary_forest.risk + "</td><td>Carbon</td><td class='" + mill.carbon.risk + smallSwatch + mill.carbon.risk + "</td></tr>";
            frag += "<tr><td>Peat</td><td class='" + mill.peat.risk + smallSwatch + mill.peat.risk + "</td><td>Fire</td><td class='" + mill.fire.risk + smallSwatch + mill.fire.risk + "</td></tr>";
            frag += "</tr>";
            frag += "</table>";

        return frag;
      }

      /**
       @param {object} mill - Represents segment of response
       @return String - HTML Fragment which is <table>
      */
      function generateSingleMillTableBottom(mill) {
        var smallSwatch = '"><span class="small-swatch"></span>';

        var frag = '<table class="single-mill-table-content-v2">';
            frag += '<thead><tr><th colspan="3" class="' + mill.historic_loss + '">Historic loss: <span class="small-swatch"></span>' + mill.historic_loss + ' Risk</th>' +
                    '<th colspan="3" class="' + mill.future_risk + '">Potential for future loss:  <span class="small-swatch"></span>' + mill.future_risk + ' Risk</th></tr>';
            frag += '<tr><td>Indicator</td><td>Rank</td><td>Amount</td><td>Indicator</td><td>Rank</td><td>Amount</td></tr></thead>';
            frag += '<tr><td>Rate of tree cover loss</td><td class="' + mill.tree_cover.loss.rank + smallSwatch + mill.tree_cover.loss.rank + '</td><td>' + Math.round(mill.tree_cover.loss.amount) + ' ha/year</td>' +
                    '<td>Rate of tree cover loss</td><td class="' + mill.tree_cover.extent.rank + smallSwatch + mill.tree_cover.extent.rank + '</td><td>' + Math.round(mill.tree_cover.extent.amount) + ' ha/year</td></tr>';
            frag += '<tr><td>Tree cover loss on primary forest</td><td class="' + mill.primary_forest.loss.rank + smallSwatch + mill.primary_forest.loss.rank + '</td><td>' + Math.round(mill.primary_forest.loss.amount) + ' ha</td>' +
                    '<td>Area in primary forest</td><td class="' + mill.primary_forest.extent.rank + smallSwatch + mill.primary_forest.extent.rank + '</td><td>' + Math.round(mill.primary_forest.extent.amount) + '%</td></tr>';
            frag += '<tr><td>Tree cover loss on peat</td><td class="' + mill.peat.loss.rank + smallSwatch + mill.peat.loss.rank + '</td><td>' + Math.round(mill.peat.loss.amount) + ' ha</td>' +
                    '<td>Area in peat</td><td class="' + mill.peat.extent.rank + smallSwatch + mill.peat.extent.rank + '</td><td>' + Math.round(mill.peat.extent.amount) + '%</td></tr>';
            frag += '<tr><td>Tree cover loss on protected areas</td><td class="' + mill.protected_areas.loss.rank + smallSwatch + mill.protected_areas.loss.rank + '</td><td>' + Math.round(mill.protected_areas.loss.amount) + ' ha</td>' +
                    '<td>Area in protected areas</td><td class="' + mill.protected_areas.extent.rank + smallSwatch + mill.protected_areas.extent.rank + '</td><td>' + Math.round(mill.protected_areas.extent.amount) + '%</td></tr>';
            frag += '<tr><td>Tree cover loss on carbon dense areas</td><td class="' + mill.carbon.loss.rank + smallSwatch + mill.carbon.loss.rank + '</td><td>' + Math.round(mill.carbon.loss.amount) + ' ha</td>' +
                    '<td>Area of high carbon density</td><td class="' + mill.carbon.extent.rank + smallSwatch + mill.carbon.extent.rank + '</td><td>' + Math.round(mill.carbon.extent.amount) + '%</td></tr>';
            frag += '<tr><td>Fire activity</td><td class="' + mill.fire.loss.rank + smallSwatch + mill.fire.loss.rank + '</td><td>' + mill.fire.loss.amount.toFixed(5) + ' fires/ha/year</td>' +
                    '<td>Rate of fire activity last two years</td><td class="' + mill.fire.extent.rank + smallSwatch + mill.fire.extent.rank + '</td><td>' + mill.fire.extent.amount.toFixed(5) + ' fires/ha/year</td></tr>';
            frag += '</table>';

        return frag;
      }


      // Add the Content, can add headerContent before millTables if we want toggle switch for raw values
      // currently the API removed raw values so we don't support it
      document.getElementById(config.rootNode + "_table").innerHTML = millTables.join('<br />');

      // Toggle Functions
      /*
        Toggle Values Columns and and set colspan to correct values for all rows
      */
      // function toggleValues() {
      //  var node = $(".toggle-button-container"),
      //      colspan = node.hasClass('active') ? 2 : 1;
      //  // Toggle the active class
      //  node.toggleClass('active');
      //  // Update the look of the table
      //  $('.mill-table-container tr.data-row td:nth-child(3)').toggle();
      //  $('.mill-table-container tr.data-row td:nth-child(5)').toggle();
      //  $('.mill-table-container tr.data-row td:nth-child(2)').attr('colspan', colspan);
      //  $('.mill-table-container tr.data-row td:nth-child(4)').attr('colspan', colspan);
      // }

      /*
        Toggle children rows display related to the current targets data-class attribute
        @param {MouseEvent} evt
      */
      function toggleChildren(evt) {
        var target = evt.currentTarget,
            dataClass = target.dataset ? target.dataset.class : target.getAttribute('data-class');

        $('.mill-table-container .data-row.child.' + dataClass).toggle();
        $(target).toggleClass('open');
      }

      // Set up Click Listeners to give table custom toggling functionality and show information on info classes
      $(".mill-table-container tr.parent").click(toggleChildren);
      $(".mill-table-container .info-icon").click(this.showMillPointInfo);
      $('#mill-download').click(function () {
        // Pass in the mills and an array of descriptors for the CSV format
        var csvData = CSVExporter.prepareMillAnalysis(mills, ReportConfig.millCSVDescriptor);
        CSVExporter.exportCSV(csvData);
      });

      // Hide children by default
      $('.mill-table-container .data-row.child').toggle();

    },

    /*
        Show popup dialog with information relating to the value of the target's data-type attribute
        @param {MouseEvent} evt
      */
    showMillPointInfo: function (evt) {
      var target = evt.currentTarget,
          type = target.dataset ? target.dataset.type : target.getAttribute('data-type'),
          config = ReportConfig.millPointInfo[type],
          dialog;

      dialog = new Dialog({
        title: config.title,
        content: config.content,
        style: "width: 300px;"
      });

      dialog.show();
    },

    /*
      Add No Data Available Text to the Appropriate location
      @param {string} type --> Options = loss, clearance, mill
      @param {object} config
    */
    renderAsUnavailable: function (type, config) {
      var node = document.getElementById(config.rootNode + '_' + type),
          msg = "";

      if (type === 'loss') {
        msg = "No tree cover loss detected.";
      } else if (type === 'clearance') {
        msg = "No clearance alerts occured in this area.";
      } else if (type === 'composition') {
        msg = config.errors && config.errors.composition || "No Composition Analysis Data Available for this site.";
      } else if (type === 'prodes') {
        msg = 'No data available for this site.';
      } else {
        msg = "No data available for this site.";
      }

      if (node) {
        node.innerHTML = msg;
      }
    }

  };

});

define('report/riskRequests',[
	"dojo/Deferred",
	"esri/tasks/QueryTask",
    "esri/tasks/query",
    "esri/tasks/ImageServiceIdentifyTask",
    "esri/tasks/ImageServiceIdentifyParameters",
    "esri/tasks/StatisticDefinition",
    "esri/request",
    "esri/tasks/AreasAndLengthsParameters",
    "esri/tasks/GeometryService",
    "esri/SpatialReference",
    "esri/tasks/ProjectParameters",
    "esri/tasks/BufferParameters"
	// "core/config",
 //    "core/toolkitController",
 //    "core/modelSaveController"
],
function(
    Deferred,
	QueryTask,
    Query,
    ImageServiceIdentifyTask,
    ImageServiceIdentifyParameters,
    StatisticDefinition,
    esriRequest,
    AreasAndLengthsParameters,
    GeometryService,
    SpatialReference,
    ProjectParameters,
    BufferParameters
) {

    var o = {};

    var obj_to_esriParams = function(esriParamTarget, obj){
        for (param in obj){
            if (obj.hasOwnProperty(param)){
                if (obj[param]){
                    esriParamTarget[param] = obj[param];
                }
            }
        }

        return esriParamTarget
    }

    var getGeometryUnits = function(params){
        params.lengthUnit = GeometryService[params.lengthUnit];
        params.areaUnit = GeometryService[params.areaUnit];
        return params;
    }



    var execute_task = function(task,params,execution){
        var deferred = new Deferred();

        execution = execution || 'execute';

        task[execution](params, function(results){
            deferred.resolve(results);
        },
        function(err){
            deferred.resolve(err);
        });
        return deferred;
    }

    o.getAreasLengths = function(url,params){
        var deferred = new Deferred();
        params = getGeometryUnits(params);
        var al_params = obj_to_esriParams(new AreasAndLengthsParameters(),params);
        var geometryService = new GeometryService(url);
        geometryService.areasAndLengths(al_params).then(function(results){
            deferred.resolve(results);
        })
        return deferred
    }

    o.project = function(url,params,outWkid){
        var deferred = new Deferred();
        params.outSR = new SpatialReference(outWkid)
        var geometryService = new GeometryService(url);

        var projParams = obj_to_esriParams(new ProjectParameters(),params);
        geometryService.project(projParams).then(function(results){
            deferred.resolve(results);
        });
        return deferred
    }

    o.buffer = function(url,params,wkid){
        var deferred = new Deferred();
        var bufferParams = obj_to_esriParams(new BufferParameters(),params);
        bufferParams.unit = GeometryService[params.unit];
        bufferParams.spatialReference = params.geometries[0].spatialReference;
        bufferParams.outSpatialReference = new SpatialReference(wkid);
        var geometryService = new GeometryService(url);
        geometryService.buffer(bufferParams).then(function(results){
            deferred.resolve(results);
        });
        return deferred
    }

    o.loadServiceInfo = function(url){
        var deferred = new Deferred();
        var layersRequest = esri.request({
          url: url,
          content: { f: "json" },
          handleAs: "json"
        });
        layersRequest.then(
          function(response) {
            console.log("Success: ", response.layers);
            deferred.resolve(response);
        }, function(error) {
            console.log("Error: ", error.message);
            deferred.resolve(error);

        });

        return deferred;
    }

    o.queryForStats = function(url, params, statdefs){
        //Create StatisticDefinition object for a query,
        //then query layer
        var deferred = new Deferred();
        var statDefArray = statdefs.map(function(def){
            return obj_to_esriParams(new StatisticDefinition(),def);
        })
        params.outStatistics = statDefArray;
        return o.queryEsri(url, params)

    }

    o.queryEsri = function(url, params, execution) {
    	var queryTask = new QueryTask(url);
        var query = obj_to_esriParams(new Query(), params);

    	var deferred = execute_task(queryTask,query,execution);
        return deferred
    };



    o.computeHistogram = function(url, content) {
            return esriRequest({
                url: url + '/computeHistograms',
                content: content,
                handleAs: 'json',
                callbackParamName: 'callback',
                timeout: 60000
            }, {
                usePost: true
            });
    };


    o.queryJson = function() {



    };

    return o;
});

define('report/riskController',[
  'lodash',
  'dojo/Deferred',
  'dojo/promise/all',
  'dojo/_base/lang',
  'esri/geometry/geometryEngine',
  'esri/geometry/Polygon',
  'report/riskRequests',
  'report/config'
  // "app/riskRequests",
  // "app/testconfig"
], function (_, Deferred, all, lang, geoEngine, Polygon, riskRequest, config) {

    var o = {};
    // Polygon Geometry, Area of Geometry, Area Type, RSPO Status, Is it in Indonesia

    // var eckert = 54012;
    var webmercator = 102100;
    var risk_labels = ['', 'low', 'medium', 'high'];
    config.carbonDensity = {rasterId: '$560'};


    var services = {
        commodities: 'http://gis-gfw.wri.org/arcgis/rest/services/image_services/analysis/ImageServer',
        fires: 'https://gis-gfw.wri.org/arcgis/rest/services/Fires/FIRMS_ASEAN/MapServer/0',
        concessions: 'http://gis-gfw.wri.org/arcgis/rest/services/CommoditiesAnalyzer/moremaps_EN/MapServer/27'
    };

    o.getRiskByGeometry = function(geometry, area, areaType, rspo, indonesia, riskResults, concessions){
        var featureArea = area;
    //Helper functions
        var getRiskByBreaks = function(low, high, value){
            if (value > high){
                return 3;
            }
            else if (value <= low){
                return 1;
            }
            return 2;
        };

        var getRiskByBreaksCallback = function(low, high){
            return function(results){
                if(!results.histograms[0]){
                    return 1;
                }
                var value = results.histograms[0].counts[1] || 0;
                if (value > high){
                    return 3;
                }
                else if (value <= low){
                    return 1;
                }
                return 2;
            };
        };

        var getRiskByAreaBreaks = function(low, high, pixelSize){
            return function(results){
                if(!results.histograms[0]){
                    return getRiskByBreaks(low, high, 0);
                }
                var counts = results.histograms[0].counts[1] || 0;

                var countArea = countsToArea(counts, pixelSize);
                var riskFactor = countArea / featureArea;

                // var breaks = {low: low, high: high};
                // console.log(breaks,areaType, counts, area, featureArea, riskFactor)
                return getRiskByBreaks(low, high, riskFactor);
            };

        };

        var getHighRiskIfPresent = function(results){
                if (!results.histograms.length ){
                    return 1;
                }
                var counts = results.histograms[0].counts[1];

                if (counts > 0){
                    return 3;
                }
                return 1;
        };

        var getCarbonHighRiskIfPresent = function(results){
                if (!results.histograms.length){
                    return 1;
                }
                var counts = results.histograms[0].counts;
                if(counts[2]){
                    return 3;
                }
                if(counts[1]){
                    return 3;
                }
                return 1;
        };

        var remapRule = function(inputRanges, outputValues, rasterId){
            return {
                      'rasterFunction': 'Remap',
                      'rasterFunctionArguments': {
                        'InputRanges': inputRanges, //[0,1, 1,2014],
                        'OutputValues': outputValues, //[0, 1],
                        'Raster': rasterId,
                        'AllowUnmatched': false
                      },
                      'variableName': 'Raster'
            };
        };

        var remapLoss = function(rasterId){
            return remapRule([0, 1, 1, 14], [0, 1], rasterId);
        };

        var remapAlerts = function(rasterId){
            return remapRule([1, 22], [1], rasterId);
        };

        var remapHighCarbonDensity = function(rasterId){
            return remapRule([0, 100, 100, 200, 200, 300, 300, 400, 400, 500, 500, 1000], [1, 2, 3, 4, 5, 6], rasterId);
        };

        var arithmeticRule = function(raster1, raster2, operation){
            return {
                     'rasterFunction': 'Arithmetic',
                     'rasterFunctionArguments': {
                        'Raster': raster1,
                        'Raster2': raster2,
                        'Operation': operation
                     }
                 };
        };

        var lockRaster = function(rasterId){
            return {
                      'mosaicMethod': 'esriMosaicLockRaster',
                      'lockRasterIds': [parseInt(rasterId.replace('$', ''))],
                      'ascending': true,
                      'mosaicOperation': 'MT_FIRST'
                    };
        };

        var countsToArea = function(count, pixelSize){
            var pixelArea = pixelSize * pixelSize;
            var sqm = count * pixelArea;
            // var area = sqm/10000;
            return sqm;
        };

        var methods = {
            histogram: riskRequest.computeHistogram,
            query: riskRequest.queryEsri
        };


        // var riskRequst = function(url, method, params){
        //
        // };

        var priority_breaks = {low: 7, high: 12};

        var priorities = [
            {
                'label': 'legal',
                categories: ['legal'],
                'singleIndicator': true
            },
            {
                'label': 'deforestation',
                // categories: [
                //     'umd_loss',
                //     // 'area_primary',
                //     'umd_loss_primary',
                //     'forma',
                //     'forma_primary',
                //     // 'forma_peat',
                //     'loss_carbon'/*, 'area_carbon','area_carbon','alerts_carbon'*/],
                // // categories: ['area_carbon'],
                high: 21,
                low: 13
                // high: 27,
                // low: 21
            },
            // {
            //     'label': 'Carbon',
            //     categories: ['loss_carbon','alerts_carbon','area_carbon']
            // },
            {
                'label': 'peat',
                // categories: ['loss_peat_area','peat_alerts','peat_presence'],
                high: 7,
                low: 4
                // high: 7,
                // low: 4
            },
            {
                'label': 'rspo',
                categories: ['rspo']
            },
            {
                'label': 'fire',
                categories: ['fire'],
                'singleIndicator': true
            }
        ];

        var categories = [

                {
                    // key: 'loss_carbon',
                    key: 'carbon',
                    category: 'deforestation',
                    service: services.commodities,
                    request: methods.histogram,
                    params: {
                        renderingRule: arithmeticRule(
                            remapLoss(config.treeCoverLoss.rasterId),
                            remapRule(
                                [0, 100, 100, 200, 200, 300, 300, 400, 400, 500, 500, 1000],
                                [1, 2, 3, 4, 5, 6],
                                config.carbonDensity.rasterId
                            ),
                            3
                        ),
                        pixelSize: 100
                    },
                    callbacks: {
                        'radius': getCarbonHighRiskIfPresent,
                        'concession': getCarbonHighRiskIfPresent
                    }
                },

                {
                    key: 'forma',
                    category: 'deforestation',
                    service: services.commodities,
                    request: methods.histogram,
                    params: {
                        // mosaicRule: lockRaster(config.clearanceAlerts.rasterId),
                        renderingRule: remapAlerts(config.clearanceAlerts.rasterId),
                        pixelSize: 500
                    },
                    callbacks: {
                        'radius': getRiskByBreaksCallback(1, 250 * .02),
                        'concession': getRiskByBreaksCallback(25, 295)
                    }
                },

                {
                    key: 'forma_carbon',
                    category: 'deforestation',
                    service: services.commodities,
                    request: methods.histogram,
                    params: {
                        renderingRule: arithmeticRule(
                                remapAlerts(config.clearanceAlerts.rasterId),
                                remapHighCarbonDensity(config.carbonDensity.rasterId),
                                3
                            ),
                        pixelSize: 30
                    },
                    callbacks: {
                        'radius': getHighRiskIfPresent,
                        'concession': getHighRiskIfPresent
                    }
                },

                {
                    key: 'area_carbon',
                    category: 'deforestation',
                    service: services.commodities,
                    request: methods.histogram,
                    params: {
                        renderingRule: remapHighCarbonDensity(config.carbonDensity.rasterId),
                        pixelSize: 30
                    },
                    callbacks: {
                        'radius': getRiskByAreaBreaks(0.747, 0.913, 30),
                        'concession': getRiskByAreaBreaks(0, .2, 30)
                    }
                },

                {
                    key: 'area_primary',
                    category: 'deforestation',
                    service: services.commodities,
                    request: methods.histogram,
                    ind_params: {
                        renderingRule: remapRule([0, 1, 1, 3], [0, 1], config.primaryForest.rasterId),
                        pixelSize: 100
                    },
                    params: {
                        renderingRule: remapRule([0, 1, 1, 3], [0, 1], config.intactForest.rasterId),
                        pixelSize: 100
                    },
                    callbacks: {
                        'radius': getRiskByAreaBreaks(.12, .18, 100),
                        'concession': getRiskByAreaBreaks(0, .2, 100)
                    }
                },

                {
                    key: 'forma_primary',
                    category: 'deforestation',
                    service: services.commodities,
                    request: methods.histogram,
                    ind_params: {
                            renderingRule: arithmeticRule(
                                remapAlerts(config.clearanceAlerts.rasterId),
                                remapRule([1, 3], [1], config.primaryForest.rasterId),
                                3
                            ),
                            pixelSize: 30
                        },
                    params: {
                            renderingRule: arithmeticRule(
                                remapAlerts(config.clearanceAlerts.rasterId),
                                config.intactForest.rasterId,
                                3
                            ),
                            pixelSize: 30
                        },
                    callbacks: {
                        'radius': getHighRiskIfPresent,
                        'concession': getHighRiskIfPresent
                    }
                },

                {
                    key: 'umd_loss',
                    category: 'deforestation',
                    service: services.commodities,
                    request: methods.histogram,
                    params: {
                        renderingRule: remapLoss(config.treeCoverLoss.rasterId),
                        pixelSize: 30
                    },
                    callbacks: {
                        'radius': getRiskByAreaBreaks(.05 * .02, .28 * .02, 30),
                        'concession': getRiskByAreaBreaks(.05, .28, 30)
                    }
                },

                {
                    key: 'umd_loss_primary',
                    category: 'deforestation',
                    service: services.commodities,
                    request: methods.histogram,
                    ind_params: {
                            renderingRule: arithmeticRule(
                                remapLoss(config.treeCoverLoss.rasterId),
                                config.primaryForest.rasterId,
                                3
                            ),
                            pixelSize: 100
                        },
                    params: {
                            renderingRule: arithmeticRule(
                                remapLoss(config.treeCoverLoss.rasterId),
                                config.intactForest.rasterId,
                                3
                            ),
                            pixelSize: 100
                        },
                    callbacks: {
                        'radius': getHighRiskIfPresent,
                        'concession': getHighRiskIfPresent
                    }
                },

                {
                    key: 'fire',
                    category: 'fire',
                    service: services.fires,
                    request: methods.query,
                    params: {
                            where: 'BRIGHTNESS>=330 AND CONFIDENCE>=30',
                            geometry: ''
                    },
                    execution: 'executeForCount',

                    callback: function(results){

                        if (results > 0){
                            return 3;
                        }
                        return 1;

                    },
                    callbacks: {
                        'radius': function(results){

                            if (results > 0){
                                return 3;
                            }
                            return 1;

                        },
                        'concession': function(results){

                            if (results > 0){
                                return 3;
                            }
                            return 1;

                        }
                    }
                },

                {
                    key: 'legal',
                    category: 'legal',
                    service: services.commodities,
                    request: methods.histogram,
                    ind_params: {
                            renderingRule: remapRule(
                                                        [0, 1, 1, 2, 2, 3, 3, 4, 4, 7],
                                                        [1, 0, 1, 0, 1],
                                                        config.legalClass.rasterId
                                                    ),
                            pixelSize: 100
                        },
                    params: {
                            renderingRule: lockRaster(config.protectedArea.rasterId),
                            pixelSize: 100
                    },

                    callbacks: {
                        'radius': getHighRiskIfPresent,
                        'concession': getHighRiskIfPresent
                    },

                    ind_callback: getHighRiskIfPresent
                },

                {
                    // key: 'loss_peat_area',
                    key: 'clearance',
                    category: 'peat',
                    service: services.commodities,
                    request: methods.histogram,

                    params: {
                        renderingRule: arithmeticRule(
                            remapLoss(config.treeCoverLoss.rasterId),
                            config.peatLands.rasterId,
                            3
                        ),
                        pixelSize: 100
                    },
                    callbacks: {
                        'radius': getHighRiskIfPresent,
                        'concession': getHighRiskIfPresent
                    }
                },

                {
                    key: 'alerts',
                    category: 'peat',
                    service: services.commodities,
                    request: methods.histogram,
                    params: {
                            renderingRule: arithmeticRule(
                                remapAlerts(config.clearanceAlerts.rasterId),
                                config.peatLands.rasterId,
                                3
                            ),
                            pixelSize: 100
                        },
                    callbacks: {
                        'radius': getHighRiskIfPresent,
                        'concession': getHighRiskIfPresent
                    }
                },

                {
                    key: 'presence',
                    category: 'peat',
                    service: services.commodities,
                    request: methods.histogram,
                    params: {
                        // mosaicRule: lockRaster(config.peatLands.rasterId),
                        renderingRule: remapRule([0, 1, 1, 2], [0, 1], config.peatLands.rasterId),
                        pixelSize: 100
                    },

                    callbacks: {
                        'radius': getRiskByAreaBreaks(.9 * 0.0059, 1.1 * 0.0063), //getRiskByAreaBreaks(0.02,0.05,100),//
                        'concession': getRiskByAreaBreaks(.9 * 0.0059, 1.1 * 0.0063) //getRiskByAreaBreaks(0.02,0.05,100)//getRiskByAreaBreaks(0.0059,0.0063)
                    }

                }


        ];

        var getCategoryByKey = function(key){
            var grouped = _.groupBy(categories, 'key');
            var key = grouped[key][0].category;

            return key;
        };

        var calculatePriority = function(results, areaType){
            // Need a clone because if this gets called multiple times, multiple keys get embedded
            var clonedPriorities = lang.clone(priorities);
            var priority_level = 0;

            _.forIn(results,function(value, innerKey){

                var category = getCategoryByKey(innerKey);
                if (!riskResults[category]){
                    riskResults[category] = {};
                }

                var single = _.result(_.find(priorities, {'label': category}), 'singleIndicator')
                if(single){
                    riskResults[category][areaType] = {risk: risk_labels[value]};
                    priority_level += value;
                }
                else{
                    if(!riskResults[category][innerKey]){
                        riskResults[category][innerKey] = {};
                    }
                    riskResults[category][innerKey][areaType] = {risk: risk_labels[value]};
                }

            });


            clonedPriorities.forEach(function(priority){
                var total = 0;
                if(!priority.high){
                    return;
                }
                // else if(priority.label === 'RSPO'){
                //     priority.risk =
                // }
                var cats = [];

                var categores = _.pluck(_.groupBy(categories, 'category')[priority.label], 'key');
                categories.forEach(function(cat){
                    total += results[cat];
                    priority_level += results[cat];
                    cats.push({ 'key': cat, 'risk': results[cat] });
                });
                priority.categories = cats;
                var risk = getRiskByBreaks(priority.high, priority.low, total);

                var category = priority.label;
                    priority.risk = risk;
                    if (!riskResults[category]){
                        riskResults[category] = {};
                    }
                    var key = priority.label + '_' + areaType;
                    riskResults[category][key] = risk_labels[risk];
            });
            priority_level = getRiskByBreaks(priority_breaks.low, priority_breaks.high, priority_level);
            riskResults['priority_level_' + areaType] = risk_labels[priority_level];
            if (priority_level > riskResults['total_mill_priority_level']){
                riskResults['total_mill_priority_level'] = priority_level;
            }
            return riskResults;
        };


        var final_deferred = new Deferred();
        rspo = rspo;
        indonesia = indonesia;
        riskResults['total_mill_priority_level'] = riskResults['total_mill_priority_level'] || 0;
        // riskResults['priority_level'] = riskResults['priority_level'] || 0;


        var promises = [];
        if(!geometry){
            var riskObj = {};
            _.pluck(categories, 'key').forEach(function(key){
                riskObj[key] = 0;
            });
            calculatePriority(riskObj, areaType);
            final_deferred.resolve(riskObj);

            return final_deferred.promise;
        }

        var splitConcessions = function(geometries, category, params, deferred){
            var promises = geometries.map(function(geometry){
                params.geometry = JSON.stringify(geometry);
                return category.request(category.service, params, category.execution);
            });

            all(promises).then(function(results){
                var output = {histograms: [{counts: []}]};
                var countsArr = _.pluck(_.flatten(_.pluck(results, 'histograms')), 'counts');

                countsArr.forEach(function(counts){
                    counts.forEach(function(count, index){

                        output.histograms[0].counts[index] = output.histograms[0].counts[index] || 0;
                        output.histograms[0].counts[index] += count;
                    });
                });
                var obj = {};
                // var callback = indonesia && category.ind_callback ? category.ind_callback : category.callback;
                var callback = category.callbacks[areaType];
                category.results = output;
                obj[category.key] = callback(output, deferred);
                deferred.resolve(obj);

            }, function(err){
                console.log('SPLIT ERROR', err);
            });
        };

        categories.forEach(function(category){
            var deferred = new Deferred();
            var params = indonesia && category.ind_params ? category.ind_params : category.params;

            if (category.request === riskRequest.computeHistogram){
                params.renderingRule = JSON.stringify(params.renderingRule);
                params.mosaicRule = params.mosaicRule ? JSON.stringify(params.mosaicRule) : '';
                params.geometryType = 'esriGeometryPolygon';
                params.geometry = JSON.stringify(geometry);

            }
            else {
                params.geometry = geometry;
            }
            params.f = 'json';
            category.request(category.service, params, category.execution).then(function(results){
                var obj = {};
                // var callback = indonesia && category.ind_callback ? category.ind_callback : category.callback;
                var callback = category.callbacks[areaType];
                category.results = results;
                obj[category.key] = callback(results, deferred);
                deferred.resolve(obj);
            }, function(err){
                console.log('HISTOGRAM ERROR', err);
                if(concessions){
                    splitConcessions(concessions, category, params, deferred);
                }
            });
            promises.push(deferred.promise);
        });

        all(promises).then(function(results){
            var data = {};
            results.forEach(function(result){
                lang.mixin(data, result);
            });
            console.log('calculatePriority')
            var priorities = calculatePriority(data, areaType);
            final_deferred.resolve(priorities);
        });

        return final_deferred.promise;
    };

    o.getGeometryArea = function(url, geometry){
        var deferred = new Deferred();
            // var area = 147156063.470948//geoEngine.planarArea(simplify)
            var params = {
                areaUnit: 'UNIT_SQUARE_METERS',
                lengthUnit: 'UNIT_METERS',
                calculationType: 'geodesic',
                polygons: [geometry]
            };
            riskRequest.getAreasLengths(url, params).then(function(results){
                deferred.resolve(results.areas[0]);
            });
        return deferred;
    };

    o.getConcessionRisk = function(radiusGeometry, rspo, indonesia, riskResults){
        var deferred = new Deferred();
        var url = services.concessions;
        var poly = new Polygon(radiusGeometry);
        var params = {
            geometry: poly,
            where: "CERT_SCHEME = 'RSPO' AND TYPE = 'Oil palm concession'",
            outFields: ['OBJECTID'],
            returnGeometry: true
        };

        riskRequest.queryEsri(url, params).then(function(results){
            var url = config.geometryServiceUrl;
            var geometries = results.features.map(function(feature){
                return feature.geometry;
            });
            if (geometries.length < 1){
                // var riskObj = {};
                o.getRiskByGeometry(false, 0, 'concession', rspo, indonesia, riskResults);
                deferred.resolve();
                return;
            }
            var union = geoEngine.union(geometries);
            var simplify = geoEngine.simplify(union);
            var poly = new Polygon(simplify);

            var params = {
                geometries: [poly]
            };

            riskRequest.project(url, params, webmercator).then(function(results) {
                var projPoly = new Polygon(results[0]);

                o.getGeometryArea(url, projPoly).then(function(geomArea){
                        var task = o.getRiskByGeometry(results[0], geomArea, 'concession', rspo, indonesia, riskResults, geometries);
                        task.then(function(){
                            deferred.resolve();
                        });
                });
            });

        });
        return deferred;
    };

    o.printProjectGeom = function(geom){
         var url = config.geometryServiceUrl;
            // var union = geoEngine.union(geometries);
            // var simplify = geoEngine.simplify(union);
            var poly = new Polygon(geom);

            var params = {
                geometries: [poly]
            };

            riskRequest.project(url, params, 102100).then(function(results){
                console.log('BUFFER GEOM', JSON.stringify(results[0]));
            });
    };

    o.getRadiusBuffer = function(point, distance){
        var url = config.geometryServiceUrl;

        var deferred = new Deferred();

        var buffParams = {
            unit: 'UNIT_KILOMETER',
            distances: [distance],
            geometries: [point]
        };
        riskRequest.buffer(url, buffParams, webmercator).then(function(results){
            var buffPoly = results[0];
            o.getGeometryArea(url, buffPoly).then(function(area){
                    deferred.resolve({geometry: results[0], area: area});
            });
            // o.printProjectGeom(buffPoly);
        });
        return deferred;
    };

    o.getRisk = function(point, distance, rspo, indonesia){
        var deferred = new Deferred();
        var riskResults = {};

        o.getRadiusBuffer(point, distance).then(function(results){
            var area = distance * 1000 * distance * 1000 * Math.PI; //results.area;
            var radius = results.geometry;
            var rad = o.getRiskByGeometry(radius, area, 'radius', rspo, indonesia, riskResults);
            var con = o.getConcessionRisk(radius, rspo, indonesia, riskResults);

            all([rad, con]).then(function(){
                riskResults['total_mill_priority_level'] = risk_labels[riskResults['total_mill_priority_level']];
            deferred.resolve(lang.clone(riskResults));
        });

        });

        return deferred;
    };

    return o;
    // return final_deferred;
});

define('report/RiskHelper',[
  'report/config',
  'dojo/Deferred',
  'dojo/_base/lang',
  'dojo/promise/all',
  'dojo/_base/array',
  'esri/tasks/query',
  'esri/tasks/QueryTask',
  'report/riskController',
  'esri/geometry/geometryEngine',
], function (ReportConfig, Deferred, lang, all, arrayUtils, Query, QueryTask, RiskController, geometryEngine) {
  'use strict';

  /** 
  * To Perform Risk Analysis, for each feature, I need area to know if it is in Indonesia
  */

  var Helper = {

    /**
    * @param {array} features - An Array of Mill Objects containing geometry, label, type, and isCustom
    * @retrun {object} promise - Return a promise that will be resolved with all the necessary information to 
    *                            use the 'report/riskController' method
    */
    prepareFeatures: function (features) {
      var mainDeferred = new Deferred(),
          promises = [],
          self = this;

      arrayUtils.forEach(features, function (feature) {
        var featureDeferred = new Deferred();

        self.getAreaAndIndoIntersect(feature).then(function (data) {

          featureDeferred.resolve({
            feature: data.feature,
            // area: data.area,
            inIndonesia: data.inIndonesia
          });

        });

        promises.push(featureDeferred.promise);
      });

      all(promises).then(function (results) {

        self.performAnalysis(results).then(function (mills) {
          mainDeferred.resolve(mills);
        });

      });

      return mainDeferred.promise;
    },

    /**
    * Get Area of Feature and Determine if the Feature intersects with Indonesia
    * @param {object} feature - Mill Object containing geometry, label, type, and isCustom props
    * @return {object} promise - Return a promise that will be resolved when the queries are complete
    */
    getAreaAndIndoIntersect: function (feature) {
      var mainDeferred = new Deferred();

      // var area = this.getArea(feature.geometry);

      this.getIntersectionStatus(feature).then(function (intersectionStatus) {

        mainDeferred.resolve({
          feature: feature,
          // area: area,
          inIndonesia: intersectionStatus
        });

      });

      return mainDeferred.promise;
    },

    /**
    * @param {object} geometry - Geometry of feature to get area for, feature should be in web mercator
    * @return {object} promise - Return a promise that will resolve with an unformatted area, up to the caller to format
    */
    getIntersectionStatus: function (feature) {
      var deferred = new Deferred(),
          query,
          task;

      task = new QueryTask(ReportConfig.boundariesUrl);
      query = new Query();
      query.returnGeometry = true;
      query.outFields = ['OBJECTID'];
      query.where = "ISO3 = 'IDN'";
      query.geometryPrecision = 1;

      task.execute(query, function (result) {
        var indoBounds = result.features[0] && result.features[0].geometry;
        deferred.resolve(geometryEngine.contains(indoBounds, feature.geometry));
      }, function (error) {
        deferred.resolve(false);
      });

      return deferred.promise;
    },

    /**
    * @param {object} featureObjects - Objects containing a mill point feature object, area, and isIndonesia property
    * @return {object} promise - Return a promise that will resolve with custom mill analysis objects
    */
    performAnalysis: function (featureObjects) {
      var deferred = new Deferred(),
          self = this,
          promises = [],
          inIndonesia,
          geometry,
          buffer,
          // area,
          rspo;
      
      arrayUtils.forEach(featureObjects, function (featureObj) {
        var featureDeferred = new Deferred();

        rspo = featureObj.feature.isRSPO || false;
        geometry = featureObj.feature.geometry.getExtent().getCenter();
        inIndonesia = featureObj.inIndonesia;
        // area = featureObj.area;
        buffer = JSON.parse(featureObj.feature.buffer);

        all([
          RiskController.getRisk(geometry, buffer, rspo, inIndonesia)
        ]).then(function (results) {

          featureDeferred.resolve({
            feature: featureObj.feature,
            results: results
          });

        });

        promises.push(featureDeferred);

      });

      all(promises).then(function (resultSets) {
        var mills = self.formatData(resultSets);
        deferred.resolve(mills);
      });

      return deferred.promise;

    },

    /**
    * Take some results and put them in the correct format for our templating function
    * @param {object} resultSets - Result Sets include a mill feature object and results containing arrays of results
    * @return {array} mills - array of mills
    */
    formatData: function (resultSets) {
      var mills = [],
          riskObject;

      arrayUtils.forEach(resultSets, function (resultObj) {

        // All these values need to be filled in
        riskObject = lang.clone(resultObj.results[0]);
        riskObject.id = resultObj.feature.millId;
        riskObject.rspo = { risk: resultObj.feature.isRSPO };

        mills.push(riskObject);

      });

      return mills;
    }

  };

  return Helper;

});

define('report/Suitability',[
	// Esri Modules
	"esri/request",
	"esri/tasks/query",
	"esri/tasks/QueryTask",
	"esri/geometry/Polygon",
	// My Modules
	"report/config",
  "utils/Analytics",
	// Dojo Modules
	"dojo/Deferred",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/promise/all",
	"report/CSVExporter"
], function (esriRequest, Query, QueryTask, Polygon, ReportConfig, Analytics, Deferred, lang, arrayUtils, all, CSVExporter) {	

	return {

		getSuitabilityData: function () {
			var deferred = new Deferred(),
					self = this;

			function complete(data) {
				deferred.resolve(data);
				// Attach Events for Downloading certain data as CSV data
				self.attachEvents();
			}

			all([
				this.getSuitableAreas(),
				this.getLCHistogramData(),
				this.getRoadData(),
				this.getConcessionData(),
				this.computeLegalHistogram()
			]).then(complete);

			return deferred.promise;
		},

		attachEvents: function () {
			$("#suitability-table-csv").click(this.downloadSuitabilityTable);
			$("#suitability-settings-csv").click(this.downloadSuitabiltiySettings);
		},

		downloadSuitabilityTable: function () {
			var lineEnding = '\r\n',
					csvStringData,
					csvData;

			csvData = CSVExporter.exportSuitabilityStatistics();
			csvStringData = csvData.join(lineEnding);
			CSVExporter.exportCSV(csvStringData);
      Analytics.sendEvent('Event', 'Download CSV', 'User downloaded Suitability results table.');
		},

		downloadSuitabiltiySettings: function () {
			CSVExporter.exportCSV(payload.suitability.csv);
      Analytics.sendEvent('Event', 'Download CSV', 'User downloaded Suitability settings.');
		},

		getSuitableAreas: function (pixelSize) {
			var deferred = new Deferred(),
					renderRule = lang.clone(report.suitable.renderRule),
					url = ReportConfig.suitability.url,
					self = this,
					params = {
						f: 'json',
						pixelSize: ReportConfig.pixelSize,
						geometryType: ReportConfig.suitability.geometryType,
						geometry: JSON.stringify(report.geometry)
					},
					payload = {};

			renderRule.rasterFunction = ReportConfig.suitability.rasterFunction;
			params.renderingRule = JSON.stringify(renderRule);

			function success(res) {
				if (res.histograms.length > 0) {
					payload.data = res.histograms[0];
					payload.pixelSize = params.pixelSize;
					deferred.resolve(payload);
				} else {
					deferred.resolve(false);
				}
			}

			function failure(err) {
				if (err.details) {
					if (err.details[0] === 'The requested image exceeds the size limit.' && params.pixelSize !== 500) {
						params.pixelSize = 500;
						self.getHistogram(url, params, success, failure);
					} else {
						deferred.resolve(false);
					}
				} else {
					deferred.resolve(false);
				}
			}

			this.getHistogram(url, params, success, failure);
			return deferred.promise;
		},

		getLCHistogramData: function () {
			var deferred = new Deferred(),
					config = ReportConfig.suitability.lcHistogram,
					renderRule = config.renderRule,
					url = ReportConfig.suitability.url,
					self = this,
					params = {
						f: 'json',
						pixelSize: ReportConfig.pixelSize,
						geometryType: ReportConfig.suitability.geometryType,
						geometry: JSON.stringify(report.geometry),
						renderingRule: JSON.stringify(renderRule)
					},
					payload = {};

			function success(res) {
				if (res.histograms.length > 0) {
					payload.data = res.histograms[0];
					payload.pixelSize = params.pixelSize;
					deferred.resolve(payload);
				} else {
					deferred.resolve(false);
				}
			}

			function failure(err) {
				if (err.details) {
					if (err.details[0] === 'The requested image exceeds the size limit.' && params.pixelSize !== 500) {
						params.pixelSize = 500;
						self.getHistogram(url, params, success, failure);
					} else {
						deferred.resolve(false);
					}
				} else {
					deferred.resolve(false);
				}
			}

			this.getHistogram(url, params, success, failure);
			return deferred.promise;
		},

		getRoadData: function () {
			var deferred = new Deferred(),
					config = ReportConfig.suitability.roadHisto,
					url = ReportConfig.suitability.url,
					mosaicRule = config.mosaicRule,
					self = this,
					params = {
						f: 'json',
						pixelSize: ReportConfig.pixelSize,
						geometryType: ReportConfig.suitability.geometryType,
						geometry: JSON.stringify(report.geometry),
						mosaicRule: JSON.stringify(mosaicRule)
					},
					payload = {};

			function success(res) {
				if (res.histograms.length > 0) {
					payload.data = res.histograms[0];
					payload.pixelSize = params.pixelSize;
					deferred.resolve(payload);
				} else {
					deferred.resolve(false);
				}
			}

			function failure(err) {
				if (err.details) {
					if (err.details[0] === 'The requested image exceeds the size limit.' && params.pixelSize !== 500) {
						params.pixelSize = 500;
						self.getHistogram(url, params, success, failure);
					} else {
						deferred.resolve(false);
					}
				} else {
					deferred.resolve(false);
				}
			}

			this.getHistogram(url, params, success, failure);
			return deferred.promise;
		},

		getConcessionData: function () {
			var deferred = new Deferred(),
					config = ReportConfig.suitability.concessions,
					query = new Query(),
					queryTask = new QueryTask(config.url + "/" + config.layer);

			query.returnGeometry = false;
			query.geometry = new Polygon(report.geometry);
			queryTask.executeForCount(query, function (count) {
				deferred.resolve({
					value: (count > 0) ? 'Yes' : 'No'
				});
			}, function (err) {
				deferred.resolve(false);
			});

			return deferred.promise;
		},

		computeLegalHistogram: function () {
			var deferred = new Deferred(),
					suitRenderRule = lang.clone(report.suitable.renderRule),
					config = ReportConfig.suitability.lcHistogram,
					targetRule = config.renderRuleSuitable,
					url = ReportConfig.suitability.url,
					self = this,
					params = {
						f: 'json',
						pixelSize: ReportConfig.pixelSize,
						geometryType: ReportConfig.suitability.geometryType,
						geometry: JSON.stringify(report.geometry)
					},
					payload = {};

			lang.mixin(suitRenderRule.rasterFunctionArguments, targetRule.rasterFunctionArguments);
			suitRenderRule.rasterFunction = targetRule.rasterFunction;
			params.renderingRule = JSON.stringify(suitRenderRule);

			function success(res) {
				if (res.histograms.length > 0) {
					payload.data = res.histograms[0];
					payload.pixelSize = params.pixelSize;
					deferred.resolve(payload);
				} else {
					deferred.resolve(false);
				}
			}

			function failure(err) {
				if (err.details) {
					if (err.details[0] === 'The requested image exceeds the size limit.' && params.pixelSize !== 500) {
						params.pixelSize = 500;
						self.getHistogram(url, params, success, failure);
					} else {
						deferred.resolve(false);
					}
				} else {
					deferred.resolve(false);
				}
			}

			this.getHistogram(url, params, success, failure);
			return deferred.promise;
		},

		getCompositionAnalysis: function () {

			var deferred = new Deferred(),
					cumulativeResults = [],
					self = this;

			all([
				self.getElevationComposition(),
				self.getSlopeComposition(),
				self.getWaterComposition(),
				self.getConservationComposition(),
			]).then(function (firstResults) {

				all([
					self.getSoilTypeComposition(),
					self.getSoilDepthComposition(),
					self.getPeatComposition(),
					self.getSoilAcidityComposition()
				]).then(function (secondResults) {

					all([
						self.getSoilDrainComposition(),
						self.getRainfallComposition(),
						self.getLandCoverComposition()
					]).then(function (thirdResults) {
						// Concatenate the results into a single array of objects
						deferred.resolve(firstResults.concat(secondResults.concat(thirdResults)));
					});

				});

			});

			return deferred.promise;

		},

		getElevationComposition: function () {
			var deferred = new Deferred(),
				self = this,
				renderRule,
				suitableIndex,
				data;

			renderRule = this.getCompositionRemapRule('$1', 'ElevInpR', 'ElevOutV');

			this.queryComposition(renderRule, function (results) {
				data = self.formatCompositionResults(results, "Elevation");
				deferred.resolve(data);
			});
			return deferred.promise;
		},

		getSlopeComposition: function () {
			var deferred = new Deferred(),
				self = this,
				renderRule,
				suitableIndex,
				data;

			renderRule = this.getCompositionRemapRule('$2', 'SlopeInpR', 'SlopeOutV');

			this.queryComposition(renderRule, function (results) {
				data = self.formatCompositionResults(results, "Slope");
				deferred.resolve(data);
			});
			return deferred.promise;
		},

		getWaterComposition: function () {
			var deferred = new Deferred(),
				self = this,
				renderRule,
				suitableIndex,
				data;

			renderRule = this.getCompositionRemapRule('$3', 'WaterInpR', 'WaterOutV');

			this.queryComposition(renderRule, function (results) {
				data = self.formatCompositionResults(results, "Water Resource Buffers");
				deferred.resolve(data);
			});
			return deferred.promise;
		},

		getConservationComposition: function () {
			var deferred = new Deferred(),
				self = this,
				renderRule,
				suitableIndex,
				data;

			renderRule = this.getCompositionRemapRule('$4', 'ConsInpR', 'ConsOutV');

			this.queryComposition(renderRule, function (results) {
				data = self.formatCompositionResults(results, "Conservation Area Buffers");
				deferred.resolve(data);
			});
			return deferred.promise;
		},

		getSoilTypeComposition: function () {
			var deferred = new Deferred(),
				self = this,
				renderRule,
				suitableIndex,
				data;

			renderRule = this.getCompositionRemapRule('$5', 'STypeInpR', 'STypeOutV');

			this.queryComposition(renderRule, function (results) {
				data = self.formatCompositionResults(results, "Soil Type");
				deferred.resolve(data);
			});
			return deferred.promise;
		},

		getSoilDepthComposition: function () {
			var deferred = new Deferred(),
				self = this,
				renderRule,
				suitableIndex,
				data;

			renderRule = this.getCompositionRemapRule('$6', 'SDepthInpR', 'SDepthOutV');

			this.queryComposition(renderRule, function (results) {
				data = self.formatCompositionResults(results, "Soil Depth");
				deferred.resolve(data);
			});
			return deferred.promise;
		},

		getPeatComposition: function () {
			var deferred = new Deferred(),
				self = this,
				renderRule,
				suitableIndex,
				data;

			renderRule = this.getCompositionRemapRule('$7', 'PeatInpR', 'PeatOutV');

			this.queryComposition(renderRule, function (results) {
				data = self.formatCompositionResults(results, "Peat Depth");
				deferred.resolve(data);
			});
			return deferred.promise;
		},

		getSoilAcidityComposition: function () {
			var deferred = new Deferred(),
				self = this,
				renderRule,
				suitableIndex,
				data;

			renderRule = this.getCompositionRemapRule('$8', 'SAcidInpR', 'SAcidOutV');

			this.queryComposition(renderRule, function (results) {
				data = self.formatCompositionResults(results, "Soil Acidity");
				deferred.resolve(data);
			});
			return deferred.promise;
		},

		getSoilDrainComposition: function () {
			var deferred = new Deferred(),
				self = this,
				renderRule,
				suitableIndex,
				data;

			renderRule = this.getCompositionRemapRule('$9', 'SDrainInpR', 'SDrainOutV');

			this.queryComposition(renderRule, function (results) {
				data = self.formatCompositionResults(results, "Soil Drainage");
				deferred.resolve(data);
			});
			return deferred.promise;
		},

		getRainfallComposition: function () {
			var deferred = new Deferred(),
				self = this,
				renderRule,
				suitableIndex,
				data;

			renderRule = this.getCompositionRemapRule('$10', 'RainfallInpR', 'RainfallOutV');

			this.queryComposition(renderRule, function (results) {
				data = self.formatCompositionResults(results, "Rainfall");
				deferred.resolve(data);
			});
			return deferred.promise;
		},

		getLandCoverComposition: function () {
			var deferred = new Deferred(),
				self = this,
				renderRule,
				suitableIndex,
				data;

			renderRule = this.getCompositionRemapRule('$11', 'LCInpR', 'LCOutV');

			this.queryComposition(renderRule, function (results) {
				data = self.formatCompositionResults(results, "Land Cover");
				deferred.resolve(data);
			});
			return deferred.promise;
		},

		getCompositionRemapRule: function (rasterId, argsKeyIn, argsKeyOut) {

			var renderingRule = lang.clone(report.suitable.renderRule);

			return {
				"rasterFunction": "Remap",
				"rasterFunctionArguments": {
					"InputRanges": renderingRule.rasterFunctionArguments[argsKeyIn],
					"OutputValues": renderingRule.rasterFunctionArguments[argsKeyOut],
					"Raster": rasterId
				},
				"outputPixelType": "U2"
			};
		},

		// getCompositionRenderingRule: function (rasterId) {
		// 	var renderingRule = {},
		// 			suitabilityRule = lang.clone(report.suitable.renderRule);

		// 	// Wrap the suitability rule in an arithmetic rendering rule and apply the correct rasterId
		// 	renderingRule.rasterFunction = 'Arithmetic';
		// 	// Update the raster function on the suitability rule
		// 	suitabilityRule.rasterFunction = 'PalmOilSuitability_Histogram';

		// 	renderingRule.rasterFunctionArguments = {
		// 		"Raster": suitabilityRule,
		// 		"Raster2": rasterId,
		// 		"AllowUnmatched": false,
		// 		"Operation": 3
		// 	};
		// 	return renderingRule;
		// },

		// getFloatingPointCompositionRenderingRule: function (rasterId, argumentsKeyIn, argumentsKeyOut) {
		// 	var renderingRule = {},
		// 			suitabilityRule = lang.clone(report.suitable.renderRule);

		// 	// Wrap the suitability rule in an arithmetic rendering rule and apply the correct rasterId
		// 	renderingRule.rasterFunction = 'Arithmetic';
		// 	// Update the raster function on the suitability rule
		// 	suitabilityRule.rasterFunction = 'PalmOilSuitability_Histogram';

		// 	renderingRule.rasterFunctionArguments = {
		// 		"Raster": suitabilityRule,
		// 		"Raster2": {
		// 			"rasterFunction": "Remap",
		// 			"rasterFunctionArguments": {
		// 				"InputRanges": suitabilityRule.rasterFunctionArguments[argumentsKeyIn],
		// 				"OutputValues": suitabilityRule.rasterFunctionArguments[argumentsKeyOut],
		// 				"Raster": rasterId
		// 			},
		// 			"outputPixelType": "U2"
		// 		},
		// 		"Operation": 3
		// 	};
		// 	return renderingRule;
		// },

		queryComposition: function (renderingRule, callback) {
			var url = ReportConfig.suitability.url,
					params = {
						f: 'json',
						pixelSize: ReportConfig.pixelSize,
						geometryType: ReportConfig.suitability.geometryType,
						geometry: JSON.stringify(report.geometry),
						renderingRule: JSON.stringify(renderingRule)
					},
					data;

			function success(res) {
				var data;

				if (res.histograms.length > 0) {
					data = res.histograms[0] && res.histograms[0].counts || [0, 0];
					callback(data);
				} else {
					data = [0,0];
					callback(data);
				}
			}

			function failure(err) {
				if (err.details) {
					if (err.details[0] === 'The requested image exceeds the size limit.' && params.pixelSize !== 500) {
						params.pixelSize = 500;
						self.getHistogram(url, params, success, failure);
					} else {
						callback(false);
					}
				} else {
					callback(false);
				}
			}

			this.getHistogram(url, params, success, failure);

		},

		/**
		* @param {array} data - histogram counts
		# @param {string} labelForChart - Label for Chart
		*/
		formatCompositionResults: function (data, labelForChart) {
			return {
				unsuitable: data[0] || 0,
				suitable: data[1] || 0,
				label: labelForChart
			};
		},

		getHistogram: function (url, content, callback, errback) {
			
			var req = esriRequest({
				url: url + "/computeHistograms?",
				content: content,
				handleAs: "json",
				callbackParamName: "callback"
			});
			
			req.then(callback, errback);

		}

	};

});

define('map/Symbols',[
	'esri/Color',
	'esri/symbols/SimpleFillSymbol',
  'esri/symbols/SimpleLineSymbol',
  'esri/symbols/SimpleMarkerSymbol'
], function (Color, SimpleFillSymbol, SimpleLineSymbol, SimpleMarkerSymbol) {
	'use strict';

	var Symbols = {

		/**
		* Polygon Symbol Used for Custom Drawn Polygons or Uploaded Polygons
		*/
		getPolygonSymbol: function () {
			return new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
        new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255,0,0]), 2),
        new Color([103,200,255,0.0]));
		},

		/**
		* Point Symbol Used for Uploaded Points
		*/
		getPointSymbol: function () {
			return new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 10,
    		new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([255,0,0]), 1),
    		new Color([0,0,0,0.25]));
		},

		/**
    * Cyan Colored Polygon Symbol for Highlighted or Active Features
    */
		getHighlightPolygonSymbol: function () {
      return new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
        new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0,255,255]), 2),
        new Color([103,200,255,0.0]));
		},

    /**
    * Cyan Colored Point Symbol for Highlighted or Active Features
    */
    getHighlightPointSymbol: function () {
      return new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 10,
        new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,255,255]), 1),
        new Color([0,0,0,0.25]));
    }

	};

	return Symbols;

});

define('utils/assert',[], function () {
  'use strict';

  /**
  * Simple assertion function to validate some condition or throw an error
  * @param condition {boolean} This condition is an expression that must evaluate to a boolean
  */
  return function (condition, message) {
    if (condition) return;
    throw new Error(['Assertion Error:', message].join(' '));
  };

});

define('utils/request',[
  'esri/request'
], function (request) {
  'use strict';

  return {
    /**
    * Simple wrapper around esri request
    * @param {string} url - Url of the service
    * @param {object} content - options to be sent with the request
    * @param {function} callback - function triggered after successful request
    * @param {function} errback - function triggered after failed request
    */
    get: function (url, content, callback, errback) {
      var deferred = request({
        callbackParamName: 'callback',
        content: content,
        handleAs: 'json',
        url: url
      });
      deferred.then(callback, errback);
    },

    /**
    * Simple wrapper around esri request that specifically calls compute histograms
    * @param {string} url - Url of the service
    * @param {object} content - options to be sent with the request
    * @param {function} callback - function triggered after successful request
    * @param {function} errback - function triggered after failed request
    */
    computeHistogram: function (url, content, callback, errback) {
      var deferred = request({
        url: url + '/computeHistograms',
        callbackParamName: 'callback',
        content: content,
        handleAs: 'json',
        timeout: 60000
      }, { usePost: true });
      deferred.then(callback, errback);
    }

  };

});

define('report/rasterArea',[
  'lodash',
  'utils/assert',
  'utils/request',
  'report/config',
  'dojo/Deferred'
], function (_, assert, request, config, Deferred) {
  'use strict';

  /**
   * This process consists of a couple of steps
   * 1. getRangeHistograms 
   *   1.1. If no layer config is provided, sumCounts and return, else continue
   * 2. generateRanges
   * 3. getAreaHistograms
   *   3.1. If the request uses a simple rule, switch that into the main method
   * 4. decodeArea
   */

  var preferredPixelSize = 90;

  /**
  * Takes geometry and returns histograms of pixel counts in given geometry
  * @param {object} geometry - Esri Polygon Geometry
  * @return deferred
  */
  function getRangeHistograms (geometry) {
    var deferred = new Deferred();
    var content = {
      'geometryType': 'esriGeometryPolygon',
      'geometry': JSON.stringify(geometry),
      'renderingRule': JSON.stringify(config.rasterFunctions.range),
      'pixelSize': preferredPixelSize,
      'f': 'json'
    };

    function success (data) {
      if (data.histograms.length > 0) {
        deferred.resolve(data.histograms[0]);
      } else {
        deferred.reject();
      }
    }

    request.computeHistogram(config.urls.imageService, content, success, errback);
    return deferred;
  }

  /**
  * @param {object} histogram - histogram with counts and size
  * @return {number} area
  */
  function sumCounts (histogram) {
    var counts = histogram.counts;
    var firstValueIndex = _.findIndex(counts, function (val) { return val > 0; });
    var finalIndex = histogram.size;
    var totalArea = 0;

    while (firstValueIndex < finalIndex) {
      totalArea += (firstValueIndex * counts[firstValueIndex] * Math.pow((preferredPixelSize / 30),2));
      ++firstValueIndex;
    }
    // totalArea is currently meters squared, to get ha, return (totalArea / 10000)
    return totalArea;
  }

  /**
  * Takes a histogram and returns a range of values in a string format
  * @param {object} histogram - histogram with counts and size
  * @return {array} ranges
  * ex.  histogram.counts = [0,0,2,2,2] => 2,2,3,3,4,4
  */
  function generateRanges (histogram) {
    var firstValueIndex = _.findIndex(histogram.counts, function (val) { return val > 0; });
    var finalIndex = histogram.size;
    var ranges = [];

    while (firstValueIndex < finalIndex) {
      ranges.push(firstValueIndex);
      ranges.push(firstValueIndex);
      ++firstValueIndex;
    }
    return ranges;
  }

  /**
  * Takes some geometry and a layer config and creates a new rendering rule and modifies it, then requests area
  * @param {object} geometry - Esri polygon
  * @param {array} ranges - Array of ranges
  * @param {object} layersConfig - object containing rasterIds and bounds for the two layers we are getting area for
  */
  function getAreaHistograms (geometry, ranges, layersConfig) {
    var deferred = new Deferred(),
        renderingRule = _.clone(config.rasterFunctions.combination),
        outputValues = [],
        content;

    // Update some necessary properties

    // If we aer using the simple rule, we have to modify the whole rule with a remap
    // NOTE the simple rule is only a piece of the original and then it has to be modified
    // make sure to handle that correctly
    if (layersConfig.simpleRule) {

      renderingRule.rasterFunctionArguments.RasterRange = [1, 2];
      renderingRule.rasterFunctionArguments.Raster = layersConfig.simpleRule;

    } else {
      // None of these layerConfig values exist yet, still deciding the best way to pass in 
      // all the possible options that are necessary
      var upperRangeLevel = (layersConfig.raster.bounds[1] * layersConfig.raster2.length[0]) + layersConfig.raster.bounds[1];

      renderingRule.rasterFunctionArguments.RasterRange = [1, upperRangeLevel];
      renderingRule.rasterFunctionArguments.Raster.rasterFunctionArguments = {
        'RasterRange': layersConfig.raster.bounds,
        'Raster2Length': layersConfig.raster2.length, // will be an array, so [10] for example
        'Raster': layersConfig.raster.id,
        'Raster2': layersConfig.raster2.id
      };
    }

    // Generate the OutputValues array, this is fairly trivial so need for its own method
    // if ranges is [950,950,951,951] then outputValues should be [1,2]
    for (var i = 0; i < ranges.length /2; i++) {
      outputValues.push(i + 1);
    }

    renderingRule.rasterFunctionArguments.Raster2.rasterFunctionArguments.InputRanges = ranges;
    renderingRule.rasterFunctionArguments.Raster2.rasterFunctionArguments.OutputValues = outputValues;

    content = {
      'geometryType': 'esriGeometryPolygon',
      'geometry': JSON.stringify(geometry),
      'renderingRule': JSON.stringify(renderingRule),
      'pixelSize': preferredPixelSize,
      'f': 'json'
    };

    function success (data) {
      console.log(data);
    }

    request.computeHistogram(config.urls.imageService, content, success, errback);
    return deferred;
  }

  function decodeArea () {

  }

  /**
  * Generic Error Handler for requests
  * @param {error} error
  */
  function errback (error) {
    console.error(error);
  }

  return {

    /**
    * Wrapper function to take some geomerty and return the area for the geometry
    * @param {polygon} geometry - Esri Polygon Geometry
    * @param {object} [layerConfig] - config object that has bounds and rasterID available (optional)
    * @return deferred
    */
    getArea: function (geometry, layerConfig) {
      assert(geometry && geometry.type === 'polygon', 'Invalid Parameter');
      var deferred = new Deferred(),
          ranges,
          area;

      getRangeHistograms(geometry).then(function (rangeHistogram) {
        // if no layerConfig options are presented, this is a simple area calculation so calculate area and bounce
        if (layerConfig === undefined) {
          area = sumCounts(rangeHistogram);
          console.log(area);
          deferred.resolve(area);
          return;
        }

        ranges = generateRanges(rangeHistogram);
        getAreaHistograms(geometry, ranges, layerConfig).then(function (areaHistogram) {



        }, errback);
      }, errback);

      return deferred;
    }

  };

});

define('report/mill-api',["exports","esri/geometry/geometryEngineAsync","esri/tasks/BufferParameters","esri/tasks/GeometryService","esri/SpatialReference","esri/geometry/Polygon","esri/request","esri/config","dojo/Deferred","dojo/promise/all"],function(e,r,t,n,o,a,i,u,s,R){"use strict";function E(e){return e&&e.__esModule?e:{"default":e}}function _(e,r){if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")}function c(e,r,t){var n=new A["default"];return(0,O["default"])({BUFFER:j(e,t||v.RADIUS),INDO:X(e)}).then(function(t){var o=t.BUFFER[0];U=t.INDO,(0,O["default"])({AREA:Z(o),LOSS_RATE:$(o),HISTORIC:ne(o),FUTURE:oe(o)}).then(function(t){n.resolve(ie(ae(t),e,r))})}),n}Object.defineProperty(e,"__esModule",{value:!0}),e["default"]=c;var S=E(r),m=E(t),l=E(n),d=E(o),f=E(a),I=E(i),T=E(u),A=E(s),O=E(R),g=Object.assign||function(e){for(var r=1;r<arguments.length;r++){var t=arguments[r];for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n])}return e},p=function(){function e(e,r){for(var t=0;t<r.length;t++){var n=r[t];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(r,t,n){return t&&e(r.prototype,t),n&&e(r,n),r}}(),v={RADIUS:50,DENSITY:30,TIMEOUT:45e3,PIXEL_SIZE:100,FUTURE_YEAR_COUNT:2,CONTENT_FORMAT:"json",HISTORIC_YEAR_END_INDEX:11,HISTORIC_YEAR_START_INDEX:8,GEOMETRY_POINT:"esriGeometryPoint",GEOMETRY_POLYGON:"esriGeometryPolygon"},h={1:"low",2:"medium low",3:"medium",4:"medium high",5:"high"},P={ADD:1,MULTIPLY:3},y={mosaic:function(e){return{mosaicMethod:"esriMosaicLockRaster",mosaicOperation:"MT_FIRST",lockRasterIds:[e],ascending:!0}},arithmetic:function(e,r,t){return{rasterFunction:"Arithmetic",rasterFunctionArguments:{Raster:e,Raster2:r,Operation:t}}},remap:function(e,r,t){return{rasterFunction:"Remap",rasterFunctionArguments:{InputRanges:r,OutputValues:t,Raster:e,AllowUnmatched:!1}}}},C={FIRES_RASTER_URL:"https://gis-gfw.wri.org/arcgis/rest/services/image_services/annual_fires/ImageServer",IMAGE_SERVICE_URL:"https://gis-gfw.wri.org/arcgis/rest/services/image_services/analysis/ImageServer",GEOMETRY_SERVICE_URL:"https://gis-gfw.wri.org/arcgis/rest/services/Utilities/Geometry/GeometryServer",BOUNDARY_SERVICE_URL:"https://gis-gfw.wri.org/arcgis/rest/services/CommoditiesAnalyzer/mapfeatures/MapServer/6",CANOPY_DENSITY_REMAP:y.remap("$520",[0,v.DENSITY,v.DENSITY,101],[0,1]),TREE_COVER_LOSS:{id:"$530",bounds:[1,14]},PRIMARY_FOREST:{id:"$519",bounds:[1,2]},PEAT:{id:"$8",bounds:[0,1]},PROTECTED_AREA:{id:"$10",bounds:[0,1]},CARBON:{id:"$524",bounds:[0,1],remap:y.remap("$524",[0,21,21,1e3],[0,1])},TREE_COVER_EXTENT:{id:"$520"},INTACT_FOREST_LANDSCAPE:{id:"$9"},FIRES:{PIXEL_SIZE:890.5559263,ID_09:1,ID_10:2,ID_11:3,ID_12:4,ID_13:5,ID_14:6,ID_15:7}},L={CARBON_AREA:{type:"percent",mean:97.67173618,std_dev:5.775175366},CARBON_LOSS:{type:"number",mean:55479.66071,std_dev:31676.19725},FIRE_ACTIVITY_FUTURE:{type:"number",mean:463888e-9,std_dev:781948e-9},FIRE_ACTIVITY_HISTORIC:{type:"number",mean:287583e-9,std_dev:336257e-9},WDPA_AREA:{type:"percent",mean:7.228910262,std_dev:8.985175562},WDPA_LOSS:{type:"number",mean:1119.288265,std_dev:2797.828324},PEAT_AREA:{type:"percent",mean:9.817356171,std_dev:12.76025748},PEAT_LOSS:{type:"number",mean:10890.62372,std_dev:19728.76226},PRIMARY_FOREST_AREA:{type:"percent",mean:12.5132604,std_dev:16.9831375},PRIMARY_FOREST_LOSS:{type:"number",mean:11965.28699,std_dev:22059.03368},TREE_COVER_FUTURE_RATE:{type:"number",mean:9321.90051,std_dev:4551.812568},TREE_COVER_LOSS_RATE:{type:"number",mean:13952.03571,std_dev:7912.007913}},U=void 0,F=new l["default"](C.GEOMETRY_SERVICE_URL);T["default"].defaults.io.corsEnabledServers.push("gis-gfw.wri.org"),T["default"].defaults.io.corsEnabledServers.push("gis-potico.wri.org");var N=function(e){var r=e.histograms,t=e.noSlice,n=r&&1===r.length?r[0].counts:[];return t?n:n.slice(1)},k=function(e){return parseInt(e.replace(/\$/,""))},Y=function(e,r){var t=e/r*100;return t>100?100:t},D=function(e,r,t){return(e-r)/t},M=function(e){var r=void 0;return r=e>=1?5:e>=.5&&.99>=e?4:e>=-.49&&.49>=e?3:e>=-.99&&-.49>=e?2:1,{score:r,zScore:e,rank:h[r]}},b=function(){return{score:1,zScore:-1,rank:h[1]}},z=function(e,r){var t=e*r,n=void 0;return n=t>=21?5:t>=16&&20>=t?4:t>=11&&15>=t?3:t>=5&&10>=t?2:1,h[n]},w=function(e){for(var r=0,t=v.HISTORIC_YEAR_START_INDEX;t<=v.HISTORIC_YEAR_END_INDEX;t++)e[t]&&(r+=e[t]);return r},V=function(e){for(var r=[],t=v.FUTURE_YEAR_COUNT;t>0;t--)r.push(e[e.length-t]||0);return r.reduce(function(e,r){return e+r},0)/r.length},B=function(e){for(var r=[],t=v.HISTORIC_YEAR_START_INDEX;t<=v.HISTORIC_YEAR_END_INDEX;t++)r.push(e[t]||0);return r.reduce(function(e,r){return e+r},0)/r.length},G=function(){function e(r,t){_(this,e),this.fromBounds=function(e){for(var r=[],t=e[1],n=e[0];t>=n;n++)r.push(n);return r},this.A=this.fromBounds(r),this.B=this.fromBounds(t)}return p(e,[{key:"encode",value:function(e,r){return this.B.length*e+r}},{key:"decode",value:function(e){var r=e%this.B.length,t=(e-r)/this.B.length;return[t,r]}},{key:"getSimpleRule",value:function(e,r){var t=C.CANOPY_DENSITY_REMAP,n=y.arithmetic(t,y.arithmetic(e,r,P.MULTIPLY),P.MULTIPLY);return n.rasterFunctionArguments.Raster2.outputPixelType="U8",n}},{key:"getRule",value:function(e,r){var t=y.remap(e,[this.A[0],this.A[this.A.length-1]+1],[this.B.length]),n=C.CANOPY_DENSITY_REMAP,o=y.arithmetic(n,y.arithmetic(y.arithmetic(t,e,P.MULTIPLY),r,P.ADD),P.MULTIPLY);return o.rasterFunctionArguments.Raster2.outputPixelType="U8",o}}]),e}(),x=function(e,r){return r.geometry&&(r.geometry=JSON.stringify(r.geometry)),r.renderingRule&&(r.renderingRule=JSON.stringify(r.renderingRule)),r.mosaicRule&&(r.mosaicRule=JSON.stringify(r.mosaicRule)),r.geometryType=r.geometryType||v.GEOMETRY_POLYGON,r.pixelSize=r.pixelSize||v.PIXEL_SIZE,r.f=r.f||v.CONTENT_FORMAT,(0,I["default"])({url:e+"/computeHistograms",callbackParamName:"callback",timeout:v.TIMEOUT,content:r,handleAs:"json"},{usePost:!0})},X=function(e){var r=new A["default"],t={where:"ISO = 'IDN'",geometryType:v.GEOMETRY_POINT,geometry:JSON.stringify(e),returnGeometry:!1,outFields:[],f:"json"};return(0,I["default"])({url:C.BOUNDARY_SERVICE_URL+"/query",callbackParamName:"callback",timeout:v.TIMEOUT,content:t,handleAs:"json"},{usePost:!0}).then(function(e){r.resolve(e&&e.features&&e.features.length>0)}),r},H=function(e){var r=new A["default"],t={geometryType:v.GEOMETRY_POLYGON,spatialRel:"esriSpatialRelIntersects",geometry:JSON.stringify(e),returnGeometry:!0,outFields:[""],outSR:54010,f:"json"};return(0,I["default"])({url:C.BOUNDARY_SERVICE_URL+"/query",callbackParamName:"callback",timeout:v.TIMEOUT,content:t,handleAs:"json"},{usePost:!0}).then(function(e){r.resolve(e.features)}),r},j=function(e,r){var t=new A["default"],n=new m["default"];return n.geometries=[e],n.distances=[r],n.unit=l["default"].UNIT_KILOMETER,n.outSpatialReference=new d["default"](54010),F.buffer(n,t.resolve,console.error),t},Z=function(e){var r=new A["default"],t={areaUnit:'{"areaUnit": "esriHectares"}',calculationType:"preserveShape",sr:54010,f:"json"};return H(e).then(function(n){var o=n.map(function(e){return new f["default"](e.geometry)});S["default"].intersect(o,e).then(function(e){t.polygons=JSON.stringify(e),(0,I["default"])({url:C.GEOMETRY_SERVICE_URL+"/areasAndLengths",callbackParamName:"callback",timeout:v.TIMEOUT,content:t,handleAs:"json"},{usePost:!0}).then(function(e){r.resolve(e.areas.reduce(function(e,r){return e+r},0))})})}),r},$=function(e){var r=new A["default"],t={geometry:e,pixelSize:v.PIXEL_SIZE,renderingRule:y.arithmetic(C.CANOPY_DENSITY_REMAP,C.TREE_COVER_LOSS.id,P.MULTIPLY)};return x(C.IMAGE_SERVICE_URL,t).then(function(e){r.resolve(N({histograms:e.histograms}))}),r},J=function(e){var r=new A["default"],t=new G(C.TREE_COVER_LOSS.bounds,C.PRIMARY_FOREST.bounds),n=t.getRule(C.TREE_COVER_LOSS.id,C.PRIMARY_FOREST.id),o={geometry:e,pixelSize:v.PIXEL_SIZE,renderingRule:n};return x(C.IMAGE_SERVICE_URL,o).then(function(e){for(var n=t.A,o=t.B,a=N({histograms:e.histograms,noSlice:!0}),i=[],u=0;u<n.length;u++){for(var s=0,R=0;R<o.length;R++){var E=t.encode(n[u],o[R]);s+=a[E]||0}i.push(s)}r.resolve(i)}),r},W=function(e){var r=new A["default"],t=new G(C.TREE_COVER_LOSS.bounds,C.PEAT.bounds),n=t.getSimpleRule(C.TREE_COVER_LOSS.id,C.PEAT.id),o={geometry:e,pixelSize:v.PIXEL_SIZE,renderingRule:n};return x(C.IMAGE_SERVICE_URL,o).then(function(e){r.resolve(N({histograms:e.histograms}))}),r},q=function(e){var r=new A["default"],t=new G(C.TREE_COVER_LOSS.bounds,C.PROTECTED_AREA.bounds),n=t.getSimpleRule(C.TREE_COVER_LOSS.id,C.PROTECTED_AREA.id),o={geometry:e,pixelSize:v.PIXEL_SIZE,renderingRule:n};return x(C.IMAGE_SERVICE_URL,o).then(function(e){r.resolve(N({histograms:e.histograms}))}),r},K=function(e){var r=new A["default"],t=new G(C.TREE_COVER_LOSS.bounds,C.CARBON.bounds),n=t.getRule(C.TREE_COVER_LOSS.id,C.CARBON.remap),o={geometry:e,pixelSize:v.PIXEL_SIZE,renderingRule:n};return x(C.IMAGE_SERVICE_URL,o).then(function(e){for(var n=t.A,o=t.B,a=N({histograms:e.histograms,noSlice:!0}),i=[],u=0;u<n.length;u++){for(var s=0,R=1;R<o.length;R++){var E=t.encode(n[u],o[R]);s+=a[E]||0}i.push(s)}r.resolve(i)}),r},Q=function(e,r){var t=new A["default"],n={geometry:r,pixelSize:v.PIXEL_SIZE,mosaicRule:y.mosaic(k(e))};return x(C.IMAGE_SERVICE_URL,n).then(function(e){if(e.histograms.length){var r=N({histograms:e.histograms});t.resolve(r.length?r.reduce(function(e,r){return e+r},0):0)}else t.resolve(0)},function(){t.resolve(0)}),t},ee=function(e){var r=new A["default"],t={geometry:e,pixelSize:v.PIXEL_SIZE,renderingRule:C.CARBON.remap};return x(C.IMAGE_SERVICE_URL,t).then(function(e){if(e.histograms.length){var t=N({histograms:e.histograms});r.resolve(t.length?t[0]:0)}else r.resolve(0)},function(){r.resolve(0)}),r},re=function(e){var r=new A["default"],t={geometry:e,pixelSize:C.FIRES.PIXEL_SIZE},n=g({},t,{mosaicRule:y.mosaic(C.FIRES.ID_09)}),o=g({},t,{mosaicRule:y.mosaic(C.FIRES.ID_10)}),a=g({},t,{mosaicRule:y.mosaic(C.FIRES.ID_11)}),i=g({},t,{mosaicRule:y.mosaic(C.FIRES.ID_12)});return(0,O["default"])([x(C.FIRES_RASTER_URL,n),x(C.FIRES_RASTER_URL,o),x(C.FIRES_RASTER_URL,a),x(C.FIRES_RASTER_URL,i)]).then(function(e){var t=e.map(function(e){var r=N({histograms:e.histograms,noSlice:!0});return r.reduce(function(e,r,t){return e+r*t},0)});r.resolve(t.reduce(function(e,r){return e+r},0)/t.length)}),r},te=function(e){var r=new A["default"],t={geometry:e,pixelSize:C.FIRES.PIXEL_SIZE},n=g({},t,{mosaicRule:y.mosaic(C.FIRES.ID_13)}),o=g({},t,{mosaicRule:y.mosaic(C.FIRES.ID_14)});return(0,O["default"])([x(C.FIRES_RASTER_URL,n),x(C.FIRES_RASTER_URL,o)]).then(function(e){var t=e.map(function(e){var r=N({histograms:e.histograms,noSlice:!0});return r.reduce(function(e,r,t){return e+r*t},0)});r.resolve(t.reduce(function(e,r){return e+r},0)/t.length)}),r},ne=function(e){return(0,O["default"])({PRIMARY_FOREST:J(e),PEAT:W(e),PROTECTED_AREA:q(e),CARBON:K(e),FIRE:re(e)})},oe=function(e){return(0,O["default"])({PRIMARY_FOREST:Q(C.PRIMARY_FOREST.id,e),PEAT:Q(C.PEAT.id,e),PROTECTED_AREA:Q(C.PROTECTED_AREA.id,e),CARBON:ee(e),IFL:Q(C.INTACT_FOREST_LANDSCAPE.id,e),FIRE:te(e)})},ae=function(e){var r=e.AREA,t=e.LOSS_RATE,n=e.HISTORIC,o=e.FUTURE,a=V(t,v.FUTURE_YEAR_COUNT),i=Y(U?o.PRIMARY_FOREST:o.IFL,r),u=Y(o.PEAT,r),s=Y(o.PROTECTED_AREA,r),R=Y(o.CARBON,r),E=o.FIRE/r,_=i?M(D(i,L.PRIMARY_FOREST_AREA.mean,L.PRIMARY_FOREST_AREA.std_dev)):b(),c=u?M(D(u,L.PEAT_AREA.mean,L.PEAT_AREA.std_dev)):b(),S=s?M(D(s,L.WDPA_AREA.mean,L.WDPA_AREA.std_dev)):b(),m=R?M(D(R,L.CARBON_AREA.mean,L.CARBON_AREA.std_dev)):b(),l=a?M(D(a,L.TREE_COVER_FUTURE_RATE.mean,L.TREE_COVER_FUTURE_RATE.std_dev)):b(),d=E?M(D(E,L.FIRE_ACTIVITY_FUTURE.mean,L.FIRE_ACTIVITY_FUTURE.std_dev)):b(),f=B(t),I=w(n.PRIMARY_FOREST),T=w(n.PEAT),A=w(n.PROTECTED_AREA),O=w(n.CARBON),p=n.FIRE/r,h=f?M(D(f,L.TREE_COVER_LOSS_RATE.mean,L.TREE_COVER_LOSS_RATE.std_dev)):b(),P=I?M(D(I,L.PRIMARY_FOREST_LOSS.mean,L.PRIMARY_FOREST_LOSS.std_dev)):b(),y=T?M(D(T,L.PEAT_LOSS.mean,L.PEAT_LOSS.std_dev)):b(),C=A?M(D(A,L.WDPA_LOSS.mean,L.WDPA_LOSS.std_dev)):b(),F=O?M(D(O,L.CARBON_LOSS.mean,L.CARBON_LOSS.std_dev)):b(),N=p?M(D(p,L.FIRE_ACTIVITY_HISTORIC.mean,L.FIRE_ACTIVITY_HISTORIC.std_dev)):b();return{HISTORIC:{primary_forest:g({amount:I},P),peat:g({amount:T},y),protected_areas:g({amount:A},C),carbon:g({amount:O},F),tree_cover:g({amount:f},h),fire:g({amount:p},N)},FUTURE:{primary_forest:g({amount:i},_),peat:g({amount:u},c),protected_areas:g({amount:s},S),carbon:g({amount:R},m),tree_cover:g({amount:a},l),fire:g({amount:E},d)}}},ie=function(e,r,t){var n=e.HISTORIC,o=e.FUTURE,a=0===o.tree_cover.zScore&&0===n.tree_cover.zScore,i=0===o.primary_forest.zScore&&0===n.primary_forest.zScore,u=0===o.peat.zScore&&0===n.peat.zScore,s=0===o.protected_areas.zScore&&0===n.protected_areas.zScore,R=0===o.carbon.zScore&&0===n.carbon.zScore,E=0===o.fire.zScore&&0===n.fire.zScore,_=(n.tree_cover.zScore+n.primary_forest.zScore+n.peat.zScore+n.protected_areas.zScore+n.carbon.zScore+n.fire.zScore)/6,c=(o.tree_cover.zScore+o.primary_forest.zScore+o.peat.zScore+o.protected_areas.zScore+o.carbon.zScore+o.fire.zScore)/6,S=M(_),m=M(c),l={};return r.getLatitude&&(l.latitude=r.getLatitude().toFixed(4)),r.getLongitude&&(l.longitude=r.getLongitude().toFixed(4)),g({tree_cover:{extent:{amount:o.tree_cover.amount,rank:o.tree_cover.rank},loss:{amount:n.tree_cover.amount,rank:n.tree_cover.rank},risk:a?b().rank:M((o.tree_cover.zScore+n.tree_cover.zScore)/2).rank},primary_forest:{extent:{amount:o.primary_forest.amount,rank:o.primary_forest.rank},loss:{amount:n.primary_forest.amount,rank:n.primary_forest.rank},risk:i?b().rank:M((o.primary_forest.zScore+n.primary_forest.zScore)/2).rank},peat:{extent:{amount:o.peat.amount,rank:o.peat.rank},loss:{amount:n.peat.amount,rank:n.peat.rank},risk:u?b().rank:M((o.peat.zScore+n.peat.zScore)/2).rank},protected_areas:{extent:{amount:o.protected_areas.amount,rank:o.protected_areas.rank},loss:{amount:n.protected_areas.amount,rank:n.protected_areas.rank},risk:s?b().rank:M((o.protected_areas.zScore+n.protected_areas.zScore)/2).rank},carbon:{extent:{amount:o.carbon.amount,rank:o.carbon.rank},loss:{amount:n.carbon.amount,rank:n.carbon.rank},risk:R?b().rank:M((o.carbon.zScore+n.carbon.zScore)/2).rank},fire:{extent:{amount:o.fire.amount,rank:o.fire.rank},loss:{amount:n.fire.amount,rank:n.fire.rank},risk:E?b().rank:M((o.fire.zScore+n.fire.zScore)/2).rank},historic_loss:S.rank,future_risk:m.rank,priority_level:z(S.score,m.score),mill_name:t||""},l)}});

define('report/Fetcher',[
		'lodash',
		'dojo/number',
		'dojo/Deferred',
		'dojo/promise/all',
		'dojo/_base/array',
		'dojo/dom',
		'dojo/dom-construct',
		// My Modules
		'report/config',
		'report/Renderer',
		'report/RiskHelper',
		'report/Suitability',
		'map/Symbols',
		// esri modules
		'esri/map',
		'esri/request',
		'esri/tasks/query',
		'esri/dijit/Scalebar',
		'esri/dijit/Legend',
		'esri/tasks/QueryTask',
		'esri/SpatialReference',
		'esri/geometry/Polygon',
		'esri/geometry/Point',
		'esri/layers/FeatureLayer',
		'esri/layers/ArcGISDynamicMapServiceLayer',
		'esri/tasks/GeometryService',
		'esri/geometry/geometryEngine',
		'esri/tasks/AreasAndLengthsParameters',
		'esri/Color',
		'esri/symbols/SimpleFillSymbol',
		'esri/symbols/SimpleLineSymbol',
		'esri/symbols/SimpleMarkerSymbol',
		'esri/layers/RasterFunction',
		'esri/layers/ImageParameters',
		'esri/layers/ArcGISImageServiceLayer',
		'esri/layers/ArcGISDynamicMapServiceLayer',
		'esri/layers/LayerDrawingOptions',
		'esri/graphic',
		'report/rasterArea',
		'report/mill-api'
], function (_, dojoNumber, Deferred, all, arrayUtils, dom, domConstruct, ReportConfig, ReportRenderer, RiskHelper, Suitability, Symbols, Map, esriRequest, Query, Scalebar, Legend, QueryTask, SpatialReference, Polygon, Point, FeatureLayer, ArcGISDynamicMapServiceLayer, GeometryService, geometryEngine, AreasAndLengthsParameters, Color, SimpleFillSymbol, SimpleLineSymbol, SimpleMarkerSymbol, RasterFunction, ImageParameters, ArcGISImageServiceLayer, ArcGISDynamicLayer, LayerDrawingOptions, Graphic, rasterArea, getMillRisk) {

		var _fireQueriesToRender = [];

		return {

				getAreaFromGeometry: function(geometry) {
						this._debug('Fetcher >>> getAreaFromGeometry');
						var deferred = new Deferred(),
								geometryService = new GeometryService(ReportConfig.geometryServiceUrl),
								parameters = new AreasAndLengthsParameters(),
								sr = new SpatialReference(54012),
								polygon = new Polygon(geometry),
								errorString = 'Not Available',
								area;

						function success(result) {
								if (result.areas.length === 1) {
										area = dojoNumber.format(result.areas[0], {
												places: 0
										});
										report.area = result.areas[0];
										deferred.resolve(area);
								} else {
										area = errorString;
										deferred.resolve(false);
								}
						}

						function failure() {
								deferred.resolve(false);
						}

						// Project Geometry in Eckert Spatial Reference
						// Then Simplify the Geometry, then get Areas and Lengths
						parameters.areaUnit = GeometryService.UNIT_HECTARES;
						geometryService.project([polygon], sr, function(projectedGeometry) {
								if (projectedGeometry.length > 0) {
										polygon.rings = projectedGeometry[0].rings;
										polygon.setSpatialReference(sr);
								} else {
										failure();
								}
								geometryService.simplify([polygon], function(simplifiedGeometry) {
										parameters.polygons = simplifiedGeometry;
										geometryService.areasAndLengths(parameters, success, failure);
								}, failure);
						}, failure);

						return deferred.promise;
				},

				setupMap: function () {
						var scalebar, graphic, poly, map;

						function mapLoaded () {
								map.graphics.clear();
								map.resize();

								scalebar = new Scalebar({
										map: map,
										scalebarUnit: 'metric',
										attachTo: 'bottom-center'
								});

								// Simplify this as multiparts and others may not display properly
								poly = new Polygon(report.mapGeometry);

								if (report.datasets.soy) {

									var soyParams = new ImageParameters();
									soyParams.layerOption = ImageParameters.LAYER_OPTION_SHOW;
									soyParams.format = 'png32';

									var rFunction;

									switch (report.minDensity) {
										case 10:
											rFunction = 'soy11';
											break;
										case 15:
											rFunction = 'soy16';
											break;
										case 20:
											rFunction = 'soy21';
											break;
										case 25:
											rFunction = 'soy26';
											break;
										case 30:
											rFunction = 'soy31';
											break;
										case 50:
											rFunction = 'soy51';
											break;
										case 75:
											rFunction = 'soy76';
											break;
										default:
											rFunction = 'soy31';
									}

									var soyRenderingRule = new RasterFunction();
									soyRenderingRule.functionName = rFunction;

									var soyVizLayer = new ArcGISImageServiceLayer('http://gis-gfw.wri.org/arcgis/rest/services/image_services/soy_total/ImageServer', {
											imageParameters: soyParams,
											id: 'soyVizLayer',
											opacity: .4,
											visible: true
									});

									map.addLayer(soyVizLayer);

									var soyImageLayer = new ArcGISImageServiceLayer('http://gis-gfw.wri.org/arcgis/rest/services/image_services/soy_vizz_service/ImageServer', {
											imageParameters: soyParams,
											id: 'soyImageLayer',
											visible: true
									});
									soyImageLayer.setRenderingRule(soyRenderingRule);
									map.addLayer(soyImageLayer);

									$('#print-map-legend-soy-img').removeClass('hidden');

								}

								graphic = new Graphic();
								graphic.setGeometry(poly);
								graphic.setSymbol(Symbols.getPolygonSymbol());

								if (report.centerPoints) {
									for (var j = 0; j < report.centerPoints.length; j++) {
										var pointGraphic = new Graphic();

										var pointSymbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 5,
											new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 0, 0]), 2),
											new Color([255, 0, 0, 1]));

										var pointGeom;
										if (report.centerPoints[j].geometry.x) {
											pointGeom = new Point(report.centerPoints[j].geometry.x, report.centerPoints[j].geometry.y, report.centerPoints[j].geometry.spatialReference);
										} else if (report.centerPoints[j].geometry.center.x) {
											pointGeom = new Point(report.centerPoints[j].geometry.center.x, report.centerPoints[j].geometry.center.y, report.centerPoints[j].geometry.center.spatialReference);
										}

										pointGraphic.setGeometry(pointGeom);
										pointGraphic.setSymbol(pointSymbol);

										map.graphics.add(pointGraphic);
									}
								}
								window.map = map;

								map.graphics.add(graphic);
								map.setExtent(graphic.geometry.getExtent().expand(1), true);
						}

						map = new Map('print-map', {
								basemap: 'topo',
								sliderPosition: 'top-right'
						});

						if (map.loaded) {
							mapLoaded();
						} else {
							map.on('load', mapLoaded);
						}

				},

				getPrimaryForestResults: function() {
						this._debug('Fetcher >>> getPrimaryForestResults');
						var deferred = new Deferred(),
								config = ReportConfig.primaryForest;

						// Create the container for all the results
						// Add this config to Fires so the Fires request knows to add data here
						ReportRenderer.renderContainers(config);
						_fireQueriesToRender.push(config);

						all([
								this._getTotalLossAnalysis(config),
								this._getClearanceAlertAnalysis(config),
								this._getCompositionAnalysis(config)
						]).then(function() {
								deferred.resolve(true);
						});

						return deferred.promise;
				},

				getTreeCoverResults: function() {
						this._debug('Fetcher >>> getTreeCoverResults');
						var deferred = new Deferred(),
								config = ReportConfig.treeCover;

						// Create the container for all the results
						// Add this config to Fires so the Fires request knows to add data here
						ReportRenderer.renderContainers(config);
						_fireQueriesToRender.push(config);

						all([
								this._getTotalLossAnalysis(config),
								this._getClearanceAlertAnalysis(config),
								this._getCompositionAnalysis(config)
						]).then(function() {
								deferred.resolve(true);
						});

						return deferred.promise;
				},

				getTreeCoverLossResults: function() {
						this._debug('Fetcher >>> getTreeCoverLossResults');
						var deferred = new Deferred(),
								config = ReportConfig.treeCoverLoss,
								url = ReportConfig.imageServiceUrl,
								self = this;
								var renderConfig = config.renderingRule;

								if (report.minDensity && report.datasets.soy) {
									renderConfig.rasterFunctionArguments.Raster.rasterFunctionArguments.InputRanges = [0, report.minDensity, report.minDensity, 101];
								} else {
									renderConfig.rasterFunctionArguments.Raster.rasterFunctionArguments.InputRanges = [0, 30, 30, 101];
								}

								var renderingRule = JSON.stringify(renderConfig);

								var content = {
										geometryType: 'esriGeometryPolygon',
										geometry: JSON.stringify(report.geometry),
										renderingRule: renderingRule,
										pixelSize: ReportConfig.pixelSize,
										f: 'json'
								};

						// Create the container for all the result
						ReportRenderer.renderTotalLossContainer(config);
						ReportRenderer.renderCompositionAnalysisLoader(config);

						function success(response) {
								if (response.histograms.length > 0) {
										ReportRenderer.renderTreeCoverLossData(response.histograms[0].counts, content.pixelSize, config);
										ReportRenderer.renderCompositionAnalysis(response.histograms[0].counts, content.pixelSize, config);
								} else {
										ReportRenderer.renderAsUnavailable('loss', config);
								}
								deferred.resolve(true);
						}

						function failure(error) {
								var newFailure = function(){
									deferred.resolve(false);
								};
								if (error.details) {
										if (error.details[0] === 'The requested image exceeds the size limit.' && content.pixelSize !== 500) {
												content.pixelSize = 500;
												self._computeHistogram(url, content, success, failure);
										} else if (error.details.length === 0) {
												var maxDeviation = 10;
												content.geometry = JSON.stringify(geometryEngine.generalize(report.geometry, maxDeviation, true, 'miles'));
												self._computeHistogram(url, content, success, newFailure);
										} else {
												deferred.resolve(false);
										}
								} else {
										deferred.resolve(false);
								}
						}

						this._computeHistogram(url, content, success, failure);

						return deferred.promise;
				},

				getProdesResults: function() {
						this._debug('Fetcher >>> getProdesResults');
						var deferred = new Deferred(),
								config = ReportConfig.prodes,
								url = ReportConfig.imageServiceUrl,
								content = {
										geometryType: 'esriGeometryPolygon',
										geometry: JSON.stringify(report.geometry),
										mosaicRule: JSON.stringify(config.mosaicRule),
										pixelSize: ReportConfig.pixelSize,
										f: 'json'
								},
								self = this;

						// Create the container for all the result
						ReportRenderer.renderProdesContainer(config);
						// ReportRenderer.renderCompositionAnalysisLoader(config);

						function success(response) {
								if (response.histograms.length > 0) {
										ReportRenderer.renderProdesData(response.histograms[0].counts, content.pixelSize, config);
										// ReportRenderer.renderCompositionAnalysis(response.histograms[0].counts, content.pixelSize, config);
								} else {
										ReportRenderer.renderAsUnavailable('prodes', config);
								}
								deferred.resolve(true);
						}

						function failure(error) {
								var newFailure = function(){
									deferred.resolve(false);
								};
								if (error.details) {
										if (error.details[0] === 'The requested image exceeds the size limit.' && content.pixelSize !== 500) {
												content.pixelSize = 500;
												self._computeHistogram(url, content, success, failure);
										} else if (error.details.length === 0) {
												var maxDeviation = 10;
												content.geometry = JSON.stringify(geometryEngine.generalize(report.geometry, maxDeviation, true, 'miles'));
												self._computeHistogram(url, content, success, newFailure);
										} else {
												deferred.resolve(false);
										}
								} else {
										deferred.resolve(false);
								}
						}

						this._computeHistogram(url, content, success, failure);

						return deferred.promise;
				},

				getGuyraResults: function() {
						this._debug('Fetcher >>> getGuyraResults');
						var deferred = new Deferred(),
								config = ReportConfig.guyra,
								url = ReportConfig.imageServiceUrl,
								content = {
										geometryType: 'esriGeometryPolygon',
										geometry: JSON.stringify(report.geometry),
										mosaicRule: JSON.stringify(config.mosaicRule),
										pixelSize: ReportConfig.pixelSize,
										f: 'json'
								},
								self = this;

						// Create the container for all the result
						ReportRenderer.renderGuyraContainer(config);
						// ReportRenderer.renderCompositionAnalysisLoader(config);

						function success(response) {
								if (response.histograms.length > 0) {
										ReportRenderer.renderGuyraData(response.histograms[0].counts, content.pixelSize, config);
										// ReportRenderer.renderCompositionAnalysis(response.histograms[0].counts, content.pixelSize, config);
								} else {
										ReportRenderer.renderAsUnavailable('guyra', config);
								}
								deferred.resolve(true);
						}

						function failure(error) {
								var newFailure = function(){
									deferred.resolve(false);
								};
								if (error.details) {
										if (error.details[0] === 'The requested image exceeds the size limit.' && content.pixelSize !== 500) {
												content.pixelSize = 500;
												self._computeHistogram(url, content, success, failure);
										} else if (error.details.length === 0) {
												var maxDeviation = 10;
												content.geometry = JSON.stringify(geometryEngine.generalize(report.geometry, maxDeviation, true, 'miles'));
												self._computeHistogram(url, content, success, newFailure);
										} else {
												deferred.resolve(false);
										}
								} else {
										deferred.resolve(false);
								}
						}

						this._computeHistogram(url, content, success, failure);

						return deferred.promise;
				},

				getLegalClassResults: function() {
						this._debug('Fetcher >>> getLegalClassResults');
						var deferred = new Deferred(),
								config = ReportConfig.legalClass;

						// Create the container for all the results
						// Add this config to Fires so the Fires request knows to add data here
						ReportRenderer.renderContainers(config);
						_fireQueriesToRender.push(config);

						all([
								this._getTotalLossAnalysis(config),
								this._getClearanceAlertAnalysis(config)
						]).then(function() {
								deferred.resolve(true);
						});

						return deferred.promise;
				},

				getIndonesiaMoratoriumResults: function () {
						this._debug('Fetcher >>> getIndonesiaMoratoriumResults');
						var deferred = new Deferred(),
								config = ReportConfig.indonesiaMoratorium;

						// Create the container for all the results
						// Add this config to Fires so the Fires request knows to add data here
						ReportRenderer.renderContainers(config);
						_fireQueriesToRender.push(config);

						// true below as 2nd param means use simplified rendering rule, encoder.getSimpleRule
						all([
								this._getTotalLossAnalysis(config, true),
								this._getClearanceAlertAnalysis(config, true),
								this._getCompositionAnalysis(config)
						]).then(function() {
								deferred.resolve(true);
						});

						return deferred.promise;
				},

				getProtectedAreaResults: function() {
						this._debug('Fetcher >>> getProtectedAreaResults');
						var deferred = new Deferred(),
								config = ReportConfig.protectedArea;

						// Create the container for all the results
						// Add this config to Fires so the Fires request knows to add data here
						ReportRenderer.renderContainers(config);
						_fireQueriesToRender.push(config);

						// true below as 2nd param means use simplified rendering rule, encoder.getSimpleRule
						all([
								this._getTotalLossAnalysis(config, true),
								this._getClearanceAlertAnalysis(config, true),
								this._getCompositionAnalysis(config)
						]).then(function() {
								deferred.resolve(true);
						});

						return deferred.promise;
				},

				getCarbonStocksResults: function() {
						this._debug('Fetcher >>> getCarbonStocksResults');
						var deferred = new Deferred(),
								config = ReportConfig.carbonStock;
						// Create the container for all the results
						// Add this config to Fires so the Fires request knows to add data here
						ReportRenderer.renderContainers(config);
						_fireQueriesToRender.push(config);

						all([
								this._getTotalLossAnalysis(config),
								this._getClearanceAlertAnalysis(config)
						]).then(function() {
								deferred.resolve(true);
						});

						return deferred.promise;
				},

				getPlantationsSpeciesResults: function() {
						this._debug('Fetcher >>> getPlantationsSpeciesResults');
						var deferred = new Deferred(),
								config = ReportConfig.plantationsSpeciesLayer;
								console.dir(config);
						// Create the container for all the results
						// Add this config to Fires so the Fires request knows to add data here
						ReportRenderer.renderContainers(config);
						_fireQueriesToRender.push(config);

						all([
								this._getTotalLossAnalysis(config)
								// this._getClearanceAlertAnalysis(config)
						]).then(function() {
								deferred.resolve(true);
						});

						return deferred.promise;
				},

				getPlantationsTypeResults: function() {
						this._debug('Fetcher >>> getPlantationsTypeResults');
						var deferred = new Deferred(),
								config = ReportConfig.plantationsTypeLayer;
								console.dir(config);
						// Create the container for all the results
						// Add this config to Fires so the Fires request knows to add data here
						ReportRenderer.renderContainers(config);
						_fireQueriesToRender.push(config);

						all([
								this._getTotalLossAnalysis(config)
								// this._getClearanceAlertAnalysis(config)
						]).then(function() {
								deferred.resolve(true);
						});

						return deferred.promise;
				},

				getBrazilBiomesResults: function() {
						this._debug('Fetcher >>> getBrazilBiomesResults');
						var deferred = new Deferred(),
								config = ReportConfig.brazilBiomes;
						// Create the container for all the results
						// Add this config to Fires so the Fires request knows to add data here
						ReportRenderer.renderContainers(config);
						_fireQueriesToRender.push(config);

						all([
								this._getTotalLossAnalysis(config),
								this._getClearanceAlertAnalysis(config)
						]).then(function() {
								deferred.resolve(true);
						});

						return deferred.promise;
				},

				getIntactForestResults: function() {
						this._debug('Fetcher >>> getIntactForestResults');
						var deferred = new Deferred(),
								config = ReportConfig.intactForest;

						// Create the container for all the results
						// Add this config to Fires so the Fires request knows to add data here
						ReportRenderer.renderContainers(config);
						_fireQueriesToRender.push(config);

						// true below as 2nd param means use simplified rendering rule, encoder.getSimpleRule
						all([
								this._getTotalLossAnalysis(config, true),
								this._getClearanceAlertAnalysis(config, true)
						]).then(function() {
								deferred.resolve(true);
						});

						return deferred.promise;
				},

				getLandCoverGlobalResults: function() {
						this._debug('Fetcher >>> getLandCoverGlobalResults');
						var deferred = new Deferred(),
								config = ReportConfig.landCoverGlobal;

						// Create the container for all the results
						// Add this config to Fires so the Fires request knows to add data here
						ReportRenderer.renderContainers(config);
						_fireQueriesToRender.push(config);

						all([
								this._getTotalLossAnalysis(config),
								this._getClearanceAlertAnalysis(config)
						]).then(function() {
								deferred.resolve(true);
						});

						return deferred.promise;
				},

				getLandCoverAsiaResults: function() {
						this._debug('Fetcher >>> getLandCoverAsiaResults');
						var deferred = new Deferred(),
								config = ReportConfig.landCoverAsia;

						// Create the container for all the results
						// Add this config to Fires so the Fires request knows to add data here
						ReportRenderer.renderContainers(config);
						_fireQueriesToRender.push(config);

						all([
								this._getTotalLossAnalysis(config),
								this._getClearanceAlertAnalysis(config)
						]).then(function() {
								deferred.resolve(true);
						});

						return deferred.promise;
				},

				getLandCoverIndonesiaResults: function() {
						this._debug('Fetcher >>> getLandCoverIndonesiaResults');
						var deferred = new Deferred(),
								config = ReportConfig.landCoverIndo;

						// Create the container for all the results
						// Add this config to Fires so the Fires request knows to add data here
						ReportRenderer.renderContainers(config);
						_fireQueriesToRender.push(config);

						all([
								this._getTotalLossAnalysis(config),
								this._getClearanceAlertAnalysis(config)
						]).then(function() {
								deferred.resolve(true);
						});

						return deferred.promise;
				},

				getPeatLandsResults: function() {
						this._debug('Fetcher >>> getPeatLandsResults');
						var deferred = new Deferred(),
								config = ReportConfig.peatLands;

						// Create the container for all the results
						// Add this config to Fires so the Fires request knows to add data here
						ReportRenderer.renderContainers(config);
						_fireQueriesToRender.push(config);

						// true below as 2nd param means use simplified rendering rule, encoder.getSimpleRule
						all([
								this._getTotalLossAnalysis(config, true),
								this._getClearanceAlertAnalysis(config, true),
								this._getCompositionAnalysis(config)
						]).then(function() {
								deferred.resolve(true);
						});

						return deferred.promise;
				},

				getSoyResults: function() {
						this._debug('Fetcher >>> getSoyResults');

						var deferred = new Deferred(),
								config = ReportConfig.soy,
								self = this,
								url = ReportConfig.imageServiceUrl,
								soyCalcUrl = ReportConfig.soyCalcUrl;
								var renderConfig = config.renderingRule;

								if (report.minDensity) {
									renderConfig.rasterFunctionArguments.Raster.rasterFunctionArguments.InputRanges = [0, report.minDensity, report.minDensity, 101];
								} else {
									renderConfig.rasterFunctionArguments.Raster.rasterFunctionArguments.InputRanges = [0, 30, 30, 101];
								}

								var renderingRule = JSON.stringify(renderConfig);

								var content = {
										geometryType: 'esriGeometryPolygon',
										geometry: JSON.stringify(report.geometry),
										renderingRule: renderingRule,
										pixelSize: ReportConfig.pixelSize,
										f: 'json'
								};

								self.soyGeom = report.geometry;

								var soyAreaContent = {
										geometryType: 'esriGeometryPolygon',
										geometry: JSON.stringify(report.geometry),
										pixelSize: ReportConfig.pixelSize,
										f: 'json'
								};

						// Create the container for all the result
						ReportRenderer.renderSoyContainer(config);

						function success(response) {
							// TODO: Our computeHistogram call to the analysis ImageServer is responding w/ an array length of
							// only 3, where before we had ~16; each year of data and the noData value. Since we need to count
							// every year of data up for their 'Recency' formula, this is breaking that calculation.
								if (response.histograms.length > 0) {
										ReportRenderer.renderSoyData(response.histograms[0].counts, content.pixelSize, config, self.soyGeom);
										ReportRenderer.renderCompositionAnalysis(response.histograms[0].counts, content.pixelSize, config, self.soyAreaResult);
								} else {
										ReportRenderer.renderAsUnavailable('soy', config);
								}
								deferred.resolve(true);
						}

						function failure(error) {
								var newFailure = function(){
									deferred.resolve(false);
								};
								if (error.details) {
										if (error.details[0] === 'The requested image exceeds the size limit.' && content.pixelSize !== 500) {
												content.pixelSize = 500;
												self._computeHistogram(url, content, success, failure);
										} else if (error.details.length === 0) {
												var maxDeviation = 10;
												content.geometry = JSON.stringify(geometryEngine.generalize(report.geometry, maxDeviation, true, 'miles'));
												self._computeHistogram(url, content, success, newFailure);
										} else {
												deferred.resolve(false);
										}
								} else {
										deferred.resolve(false);
								}
						}

						function soyAreaFailure(error) {
								console.log('error:', error);
								self._computeHistogram(url, content, success, failure);
						}

						function soyAreaSuccess(response) {
								console.log(response);
								if (response.histograms.length > 0) {
										self.soyAreaResult = response.histograms[0].counts;
										self._computeHistogram(url, content, success, failure);
								} else {
										self._computeHistogram(url, content, success, failure);
								}
						}

						// this._computeHistogram(url, content, success, failure);
						this._computeHistogram(soyCalcUrl, soyAreaContent, soyAreaSuccess, soyAreaFailure);

						return deferred.promise;

						//
						//
						// // This query is only temporary until moratorium data is added to the main layer above
						// // This needs to be addressed so this code can be removed

						// params2 = new Query();
						// params2.geometry = polygon;
						// params2.returnGeometry = false;
						// params2.outFields = ['moratorium'];
						// time.setDate(time.getDate() - 8);
						// dateString = time.getFullYear() + '-' + (time.getMonth() + 1) + '-' +
						// 		time.getDate() + ' ' + time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds();
						// params2.where = 'ACQ_DATE > date \'' + dateString + '\'';
						//
						// all([
						// 		task1.execute(params1),
						// 		task2.execute(params2)
						// ]).then(function(results) {
						// 		ReportRenderer.renderFireData(_fireQueriesToRender, results);
						// 		deferred.resolve(true);
						// });
						//
						// // Handle the possibility of these functions both erroring out
						// task1.on('error', function() {
						// 		deferred.resolve(false);
						// });

				},

				getRSPOResults: function() {
						this._debug('Fetcher >>> getRSPOResults');
						var deferred = new Deferred(),
								config = ReportConfig.rspo,
								url = ReportConfig.imageServiceUrl,
								encoder = this._getEncodingFunction(config.lossBounds, config.bounds),
								renderingRule = encoder.render(ReportConfig.totalLoss.rasterId, config.rasterId),
								content = {
										geometryType: 'esriGeometryPolygon',
										geometry: JSON.stringify(report.geometry),
										renderingRule: renderingRule,
										pixelSize: ReportConfig.pixelSize,
										f: 'json'
								},
								self = this;

						function success(res) {
								ReportRenderer.renderRSPOData(res, config, encoder);
								deferred.resolve(true);
						}

						function failure(error) {
								if (error.details) {
										if (error.details[0] === 'The requested image exceeds the size limit.' && content.pixelSize !== 500) {
												content.pixelSize = 500;
												self._computeHistogram(url, content, success, failure);
										} else {
												deferred.resolve(false);
										}
								} else {
										deferred.resolve(false);
								}
						}

						ReportRenderer.renderRSPOContainer(config);
						this._computeHistogram(url, content, success, failure);
						return deferred.promise;
				},

				// Main Query Calls Go Here

				_getTotalLossAnalysis: function(config, useSimpleEncoderRule) {
						this._debug('Fetcher >>> _getTotalLossAnalysis');
						var deferred = new Deferred(),
								lossConfig = ReportConfig.totalLoss,
								url = ReportConfig.imageServiceUrl,
								encoder = this._getEncodingFunction(lossConfig.bounds, config.bounds),
								rasterId = config.rasterRemap ? config.rasterRemap : config.rasterId,
								renderingRule = useSimpleEncoderRule ?
										encoder.getSimpleRule(lossConfig.rasterId, rasterId) :
										encoder.render(lossConfig.rasterId, rasterId),
								content = {
										geometryType: 'esriGeometryPolygon',
										geometry: JSON.stringify(report.geometry),
										renderingRule: renderingRule,
										pixelSize: ReportConfig.pixelSize,
										f: 'json'
								},
								self = this;

						function success(response) {
								if (response.histograms.length > 0) {
										ReportRenderer.renderLossData(response.histograms[0].counts, content.pixelSize, config, encoder, useSimpleEncoderRule);
								} else {
										// Add some dummy 0's
										var zerosArray = Array.apply(null, new Array(lossConfig.labels.length)).map(Number.prototype.valueOf, 0);
										ReportRenderer.renderLossData(zerosArray, content.pixelSize, config, encoder, useSimpleEncoderRule);
										//ReportRenderer.renderAsUnavailable('loss', config);
								}
								deferred.resolve(true);
						}

						function failure(error) {
								if (error.details) {
										if (error.details[0] === 'The requested image exceeds the size limit.' && content.pixelSize !== 500) {
												content.pixelSize = 500;
												self._computeHistogram(url, content, success, failure);
										} else {
												deferred.resolve(false);
										}
								} else {
										deferred.resolve(false);
								}
						}

						// If the report analyzeTreeCoverLoss is false, just resolve here
						//if (report.analyzeTreeCoverLoss) {
						this._computeHistogram(url, content, success, failure);
						//} else {
						// deferred.resolve(true);
						//}

						return deferred.promise;
				},

				_getClearanceAlertAnalysis: function(config, useSimpleEncoderRule) {
						this._debug('Fetcher >>> _getClearanceAlertAnalysis');
						var deferred = new Deferred(),
								clearanceConfig = ReportConfig.clearanceAlerts,
								url = ReportConfig.clearanceAnalysisUrl,
								self = this,
								renderingRule,
								rasterId,
								content,
								encoder;

						config = _.clone(config);

						function success(response) {
								if (response.histograms.length > 0) {
										ReportRenderer.renderClearanceData(response.histograms[0].counts, content.pixelSize, config, encoder, useSimpleEncoderRule);
								} else {
										// Add some dummy 0's
										var zerosArray = Array.apply(null, new Array(report.clearanceLabels.length)).map(Number.prototype.valueOf, 0);
										ReportRenderer.renderClearanceData(zerosArray, content.pixelSize, config, encoder, useSimpleEncoderRule);
										//ReportRenderer.renderAsUnavailable('clearance', config);
								}
								deferred.resolve(true);
						}

						function failure(error) {
							var newFailure = function(){
								deferred.resolve(false);
							};
							if (error.details) {
									if (error.details[0] === 'Invalid cell size') {

											var polys = [];

											// var unionedGeom;


											// var unionedGeom = new Polygon(report.geometry.rings[0], new SpatialReference(54012));

											// for (var j = 1; j < report.geometry.rings.length; j++) {
											//   // var poly = new Polygon(report.geometry.rings[j], new SpatialReference(54012));
											//   //
											//   // var intersects = geometryEngine.intersects(unionedGeom, poly);
											//   // if (intersects === false) {
											//   //     unionedGeom = geometryEngine.union([unionedGeom, poly]);
											//   // }
											//
											//
											//   // polys.push(poly);
											//   polys.concat(report.geometry.rings[j]);
											// }

											arrayUtils.forEach(report.geometry.rings, function (ring) {
												if (ring) {
													polys = polys.concat(ring);
												}
											});

											var poly = new Polygon(polys);
											// report.geometry = geometryEngine.simplify(poly);
											// report.geometry = geometryEngine.union(polys);
											// report.geometry = unionedGeom;

											report.mapGeometry = poly;

											content.geometry = JSON.stringify(report.geometry);


											self._computeHistogram(url, content, success, newFailure);
									} else {
											deferred.resolve(false);
									}
							} else {
									deferred.resolve(false);
							}
								// deferred.resolve(false);
						}

						/*
						* Some layers have special ids that need to be overwritten from the config becuase
						* the config powers multiple charts and the clearance alerts analysis is the onlyone that
						* uses a different value, if more layers need this, give them a 'formaId' in report/config.js
						*/
						if (config.formaId) {
								config.rasterId = config.formaId;
								if (config.includeFormaIdInRemap) {
										config.rasterRemap.rasterFunctionArguments.Raster = config.formaId;
								}
						}

						encoder = this._getEncodingFunction(report.clearanceBounds, config.bounds);
						rasterId = config.rasterRemap ? config.rasterRemap : config.rasterId;
						renderingRule = useSimpleEncoderRule ?
								encoder.getSimpleRule(clearanceConfig.rasterId, rasterId) :
								encoder.render(clearanceConfig.rasterId, rasterId);
						// report.geometry.rings = [report.geometry.rings[report.geometry.rings.length - 1]];
						content = {
								geometryType: 'esriGeometryPolygon',
								geometry: JSON.stringify(report.geometry),
								renderingRule: renderingRule,
								pixelSize: 500, // FORMA data has a pixel size of 500 so this must be 500 otherwise results will be off
								f: 'json'
						};

						// content.geometry = JSON.stringify(geometryEngine.generalize(report.geometry, 1000, true, 'miles'));
						// content.geometry = geometryEngine.simplify(content.geometry);

						this._computeHistogram(url, content, success, failure);

						return deferred.promise;
				},

				getGladResults: function(config, useSimpleEncoderRule) {
						this._debug('Fetcher >>> getGladResults');

						var deferred = new Deferred(),
								gladConfig = ReportConfig.glad,
								url = gladConfig.url,
								gladIds = [6, 4, 9],
								self = this,
								content,
								content2,
								content3,
								encoder;

						if (window.payload.datasets.gladConfirmed === true) {
							url = gladConfig.confidentUrl;
							gladIds = [5, 7, 8];
						}

						config = _.clone(gladConfig);

						// Create the container for all the result
						ReportRenderer.renderGladContainer(config);

						function success(response) {

								if (response.length > 0) {
									ReportRenderer.renderGladData(response, config, encoder, useSimpleEncoderRule);
									// ReportRenderer.renderGladData(response.histograms[0].counts, content.pixelSize, config, encoder, useSimpleEncoderRule);
								} else {
									ReportRenderer.renderAsUnavailable('glad', config);
								// 		// Add some dummy 0's
								// 		var zerosArray = Array.apply(null, new Array(report.clearanceLabels.length)).map(Number.prototype.valueOf, 0);
								// 		ReportRenderer.renderGladData(zerosArray, content.pixelSize, config, encoder, useSimpleEncoderRule);
								}
								deferred.resolve(true);
						}

						function failure(error) {
								if (error.details) {
										if (error.details[0] === 'The requested image exceeds the size limit.' && content.pixelSize !== 500) {
												content.pixelSize = 500;
												self._computeHistogram(url, content, success, failure);
										} else {
												deferred.resolve(false);
										}
								} else {
										deferred.resolve(false);
								}
						}

						function formatGlad(year, counts) {
							var results = [];
							for (let i = 0; i < counts.length; i++) {
								results.push([new Date(year, 0, i + 1).getTime(), counts[i] || 0]);
							}
							return results;
						}

						encoder = this._getEncodingFunction(report.clearanceBounds, config.bounds);

						content = {
								geometryType: 'esriGeometryPolygon',
								geometry: JSON.stringify(report.geometry),
								mosaicRule: JSON.stringify({
										'mosaicMethod': 'esriMosaicLockRaster',
										'lockRasterIds': [gladIds[0]],
										'ascending': true,
										'mosaicOperation': 'MT_FIRST'
								}),
								pixelSize: 100,
								f: 'json'
						};
						content2 = {
								geometryType: 'esriGeometryPolygon',
								geometry: JSON.stringify(report.geometry),
								mosaicRule: JSON.stringify({
										'mosaicMethod': 'esriMosaicLockRaster',
										'lockRasterIds': [gladIds[1]],
										'ascending': true,
										'mosaicOperation': 'MT_FIRST'
								}),
								pixelSize: 100,
								f: 'json'
						};
						content3 = {
								geometryType: 'esriGeometryPolygon',
								geometry: JSON.stringify(report.geometry),
								mosaicRule: JSON.stringify({
										'mosaicMethod': 'esriMosaicLockRaster',
										'lockRasterIds': [gladIds[2]],
										'ascending': true,
										'mosaicOperation': 'MT_FIRST'
								}),
								pixelSize: 100,
								f: 'json'
						};

						all([
								this._computeHistogram(url, content),
								this._computeHistogram(url, content2),
								this._computeHistogram(url, content3)
						]).then(function(results) {

							var alerts = [];
							if (results[0] && results[0].histograms[0]) {
								if (results[0].histograms[0].counts.length < 366) {
									for (var j = results[0].histograms[0].counts.length; j < 366; j++) {
										results[0].histograms[0].counts.push(0);
									}
								}
								alerts = alerts.concat(formatGlad('2015', results[0].histograms[0].counts));
							}

							if (results[1] && results[1].histograms[0]) {
								if (results[1].histograms[0].counts.length < 366) {
									for (var k = results[1].histograms[0].counts.length; k < 366; k++) {
										results[1].histograms[0].counts.push(0);
									}
								}
								alerts = alerts.concat(formatGlad('2016', results[1].histograms[0].counts));
							}

							if (results[2] && results[2].histograms[0]) {
								alerts = alerts.concat(formatGlad('2017', results[2].histograms[0].counts));
							}
							success(alerts);
							deferred.resolve(true);
						});

						return deferred.promise;
				},

				_getCompositionAnalysis: function(config) {

						ReportRenderer.renderCompositionAnalysisLoader(config);

						var deferred = new Deferred(),
								url = ReportConfig.imageServiceUrl,
								compositionConfig = config.compositionAnalysis,
								content = {
										geometryType: 'esriGeometryPolygon',
										geometry: JSON.stringify(report.geometry),
										mosaicRule: JSON.stringify({
												'mosaicMethod': 'esriMosaicLockRaster',
												'lockRasterIds': [compositionConfig.rasterId],
												'ascending': true,
												'mosaicOperation': 'MT_FIRST'
										}),
										pixelSize: ReportConfig.pixelSize,
										f: 'json'
								},
								self = this;

						function success(response) {

								if (response.histograms.length > 0) {
										ReportRenderer.renderCompositionAnalysis(response.histograms[0].counts, content.pixelSize, config);
								} else {
										ReportRenderer.renderAsUnavailable('composition', config);
								}
								deferred.resolve(true);
						}

						function failure(error) {
								if (error.details) {
										if (error.details[0] === 'The requested image exceeds the size limit.' && content.pixelSize !== 500) {
												content.pixelSize = 500;
												self._computeHistogram(url, content, success, failure);
										} else {
												deferred.resolve(false);
										}
								} else {
										deferred.resolve(false);
								}
						}

						this._computeHistogram(url, content, success, failure);

						return deferred.promise;
				},

				_getSuitabilityAnalysis: function() {
						this._debug('Fetcher >>> _getSuitabilityAnalysis');
						var deferred = new Deferred(),
								config = ReportConfig.suitability;

						// Create the container for the results
						ReportRenderer.renderSuitabilityContainer(config);

						// Offload the work to Suitability as it is several small requests
						Suitability.getSuitabilityData().then(function(payload) {
								ReportRenderer.renderSuitabilityData(config, payload);
								Suitability.getCompositionAnalysis().then(function (results) {
										ReportRenderer.renderSuitabilityCompositionChart(results);
										deferred.resolve(true);
								});
						});

						return deferred.promise;
				},

				_getMillPointAnalysis: function() {

						this._debug('Fetcher >>> _getMillPointAnalysis');
						var deferred = new Deferred(),
								config = ReportConfig.millPoints,
								requests = [],
								results = [],
								currentMill,
								millPoint;
								// customDeferred = new Deferred(),
								// knownDeferred = new Deferred(),
								// customMills = [],
								// knownMills = [];

						// Create the container for the results
						ReportRenderer.renderMillContainer(config);

						// Analyze all the mills with the mill-api
						arrayUtils.forEach(report.mills, function (mill) {
							// getMillRisk is an es6 module compiled to es5, it exports a default function which outside an es6 app,
							// whether it is CJS, AMD, or global, needs to be accessed as getMillRisk.default
							// It takes an esri Point object and a label, and optionally a radius
							if (mill.type === 'circle') {
								var polygon = new Polygon(mill.geometry);
								var extent = polygon && polygon.getExtent();
								millPoint = extent && extent.getCenter();
							} else {
								millPoint = new Point(mill.point.geometry);
							}
							if (millPoint) {
								requests.push({ point: millPoint, name: mill.label});
							}
						});

						function handleResponse (mill) {
							results.push(mill);
							console.log(mill);
							currentMill = requests.pop();
							if (currentMill) {
								console.log(currentMill);
								getMillRisk.default(currentMill.point, currentMill.name).then(handleResponse);
							} else {
								ReportRenderer.renderMillAssessment(results, config);
								deferred.resolve(true);
							}
						}

						currentMill = requests.pop();
						console.log(currentMill);
						getMillRisk.default(currentMill.point, currentMill.name).then(handleResponse);

						// all(requests).then(function (mills) {
						// 	ReportRenderer.renderMillAssessment(mills, config);
						// 	deferred.resolve(true);
						// });

						return deferred.promise;
				},

				_getFireAlertAnalysis: function() {
						this._debug('Fetcher >>> _getFireAlertAnalysis');
						var deferred = new Deferred(),
								polygon = new Polygon(report.geometry),
								time = new Date(),
								dateString = '',
								params2,
								params1,
								task2,
								task1;

						params1 = new Query();
						task1 = new QueryTask(ReportConfig.fires.url + '/4');
						params1.geometry = polygon;
						params1.returnGeometry = false;
						params1.outFields = ['*'];
						params1.where = '1 = 1';

						//TODO: The way we could replace potico entirely for the report is the above QT and the report's firesQueryUrl:
						//we could take the report's area, and selectByLocation on the service we currently care about (protected areas,
						// intact forests, peatlands, etc: Whatever they turned on in the analysis). Then we have an array of features: if
						// there is more than one, combine their geometry, and run a QT for count on active Fires, passing in that geometry


						// This query is only temporary until moratorium data is added to the main layer above
						// This needs to be addressed so this code can be removed
						task2 = new QueryTask('https://gis-gfw.wri.org/arcgis/rest/services/Fires/FIRMS_ASEAN/MapServer/0');
						params2 = new Query();
						params2.geometry = polygon;
						params2.returnGeometry = false;
						params2.outFields = ['moratorium'];
						time.setDate(time.getDate() - 8);
						dateString = time.getFullYear() + '-' + (time.getMonth() + 1) + '-' +
								time.getDate() + ' ' + time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds();
						params2.where = 'ACQ_DATE > date \'' + dateString + '\'';

						all([
								task1.execute(params1),
								task2.execute(params2)
						]).then(function(results) {
								ReportRenderer.renderFireData(_fireQueriesToRender, results);
								deferred.resolve(true);
						});

						// Handle the possibility of these functions both erroring out
						task1.on('error', function() {
								deferred.resolve(false);
						});

						// task2.on('error', function() {
						//     deferred.resolve(false);
						// });

						return deferred.promise;
				},

				_getClearanceBounds: function() {
						this._debug('Fetcher >>> _getClearanceBounds');
						var config = ReportConfig.clearanceBounds,
								deferred = new Deferred(),
								incrementer = 0,
								month,
								req;

						//if (report.analyzeClearanceAlerts) {
						req = esriRequest({
								url: config.url,
								content: {
										f: 'pjson'
								},
								handleAs: 'json',
								callbackParamName: 'callback'
						});

						req.then(function(res) {
								report.clearanceBounds = [res.minValues[0], res.maxValues[0]];
								report.clearanceLabels = [];
								for (var i = res.minValues[0], length = res.maxValues[0]; i <= length; i++) {
										month = i % 12 === 0 ? 12 : i % 12;
										report.clearanceLabels.push(month + '-' + (config.baseYearLabel + incrementer));
										if (i % 12 === 0) {
												++incrementer;
										}
								}

								// For the meantime, we need to slice the first 12 values out to remove 2013 years from this
								// When the new service gets min and max values set so that I can get the bounds from there
								// report.clearanceBounds[0] = 13;
								// report.clearanceLabels = report.clearanceLabels.slice(12);

								deferred.resolve(true);
						}, function(err) {
								deferred.resolve(false, err);
						});
						// } else {
						// 	deferred.resolve(true);
						// }

						return deferred.promise;

				},

				_getEncodingFunction: function(arrayA, arrayB, options) {

						return {
								A: arrayFromBounds(arrayA),
								B: arrayFromBounds(arrayB),
								getSimpleRule: function(id1, id2) {
										return JSON.stringify({
												'rasterFunction': 'Arithmetic',
												'rasterFunctionArguments': {
														'Raster': id1,
														'Raster2': id2,
														'Operation': 3
												}
										});
								},
								renderRule: function(id1, id2) {
										return {
												'rasterFunction': 'Arithmetic',
												'rasterFunctionArguments': {
														'Raster': {
																'rasterFunction': 'Arithmetic',
																'rasterFunctionArguments': {
																		'Raster': {
																				'rasterFunction': 'Remap',
																				'rasterFunctionArguments': {
																						'InputRanges': [this.A[0], (this.A[this.A.length - 1]) + 1],
																						'OutputValues': [this.B.length],
																						'Raster': id1,
																						'AllowUnmatched': false
																				}
																		},
																		'Raster2': id1,
																		'Operation': 3
																}
														},
														'Raster2': id2,
														'Operation': 1
												}
										};
								},
								render: function(id1, id2) {
										return JSON.stringify(this.renderRule(id1, id2));
								},
								encode: function(a, b) {
										// Get Unique Value for Two Input Values
										return this.B.length * a + b;
								},
								decode: function(value) {
										// Ge the input values back from a known output value
										var b = value % this.B.length;
										var a = (value - b) / this.B.length;
										return [a, b];
								}
						};

				},

				/*
						Simple wrapper function for making requests to computeHistogram
				*/
				_computeHistogram: function(url, content, callback, errback) {

					if (callback && errback) {
						var req = esriRequest({
								url: url + '/computeHistograms',
								content: content,
								handleAs: 'json',
								callbackParamName: 'callback',
								timeout: 60000
						}, {
								usePost: true
						});

						req.then(callback, errback);
					} else {
						return esriRequest({
								url: url + '/computeHistograms',
								content: content,
								handleAs: 'json',
								callbackParamName: 'callback',
								timeout: 60000
						}, {
								usePost: true
						});
					}
				},

				/*
					 Wrapper function for logging messages
				*/
				_debug: function(msg) {
						console.log(msg);
				}


		};

});

define('report/Generator',[
    'dojo/on',
    'dojo/dom',
    'dojo/query',
    'esri/config',
    'dojo/request/xhr',
    'dojo/Deferred',
    'dojo/dom-class',
    'dojo/dom-style',
    'dojo/promise/all',
    'dojo/_base/array',
    'dijit/Dialog',
    'dojox/validate/web',
    'esri/geometry/Point',
    'esri/geometry/Polygon',
    'esri/SpatialReference',
    'esri/tasks/GeometryService',
    'esri/geometry/geometryEngine',
    'esri/geometry/webMercatorUtils',
    'utils/Analytics',
    'lodash',
    // Local Modules from report folder
    'report/config',
    'report/Fetcher',
    'report/CSVExporter',
    // Temp
    'esri/units',
    'esri/geometry/Circle'
], function (on, dom, dojoQuery, esriConfig, xhr, Deferred, domClass, domStyle, all, arrayUtils, Dialog, validate, Point, Polygon, SpatialReference, GeometryService, geometryEngine, webMercatorUtils, Analytics, _, Config, Fetcher, CSVExporter, Units, Circle) {

    window.report = {};

    return {

        init: function() {
            // Payload is passed as Global Payload object, grab and make sure its defined before doing anything else
            if (window.payload) {
                this.addConfigurations();
                this.prepareForAnalysis();
                this.addContentAndEvents();
            }
        },

        addConfigurations: function() {

            arrayUtils.forEach(Config.corsEnabledServers, function(server) {
              esriConfig.defaults.io.corsEnabledServers.push(server);
            });

            // Set defaults for Highcharts
            Highcharts.setOptions({
              chart: {
                style: { fontFamily: "Fira Sans', 'fira_sans_otregular', Georgia, serif" }
              }
            });

        },

        addContentAndEvents: function () {
          // Set the app title, if we are analyzing multiple mills, change the name to "Selected mills"
          var title = report.mills && report.mills.length > 1 ? 'Selected mills' : window.payload.title;
          this.setTitle(title);
          // Setup events for the header
          this.setupHeader();
          // Create a Dojo Dialog and add it, this will be going away in the future
          // when we import Albert's subcription dialog from the map
          this.addSubscriptionDialog();
          // Add an option to download chart data as a CSV file
          this.addCSVOptionToHighcharts();
        },

        /**
        * @param {string} title
        */
        setTitle: function(title) {
            document.getElementById('title').innerHTML = title;
        },

        // 20141217 CRB - Added info icon to Total Calculated Area in report header
        setupHeader: function () {
            var node = dom.byId('total-area-info-icon');
            on(node, 'click', function(evt) {
              domClass.remove('total-area-info-popup', 'hidden');
            });
            node = dom.byId('total-area-close-info-icon');
            on(node, 'click', function(evt) {
              domClass.add('total-area-info-popup', 'hidden');
            });
        },

        addSubscriptionDialog: function() {
          var dialog = new Dialog({
                title: 'Subscribe to Alerts!',
                style: 'width: 300px;'
              }),
              self = this,
              content = "<div class='subscription-content'>" +
                "<div class='checkbox-container'><label><input id='fires_check' type='checkbox' value='fires' />Fire Alerts</label></div>" +
                "<span class='fires-instructions'>Tree Cover Loss Alerts: Please subscribe through the <a href='http://www.globalforestwatch.org/my_gfw/subscriptions/new' target='_blank'>Global Forest Watch Subscriptions App</a>" +
                '. Re-enter your areas of interest and follow the in-app instructions.</span>' +
                "<div class='email-container'><input id='user-email' type='text' placeholder='something@gmail.com'/></div>" +
                "<div class='submit-container'><button id='subscribe-now'>Subscribe</button></div>" +
                "<div id='form-response' class='message-container'></div>" +
                '</div>';

          dialog.setContent(content);

          on(dom.byId('subscribeToAlerts'), 'click', function() {
            dialog.show();
          });

          on(dom.byId('subscribe-now'), 'click', function() {
            // Show loading Wheel
            // It will be removed when there is an error or on complete
            self.subscribeToAlerts();
          });

        },

        addCSVOptionToHighcharts: function () {

            var self = this;

            function generateCSV () {
                // This refers to chart context, not Generator context
                // changing this or binding context to generateCSV will cause problems
                // as we need the context to be the chart
                var featureTitle = document.getElementById('title').innerHTML,
                    chartContext = this,
                    type = chartContext.options.chart.type,
                    lineEnding = '\r\n',
                    content = [],
                    csvData,
                    output;

                // All Charts have a title except RSPO Land Use Change Analysis
                // If the type is column, it's the RSPO Chart so return that for a title
                if (type === 'column') {
                  content.push('RSPO Land Use Change Analysis');
                } else if (chartContext.title && chartContext.title.textStr) {
                  content.push(chartContext.title.textStr);
                }
                content.push(featureTitle);

                // If type is bar it could be the loss charts or the suitable chart, check the number of xAxes.
                // The suitability composition breakdown has two x axes while all others have one
                // Use that as the determining factor but if more charts are added in the future,
                // this check may need to be updated
                if (type === 'bar' && chartContext.xAxis.length > 1) {
                    // Pass in the reference to the chart
                    csvData = CSVExporter.exportCompositionAnalysis(chartContext);
                    content = content.concat(csvData);
                } else if (type === 'pie') {
                    // Suitability by Legal Classification
                    // Pass in the reference to the chart
                    csvData = CSVExporter.exportSuitabilityByLegalClass(chartContext);
                    content = content.concat(csvData);
                } else {
                    // Its either a bar chart with one axis, line chart, or column chart
                    // Pass in the reference to the chart
                    if (chartContext.xAxis[0].categories) {
                      csvData = CSVExporter.exportSimpleChartAnalysis(chartContext);
                    } else {
                      csvData = CSVExporter.exportAlternateChartAnalysis(chartContext);
                    }
                    content = content.concat(csvData);
                }

                // If only the chart title and feature title are in, then no data was exported so
                // don't continue
                if (content.length > 1) {
                    output = content.join(lineEnding);
                }

                if (output) {
                    CSVExporter.exportCSV(output);
                }

                var value = type === 'column' ? 'RSPO Land Use Change Analysis' : chartContext.title.textStr;
                Analytics.sendEvent('Event', 'Download CSV', value);

            }

            Highcharts.getOptions().exporting.buttons.contextButton.menuItems.push({
                text: 'Download CSV',
                onclick: generateCSV
            });

        },

        prepareForAnalysis: function() {

            var self = this,
                geometryService = new GeometryService(Config.geometryServiceUrl),
                sr = new SpatialReference(102100),
                polygons,
                points,
                poly;

            // Next grab any suitability configurations if they are available, they will be used to perform
            // a suitability analysis on report.geometry
            report.suitable = window.payload.suitability;

            // Exclusively for the Soy layer's analysis, we want to see the loss layer's density for our
            // ImageServer call
            if (window.payload.minDensity) {
              report.minDensity = window.payload.minDensity;
            }

            // Lastly, grab the datasets from the payload and store them in report so we know which
            // datasets we will perform the above analyses on
            report.datasets = window.payload.datasets;

            // if (report.datasets.soy) {
            //   var soyTest = JSON.parse(window.payload.geometry);
            //   var soyArea = soyTest[0];
            //   var soyPoly = new Polygon(sr);
            //   soyPoly.addRing(soyArea.geometry.rings[soyArea.geometry.rings.length - 1]);
            //   var ext = soyPoly.getExtent();
            //
            //   var soyPoint = ext.getCenter();
            //
            //   report.centerPoints = [{
            //     geometry: soyPoint
            //   }];
            // }

            // Parse the geometry from the global payload object
            var areasToAnalyze = JSON.parse(window.payload.geometry);

            // If we have a single polygon, grab the geometry and begin
            // If we have a single circle, convert to polygon and then continue
            if (areasToAnalyze.length === 1) {
              var area = areasToAnalyze[0];
              if (area.geometry.center && !area.point) {
                report.geometry = new Polygon(area.geometry);
                report.centerPoints = [{
                  geometry: area.geometry.center
                }];
              } else if (area.geometry.radius) {
                poly = new Polygon(sr);
                poly.addRing(area.geometry.rings[area.geometry.rings.length - 1]);
                report.geometry = poly;
                if (area.point.geometry.x) {
                  report.centerPoints = [area.point];
                } else {
                  report.centerPoints = [{
                    geometry: area.geometry.center
                  }];
                }

                // Save the areas to the report.mills incase they are doing mill point analysis, we will need these
                area.geometry = report.geometry;
                report.mills = [area];
              } else if (area.geometry.type === 'polygon') {
                report.geometry = new Polygon(area.geometry);
              }
              this.beginAnalysis();

            } else {

              // First I will need to convert circles to polygons since unioning circles/computing histograms
              // has some unexpected outcomes
              polygons = [];
              points = [];
              report.centerPoints = [];
              arrayUtils.forEach(areasToAnalyze, function (feature) {
                points.push(feature.point);
                // Prototype chain gets broken when stringified, so create a new poly
                if (feature.geometry.type === 'polygon') {
                    poly = new Polygon(feature.geometry);
                    polygons.push(poly);
                }

                if (feature.geometry.center) {
                  var featureClone = _.clone(feature);
                  report.centerPoints.push(featureClone);
                  poly = new Polygon(sr);
                  poly.addRing(feature.geometry.rings[feature.geometry.rings.length - 1]);
                  polygons.push(poly);
                  // Update the Mill Geometry since it will be needed to get area
                  // The geometry was stringified when saved, this breaks the prototype chain
                  feature.geometry = poly;
                }
              });

              // Keep a reference of the mills
              report.mills = areasToAnalyze;

              // Now Union the Geometries, then reproject them into the correct spatial reference
              geometryService.union(polygons, function (unionedGeometry) {
                  poly = new Polygon(unionedGeometry);
                  report.geometry = poly;
                  self.beginAnalysis();
              });

            }

        },

        /*
            Get a lookup list of deferred functions to execute via _getArrayOfRequests
            Fire off a query to get the area of the analysis and clearance alert bounds if necessary
            split the lookup list based on the size to managable chunks using this._chunk
            execute each chunk synchronously so we dont overwhelm the server using processRequests
              -- These deferred functions will request data, visualize it, and insert it into dom (all in Fetcher)
            uses _getDeferredsForItems to return actual deferreds based on items in lookup list,
            Once the major requests are completed, then fire off the fires query
        */
        beginAnalysis: function() {

            var requests = this._getArrayOfRequests(),
                self = this,
                chunk,
                area;

            // Helper Function to Continue Making Requests if Necessary
            function processRequests() {
                // If the requests array has more chunks to process, process them, else, analysis is complete
                if (requests.length > 0) {
                    // Remove a chunk from the requests array
                    chunk = requests.shift();
                    // Get Deferreds, wait til they are done, then call self to check for more
                    all(self._getDeferredsForItems(chunk)).then(processRequests);
                } else {
                    self.getFiresAnalysis();
                }
            }

            // Simplify the Geometry
            report.geometry = geometryEngine.simplify(report.geometry);
            area = geometryEngine.planarArea(report.geometry) / 10000;
            // If the area is over 5,000,000 hectares, warn user this will take some time
            // and update the default value of the config item
            if (area > 5000000) {
              // Hold off on setting pixel size, seems to do more harm than good at the moment
              //Config.pixelSize = 500;

              var popup = $('#warning-popup');
              var content = $('#warning-popup-content');

              content.html(Config.messages.largeAreaWarning);
              popup.toggleClass('hidden');

              on.once($('#warning-popup-close-icon'), 'click', function () {
                content.html('');
                popup.toggleClass('hidden');
              });

              // Save original geometry for the map
              report.mapGeometry = report.geometry;
              report.geometry = geometryEngine.generalize(report.geometry, 2000, true);
            } else {
              report.mapGeometry = report.geometry;
              report.geometry = geometryEngine.generalize(report.geometry, 200, true);
            }

            // Get area
            report.areaPromise = Fetcher.getAreaFromGeometry(report.geometry);
            report.areaPromise.then(function (totalArea) {
              document.getElementById('total-area').innerHTML = totalArea ? totalArea : 'Not Available';
            });

            // If report.analyzeClearanceAlerts is true, get the bounds, else this resolves immediately and moves on
            all([
                Fetcher._getClearanceBounds()
            ]).then(function() {
                // Now that all dependencies and initial Queries are resolved, start processing all the analyses deferreds
                // If the number of requests is less then three, do all now, else chunk the requests and start processing them
                if (requests.length < 3) {
                    all(self._getDeferredsForItems(requests)).then(self.getFiresAnalysis.bind(self));
                } else {
                    // Get an array of arrays, each containing 3 lookup items so
                    // we can request three analyses at a time
                    requests = arrayChunk(requests, 3);
                    processRequests();
                }

            });

        },

        getFiresAnalysis: function() {
            var self = this;
            all([Fetcher._getFireAlertAnalysis()]).then(self.analysisComplete);
        },

        /*
            Analysis is complete, handle that here
        */
        analysisComplete: function() {

            // Generate Print Request to get URL
            Fetcher.setupMap();

            // Show Print Option as Enabled
            domClass.remove('print', 'disabled');

            // Add the Print Listener
            on(dom.byId('print'), 'click', function() {
                domStyle.set('total-area-info-popup', 'visibility', 'hidden');
                window.print();
            });

            // Remove all loading wheels and show error messages for the remaining ones
            dojoQuery('.loader-wheel').forEach(function(node) {
                // Ignore the Area Query, It's not part of all the deferreds and may not be done by now
                // so lets not prematurely show an error message, Fetcher.getAreaFromGeometry will show an
                // error message if it fails
                if (node.parentNode.id !== 'total-area' && node.parentNode.id !== 'print-map') {
                    node.parentNode.innerHTML = 'There was an error getting these results at this time.';
                }
            });

        },

        /* Helper Functions */

        /**
        * Returns array of strings representing which requests need to be made
        * @return  {array}
        * Deferred Mapping is in comments below this function
        */
        _getArrayOfRequests: function() {
            var requests = [];
            for (var key in report.datasets) {
                if (report.datasets[key]) {
                    requests.push(key);
                }
            }
            return requests;
        },

        /**
        *  @param  {array} items
        *  @return {array} of deferred functions
        */
        _getDeferredsForItems: function(items) {
            var deferreds = [];

            arrayUtils.forEach(items, function(item) {
                switch (item) {
                    case 'suit':
                        deferreds.push(Fetcher._getSuitabilityAnalysis());
                        break;
                    case 'mill':
                        deferreds.push(Fetcher._getMillPointAnalysis());
                        break;
                    case 'carbon':
                        deferreds.push(Fetcher.getCarbonStocksResults());
                        break;
                    case 'plantationsSpeciesLayer':
                        deferreds.push(Fetcher.getPlantationsSpeciesResults());
                        break;
                    case 'plantationsTypeLayer':
                        deferreds.push(Fetcher.getPlantationsTypeResults());
                        break;
                    case 'biomes':
                        deferreds.push(Fetcher.getBrazilBiomesResults());
                        break;
                    case 'intact':
                        deferreds.push(Fetcher.getIntactForestResults());
                        break;
                    case 'landCoverGlob':
                        deferreds.push(Fetcher.getLandCoverGlobalResults());
                        break;
                    case 'landCoverAsia':
                        deferreds.push(Fetcher.getLandCoverAsiaResults());
                        break;
                    case 'landCoverIndo':
                        deferreds.push(Fetcher.getLandCoverIndonesiaResults());
                        break;
                    case 'legal':
                        deferreds.push(Fetcher.getLegalClassResults());
                        break;
                    case 'peat':
                        deferreds.push(Fetcher.getPeatLandsResults());
                        break;
                    case 'soy':
                        deferreds.push(Fetcher.getSoyResults());
                        break;
                    case 'primForest':
                        deferreds.push(Fetcher.getPrimaryForestResults());
                        break;
                    case 'protected':
                        deferreds.push(Fetcher.getProtectedAreaResults());
                        break;
                    case 'rspo':
                        deferreds.push(Fetcher.getRSPOResults());
                        break;
                    case 'treeDensity':
                        deferreds.push(Fetcher.getTreeCoverResults());
                        break;
                    case 'treeCoverLoss':
                        deferreds.push(Fetcher.getTreeCoverLossResults());
                        break;
                    case 'indonesiaMoratorium':
                        deferreds.push(Fetcher.getIndonesiaMoratoriumResults());
                        break;
                    case 'prodes':
                        deferreds.push(Fetcher.getProdesResults());
                        break;
                    case 'guyraAlerts':
                        deferreds.push(Fetcher.getGuyraResults());
                        break;
                    case 'gladAlerts':
                        deferreds.push(Fetcher.getGladResults());
                        break;
                    default:
                        break;
                }

            });

            return deferreds;
        },

        subscribeToAlerts: function() {
            var geoJson = this.convertGeometryToGeometric(report.geometry),
                emailAddr = dom.byId('user-email').value,
                // formaCheck = dom.byId('forma_check').checked,
                firesCheck = dom.byId('fires_check').checked,
                errorMessages = [],
                messages = {};

            // Set up the text for the messages
            messages.invalidEmail = 'You must provide a valid email in the form.';
            messages.noSelection = 'You must select a checkbox from the form.';
            messages.formaSuccess = 'Thank you for subscribing to Forma Alerts.  You should receive a confirmation email soon.';
            messages.formaFail = 'There was an error with your request to subscribe to Forma alerts.  Please try again later.';
            messages.fireSuccess = 'Thank you for subscribing to Fires Alerts.  You should receive a confirmation email soon.';
            messages.fireFail = 'There was an error with your request to subscribe to Fires alerts.  Please try again later.';

            if (!validate.isEmailAddress(emailAddr)) {
                errorMessages.push(messages.invalidEmail);
            }

            if (!firesCheck) {
                errorMessages.push(messages.noSelection);
            }

            if (errorMessages.length > 0) {
                alert('Please fill in the following:\n' + errorMessages.join('\n'));
                return;
            } else {
              dom.byId('form-response').innerHTML = "<div class='loader-wheel subscribe'>subscribing</div>";
                // If both are checked, request both and show the appropriate responses
                // if (formaCheck && firesCheck) {
                //     var responses = [];
                //     all([
                //         this.subscribeToForma(geoJson, emailAddr),
                //         this.subscribeToFires(report.geometry, emailAddr)
                //     ]).then(function(results) {
                //         // Check the results and inform the user of the results
                //         if (results[0]) {
                //             responses.push(messages.formaSuccess);
                //         } else {
                //             responses.push(messages.formaFail);
                //         }
                //
                //         if (results[1]) {
                //             responses.push(messages.fireSuccess);
                //         } else {
                //             responses.push(messages.fireFail);
                //         }
                //
                //         dom.byId('form-response').innerHTML = responses.join('<br />');
                //
                //     });
                //
                //     // Else if just forma alerts are checked, subscribe to those and show the correct responses
                // } else if (formaCheck) {
                //     this.subscribeToForma(geoJson, emailAddr).then(function(res) {
                //         if (res) {
                //             dom.byId('form-response').innerHTML = messages.formaSuccess;
                //         } else {
                //             dom.byId('form-response').innerHTML = messages.formaFail;
                //         }
                //     });
                //     // Else if just fires alerts are checked, subscribe to those and show the correct responses
                // } else if (firesCheck) {
                    this.subscribeToFires(report.geometry, emailAddr).then(function(res) {
                        if (res) {
                            dom.byId('form-response').innerHTML = messages.fireSuccess;
                        } else {
                            dom.byId('form-response').innerHTML = messages.fireFail;
                        }
                    });
                // }

            }

        },

        subscribeToForma: function(geoJson, email) {
            var url = Config.alertUrl.forma,
                deferred = new Deferred(),
                req = new XMLHttpRequest(),
                params = JSON.stringify({
                    'topic': 'updates/forma',
                    'geom': '{"type": "' + geoJson.type + '", "coordinates":[' + JSON.stringify(geoJson.geom) + ']}',
                    'email': email
                }),
                res;

            req.open('POST', url, true);
            req.onreadystatechange = function() {
                if (req.readyState === 4) {
                    res = JSON.parse(req.response);
                    deferred.resolve(res.subscribe);
                }
            };
            // Handle any potential network errors here
            // If there is an application level error, catch it above
            req.addEventListener('error', function() {
                deferred.resolve(false);
            }, false);

            req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            req.send(params);
            return deferred.promise;
        },

        subscribeToFires: function(geometry, email) {
            var url = Config.alertUrl.fires,
                deferred = new Deferred(),
                // req = new XMLHttpRequest(),
                params = {
                    'features': JSON.stringify({
                        'rings': geometry.rings,
                        'spatialReference': geometry.spatialReference
                    }),
                    'msg_addr': email,
                    'msg_type': 'email',
                    'area_name': payload.title
                },
                res;

            xhr(url, {
                handleAs: 'json',
                method: 'POST',
                data: params
            }).then(function() {
                deferred.resolve(true);
            }, function(err) {
                deferred.resolve(false);
            });

            return deferred.promise;

        },

        convertGeometryToGeometric: function(geometry) {
            var sr = new SpatialReference({
                    wkid: 102100
                }),
                geometryArray = [],
                newRings = [],
                geo,
                pt;

            // Helper function to determine if the coordinate is already in the array
            // This signifies the completion of a ring and means I need to reset the newRings
            // and start adding coordinates to the new newRings array
            function sameCoords(arr, coords) {
                var result = false;
                arrayUtils.forEach(arr, function(item) {
                    if (item[0] === coords[0] && item[1] === coords[1]) {
                        result = true;
                    }
                });
                return result;
            }

            arrayUtils.forEach(geometry.rings, function(ringers) {
                arrayUtils.forEach(ringers, function(ring) {
                    pt = new Point(ring, sr);
                    geo = webMercatorUtils.xyToLngLat(pt.x, pt.y);
                    if (sameCoords(newRings, geo)) {
                        newRings.push(geo);
                        geometryArray.push(newRings);
                        newRings = [];
                    } else {
                        newRings.push(geo);
                    }
                });
            });

            return {
                geom: geometryArray.length > 1 ? geometryArray : geometryArray[0],
                type: geometryArray.length > 1 ? 'MultiPolygon' : 'Polygon'
            };
        }

    };

});

(function () {

  function loadScriptAsync(src, callback) {
    var s,
        r,
        t;
    r = false;
    s = document.createElement('script');
    s.type = 'text/javascript';
    s.src = src;
    s.onload = s.onreadystatechange = function() {
      //console.log( this.readyState ); //uncomment this line to see which ready states are called.
      if ( !r && (!this.readyState || this.readyState == 'complete') )
      {
        r = true;
        callback();
      }
    };
    t = document.getElementsByTagName('script')[0];
    t.parentNode.insertBefore(s, t);
  }

  var loadStyle = function(src) {
    var l = document.createElement('link');
    l.rel = 'stylesheet';
    l.type = 'text/css';
    l.href = src;
    document.getElementsByTagName('head')[0].appendChild(l);
  };

  // Load Non-Critical CSS Now
  loadStyle('http://js.arcgis.com/3.20/esri/css/esri.css');
  loadStyle('http://js.arcgis.com/3.20/dijit/themes/tundra/tundra.css');
  loadStyle('app/css/report.css');

  /* Global Helper Functions */
  /*
    takes an array of bounds and returns an array with every value between the bounds, ex.
    arrayFromBounds([1,5]) -> [1,2,3,4,5]
    @param {array} originalArray
    @return {array}
  */
  window.arrayFromBounds = function (array) {
    var res = [], index = array[0], length = array[1];
    for (index; index <= length; index++) {
      res.push(index);
    }
    return res;
  };

  /*
    @param {number} chunkSize size of each chunk of the returned array
    @return {array} an array or arrays with each array's length being the specified chunk size
  */
  window.arrayChunk = function (array, chunkSize) {
    var resultingArrays = [], index = 0;
    for(index; index < array.length; index += chunkSize)
      resultingArrays.push(array.slice(index, index + chunkSize));
    return resultingArrays;
  };

  window.requestAnimationFrame = (function() {
    return window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame;
  })();

  require(['report/Generator'], function (Generator) {

    var payloadReceived = false;

    loadScriptAsync('http://code.highcharts.com/highcharts.js', function() {
      loadScriptAsync('http://code.highcharts.com/modules/exporting.js', function() {

        // localStorage is the preferred mechanism, if not supported, get it from window
        if (localStorage) {
          window.payload = JSON.parse(localStorage.getItem('payload'));
          if (window.payload) { payloadReceived = true; }
        } else if (window.payload) {
          payloadReceived = true;
        }

        // If we have data, lets begin
        if (payloadReceived) {
          Generator.init();
        } else {
          // Emit a special event from the other window telling me the payload is ready
          document.addEventListener('PayloadReady', function () {
            payloadReceived = true;
          });
          // Give it 5 seconds and check again, if no data by now, something went wrong
          // This should take no more then 2 seconds
          setTimeout(function () {
            if (payloadReceived && window.payload) {
              Generator.init();
            } else {
              alert("There was an error generating the report at this time.  Please make sure your pop-up blocker is disabled and try again.");
            }
          }, 5000);
        }
      });
    });



  }); // End require

}());

define("app/js/report/reportBundle", function(){});

