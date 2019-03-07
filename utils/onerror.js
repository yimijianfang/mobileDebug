//全局处理js错误
window.onerror = function (msg, _url, line, col, error) {
    setTimeout(function () {
        col = col || (window.event && window.event.errorCharacter) || 0;
        var defaults = {};
        var trace;
        if (error && error.stack) {
            var tmparr = error.stack.split(/[\n,]/g);
            if (tmparr.length) {
                trace = tmparr;
            }
        }
        defaults.trace = trace || [msg];
        defaults.msg = _url + ':' + line + ':' + col;
        defaults.level = 'error';
        defaults.MID = MID || ""
        var reportData = JSON.stringify(defaults);
        if (window.socketStatus) {
            window.socket.send(reportData);
        } else {
            //队列保存日志
            window.socketQueue.push(reportData);
        }
    }, 0);
};