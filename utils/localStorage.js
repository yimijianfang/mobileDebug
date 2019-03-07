//为localStorage每个键值设置getset
function loopStorage() {
    Object.getOwnPropertyNames(localStorage).forEach(function (key) {
        if (['setItem', 'removeItem', 'clear'].indexOf(key) == -1) {
            Object.defineProperty(localStorage, key, {
                get: function () {
                    return localStorage.getItem(key);
                },
                set: function (value) {
                    return localStorage.setItem(key, value)
                }
            })
        }
    })
}
//setItem
var orignalSetItem = localStorage.setItem;
localStorage.setItem = function (key, newValue) {
    var setItemEvent = new Event("setItemEvent");
    setItemEvent.key = key;
    orignalSetItem.apply(this, arguments);
    window.dispatchEvent(setItemEvent);
};
window.addEventListener("setItemEvent", function (e) {
    localStorageList();
});
//removeItem
var orignalremoveItem = localStorage.removeItem;
localStorage.removeItem = function (key, newValue) {
    var removeItemEvent = new Event("removeItemEvent");
    removeItemEvent.key = key;
    orignalremoveItem.apply(this, arguments);
    window.dispatchEvent(removeItemEvent);
};
window.addEventListener("removeItemEvent", function (e) {
    localStorageList();
});
//clear
var orignalclear = localStorage.clear;
localStorage.clear = function () {
    var clearEvent = new Event("clearEvent");
    orignalclear.apply(this);
    window.dispatchEvent(clearEvent);
};
window.addEventListener("clearEvent", function (e) {
    localStorageList();
});

function localStorageList() {
    var tmp = {};
    Object.keys(localStorage).forEach(function (key) {
        if (localStorage[key] != null) {
            tmp[key] = localStorage[key] || '';
        }
    })
    var returndata = JSON.stringify({
        level: 'localStorage',
        msg: tmp,
        trace: {},
        MID: MID || ""
    })
    if (socketStatus) {
        window.socket.send(returndata);
    }
    loopStorage()
}
var localStorageLength = 0;
setTimeout(function () {
    setInterval(function () {
        if (localStorage.length != localStorageLength) {
            localStorageList();
            localStorageLength = localStorage.length
        }
    }, 1000)
}, 2000)
