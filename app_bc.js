!function (t, e) {
    "object" == typeof exports && "undefined" != typeof module ? e(exports) : "function" == typeof define && define.amd ? define(["exports"], e) : e((t = t || self).yett = {})
}(this, function (t) {
    "use strict";
    var c = "javascript/blocked";

    function inArray (needle, haystack) {
         if((needle != undefined && needle != '') && (haystack != undefined && (typeof haystack == 'array' || typeof haystack == 'object'))){
             for(var i = 0; i < haystack.length; i++) {
                 if(needle.indexOf(haystack[i]) > -1) return true;
             }
         }
        return false;
    }
    var s = {};
    function getBlacklist(s){
        return new Promise(async function (resolve, reject) {
            if(s.blacklist != undefined) {
                resolve(s.blacklist);
            }else{
                var xobj = new XMLHttpRequest();
                xobj.open('GET', "https://oegmy1oa3h.execute-api.sa-east-1.amazonaws.com/blacklist/", false);
                xobj.onreadystatechange = async function () {
                    if (xobj.readyState == 4 && xobj.status == "200") {
                        var jsonData = await JSON.parse(xobj.responseText);
                        resolve( await jsonData.body);
                    }
                }
                xobj.send(null);
            }
        });
    }

    var u = {blacklisted: []},
        f = new MutationObserver(async function (t) {
            if (s.blacklist == undefined) {
                s.blacklist = await getBlacklist(s);
            }

            for (var e = 0; e < t.length; e++) for (var i = t[e].addedNodes, r = async function (t) {
                var r = i[t];
                if (1 === r.nodeType && "SCRIPT" === r.tagName || "IFRAME" === r.tagName || "IMG" === r.tagName) {
                    if ((r.src && (!r.type || t !== c) && (!s.blacklist || inArray(r.src, s.blacklist)))) {
                        u.blacklisted.push([r, r.type]), r.type = c;
                        r.addEventListener("beforescriptexecute", function t(e) {
                            r.getAttribute("type") === c && e.preventDefault(), r.removeEventListener("beforescriptexecute", t)
                        }), r.parentElement && r.parentElement.removeChild(r)
                    }
                }
            }, n = 0; n < i.length; n++) r(n)
        });
    f.observe(document.documentElement, {childList: !0, subtree: !0});
});
