# data-channel

Turn a data channel into a stream

## Example

```js
var DataChannel = require("data-channel")

var pc = getPeerConnection(...)
    , channel = pc.createDataChannel
    , stream = DataChannel(channel)

stream.write("STREAM ALL THE THINGS")
```

## Installation

`npm install data-channel`

## Contributors

 - Raynos

## MIT Licenced
