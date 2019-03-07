//重写console.log方法
var getStackTrace = function () {
    var obj = {};
    Error.captureStackTrace(obj, getStackTrace);
    return obj.stack;
};

console.log = (function (oriLogFunc) {
    return function (...values) {
        oriLogFunc.call(console, values);
        var stack = getStackTrace() || ""
        var returnMsg = '';
        for (var i in arguments) {
            if (typeof arguments[i] == 'object') {
                arguments[i] = JSON.stringify(arguments[i])
            }
            returnMsg += '|' + arguments[i];
        }
        returnMsg = returnMsg.substring(1);
        var tmparr = stack.split(/[\n,]/g);
        var trace;
        if (tmparr.length > 2) {
            trace = tmparr.slice(2)
        }
        var returndata = JSON.stringify({
            level: 'log',
            msg: returnMsg,
            trace: trace || {},
            MID: MID || ""
        })
        if (window.socketStatus) {
            window.socket.send(returndata);
        } else {
            //队列保存日志
            window.socketQueue.push(returndata);
        }
    }
})(console.log);