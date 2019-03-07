//接口调试工具
var ws = require("nodejs-websocket");
var relationDB = {}; // 内存关联表保存移动端和PC端connection对应关系
var server = ws.createServer(function (conn) {
    conn.on("text", function (str) {
        broadcast(str, conn)
    })
    conn.on("close", function (code, reason) {
        getCloseMID(conn);
        console.log("关闭连接")
    });
    conn.on("error", function (code, reason) {
        console.log("关闭连接")
    });
}).listen(8888)
console.log("服务启动成功")

String.prototype.endWith = function (endStr) {
    var d = this.length - endStr.length;
    return (d >= 0 && this.lastIndexOf(endStr) == d)
}
function getCloseMID(conn) {
    for (const key in relationDB) {
        if (relationDB.hasOwnProperty(key) && key.endWith('_self')) {
            if (relationDB[key] == conn) {
                delete relationDB[key];
                var MID = key.substring(0, key.length - 5);
                console.log('MID是' + MID);
                relationDB[MID].forEach(function (conn, index) {
                    conn.sendText(JSON.stringify({
                        level: 'MOPEN',
                        msg: {
                            MOPEN: false
                        }
                    }));
                })
                delete relationDB[MID];
            }
        }
    }
}
//定时释放内存 防止溢出
setInterval(function () {
    if ((new Date()).getHours() == 1) {
        relationDB = {};
        console.log('已释放内存');
    }
}, 3600000)

function broadcast(str, conn) {
    // 保留广播代码
    // server.connections.forEach(function (connection) {
    //     connection.sendText(str);
    // })
    try {
        let s = JSON.parse(str);
        if (s && s.msg) {
            console.log('移动端发送');
            console.log(s);
            // 移动端发送命令1.日志 2.报错 3.localStorage 4.移动端设备信息
            relationDB[s.MID].forEach(function (connection) {
                connection.sendText(str);
            })
        } else if (s && s.order) {
            console.log('PC端发送');
            console.log(s);
            // PC端发送指令 发送到对应移动端
            if (relationDB[s.PID + '_self']) {
                relationDB[s.PID + '_self'].sendText(str);
            }
        } else if (s && s.MID) {
            console.log('移动端注册MID' + s.MID);
            // 移动端注册到DB
            relationDB[s.MID] = [];
            relationDB[s.MID + '_self'] = conn;
        } else if (s && s.PID) {
            console.log('PC注册MID' + s.PID);
            // PC端注册到DB
            if (relationDB[s.PID]) {
                relationDB[s.PID].push(conn)
                conn.sendText(JSON.stringify({
                    level: 'MOPEN',
                    msg: {
                        MOPEN: true
                    }
                }));
                //第一个连接时发送缓存内容
                var command = {
                    clearQueue: false,
                    syncStorage: true,
                    syncDeviceInfo: true
                }
                if (relationDB[s.PID].length == 1) {
                    command.clearQueue = true;
                }
                relationDB[s.PID + '_self'].sendText(JSON.stringify(command));
            }
        }
    } catch (e) {

    }
}