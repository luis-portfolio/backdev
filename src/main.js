const { STORAGE_DB, STORAGE_ROUTE, STORAGE_PATH, storage } = require("./storage")
const { Observer, ObserverBody, AdapterBody } = require("./adapter")

const jsonServer = require("json-server")
const server = jsonServer.create()
const middlewares = jsonServer.defaults()
const router = jsonServer.router(STORAGE_DB)

const port = process.env.PORT || 3000

server.use(STORAGE_ROUTE, STORAGE_PATH)
server.use(middlewares)
server.use(storage)
server.use(ObserverBody)
server.use(Observer)
server.use(AdapterBody)
server.use(router)

server.listen(port, () => {
    console.clear()
    console.log(`JSON Server is listened at port ${port}`)
})