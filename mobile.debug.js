//初始化变量
window.socketQueue = [];
window.socketStatus = false;
window.socket = null;
window.MID = Math.floor(Math.random() * 1000);
//加载js
document.write("<script language=javascript src='./utils/localStorage.js'></script >");
document.write("<script language=javascript src='./utils/onerror.js'></script >");
document.write("<script language=javascript src='./utils/log.js'></script >");
document.write("<script language=javascript src='./utils/other.js'></script >");
//连接socket
var tmpTimeout;

var url = window.socketurl || "ws://118.89.232.241:8888";
function wSocket(url) {
    var ws = new WebSocket(url);
    ws.onopen = function () {
        window.socket = ws;
        window.socketStatus = true;
        if (window.socketStatus) {
            //注册移动端ID
            var midDIV = document.createElement("div");
            midDIV.setAttribute("style", "position:fixed;top:10px;right:10px;color: red;background-color: #ccc;");
            midDIV.innerText = "MID:" + MID;
            document.body.appendChild(midDIV);
            ws.send(JSON.stringify({
                MID: MID
            }))
        }
        console.info("客户端已连接");
    };
    ws.onmessage = function (evt) {
        var json = {};
        try {
            json = JSON.parse(evt.data);
            //order为指令内容
            if (json.order) {
                var s = eval(json.order);
                // if (s != undefined) {
                //     console.log(s)
                // }
            }
            if (window.socketStatus) {
                if (json.clearQueue) {
                    window.socketQueue.forEach(function (value, index) {
                        window.socket.send(value);
                    })
                    window.socketQueue.splice(0)
                }
                if (json.syncStorage) {
                    localStorageList();
                }
                if (json.syncDeviceInfo) {
                    getDeviceInfo();
                }
            }

        } catch (e) {
            throw e;
        }
    };
    ws.onclose = function () {
        console.info("客户端已断开连接");
        window.socket = null;
        window.socketStatus = false;
        tmpTimeout = setTimeout(function () {
            new wSocket(url)
        }, 1000)
    };
    ws.onerror = function (evt) {
        console.info("错误");
        window.socket = null;
        window.socketStatus = false;
    };
}
setTimeout(function () {
    new wSocket(url);
}, window.delaytime || 1000)


