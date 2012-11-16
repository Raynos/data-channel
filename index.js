var ReadWriteStream = require("read-write-stream")

module.exports = DataChannel

/* Turn a data channel into a node stream */
function DataChannel(channel) {
    if (channel._stream) {
        return channel._stream
    }

    var queue = ReadWriteStream(write, end)
        , ready = false
        , buffer = []
        , stream = queue.stream

    stream.meta = channel.label

    channel.onopen = onopen
    channel.onclose = onclose
    channel.onmessage = onmessage
    channel.onerror = onerror

    return stream

    function write(chunk) {
        if (!ready) {
            return buffer.push(chunk)
        }
        channel.send(chunk)
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

    function onclose() {
        queue.end()
        stream.emit("finish")
    }

    function onmessage(message) {
        queue.push(message.data)
    }

    function onerror(err) {
        stream.emit("error", err)
    }
}
