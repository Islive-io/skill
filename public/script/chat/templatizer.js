(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof root === 'undefined' || root !== Object(root)) {
        throw new Error('templatizer: window does not exist or is not an object');
    } else {
        root.templatizer = factory();
    }
}(this, function () {
    var jade=function(){function r(r){return null!=r&&""!==r}function n(e){return Array.isArray(e)?e.map(n).filter(r).join(" "):e}var e={};return e.merge=function t(n,e){if(1===arguments.length){for(var a=n[0],s=1;s<n.length;s++)a=t(a,n[s]);return a}var i=n["class"],l=e["class"];(i||l)&&(i=i||[],l=l||[],Array.isArray(i)||(i=[i]),Array.isArray(l)||(l=[l]),n["class"]=i.concat(l).filter(r));for(var o in e)"class"!=o&&(n[o]=e[o]);return n},e.joinClasses=n,e.cls=function(r,t){for(var a=[],s=0;s<r.length;s++)a.push(t&&t[s]?e.escape(n([r[s]])):n(r[s]));var i=n(a);return i.length?' class="'+i+'"':""},e.attr=function(r,n,t,a){return"boolean"==typeof n||null==n?n?" "+(a?r:r+'="'+r+'"'):"":0==r.indexOf("data")&&"string"!=typeof n?" "+r+"='"+JSON.stringify(n).replace(/'/g,"&apos;")+"'":t?" "+r+'="'+e.escape(n)+'"':" "+r+'="'+n+'"'},e.attrs=function(r,t){var a=[],s=Object.keys(r);if(s.length)for(var i=0;i<s.length;++i){var l=s[i],o=r[l];"class"==l?(o=n(o))&&a.push(" "+l+'="'+o+'"'):a.push(e.attr(l,o,!1,t))}return a.join("")},e.escape=function(r){var n=String(r).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");return n===""+r?r:n},e.rethrow=function a(r,n,e,t){if(!(r instanceof Error))throw r;if(!("undefined"==typeof window&&n||t))throw r.message+=" on line "+e,r;try{t=t||require("fs").readFileSync(n,"utf8")}catch(s){a(r,null,e)}var i=3,l=t.split("\n"),o=Math.max(e-i,0),c=Math.min(l.length,e+i),i=l.slice(o,c).map(function(r,n){var t=n+o+1;return(t==e?"  > ":"    ")+t+"| "+r}).join("\n");throw r.path=n,r.message=(n||"Jade")+":"+e+"\n"+i+"\n\n"+r.message,r},e}();

    var templatizer = {};


    // frame.jade compiled template
    templatizer["frame"] = function tmpl_frame() {
        return '<div class="chat-container"><ul class="chat-userlist"></ul><div class="chat-input"><input type="text"/></div><ul class="chat-messages"></ul></div>';
    };

    // message.jade compiled template
    templatizer["message"] = function tmpl_message(locals) {
        var buf = [];
        var jade_mixins = {};
        var jade_interp;
        var locals_for_with = locals || {};
        (function(from, text) {
            buf.push('<li class="chat-message"><span class="chat-message-sender">' + jade.escape((jade_interp = from) == null ? "" : jade_interp) + ':&nbsp;</span><span class="chat-message-content">' + jade.escape((jade_interp = text) == null ? "" : jade_interp) + "</span></li>");
        }).call(this, "from" in locals_for_with ? locals_for_with.from : typeof from !== "undefined" ? from : undefined, "text" in locals_for_with ? locals_for_with.text : typeof text !== "undefined" ? text : undefined);
        return buf.join("");
    };

    // notification.jade compiled template
    templatizer["notification"] = function tmpl_notification(locals) {
        var buf = [];
        var jade_mixins = {};
        var jade_interp;
        var locals_for_with = locals || {};
        (function(text) {
            buf.push('<li class="chat-notification"><span>' + jade.escape((jade_interp = text) == null ? "" : jade_interp) + "</span></li>");
        }).call(this, "text" in locals_for_with ? locals_for_with.text : typeof text !== "undefined" ? text : undefined);
        return buf.join("");
    };

    // user.jade compiled template
    templatizer["user"] = function tmpl_user(locals) {
        var buf = [];
        var jade_mixins = {};
        var jade_interp;
        var locals_for_with = locals || {};
        (function(name) {
            buf.push('<li class="chat-user"><span>' + jade.escape((jade_interp = name) == null ? "" : jade_interp) + "</span></li>");
        }).call(this, "name" in locals_for_with ? locals_for_with.name : typeof name !== "undefined" ? name : undefined);
        return buf.join("");
    };

    return templatizer;
}));