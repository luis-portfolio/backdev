const {Server, DEFAULT_PORT, DefaultCallback} = require("./Server")

const callback = (port) => {
    const { description } = require("../package.json")
    console.log(`The ${description} is listened at port ${port}`)
}

Server(DEFAULT_PORT, callback)