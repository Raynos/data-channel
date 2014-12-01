var through2 = require("through2")

module.exports = DataChannel

/* Turn a data channel into a node stream */
function DataChannel(channel) {
    if (channel._stream) {
        return channel._stream
    }

    var stream = through2(write, end)
        , ready = false
        , buffer = []

    stream.meta = channel.label

    channel.onopen = onopen
    channel.onclose = onclose
    channel.onmessage = onmessage
    channel.onerror = onerror

    return stream

    function write(chunk, enc, callback) {
        if (!ready) {
            buffer.push(chunk)
            callback()
            return
        }
        channel.send(chunk)
        callback()
    }

    function end() {
        channel.close()
        stream.writable = false
    }

    function onopen() {
        ready = true
        buffer.forEach(send)
        buffer.length = 0
        stream.emit("connect")
    }

    function send(message) {
        channel.send(message)
    }

    function onclose(event) {
        stream.end()
        stream.emit("finish")
        stream.emit("close", event)
    }

    function onmessage(message) {
        stream.push(message.data)
    }

    function onerror(err) {
        stream.emit("error", err)
    }
}
