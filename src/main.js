const { STORAGE_DB, STORAGE_ROUTE, STORAGE_PATH, storage, adapter } = require("./storage")
const jsonServer = require("json-server")
const server = jsonServer.create()
const middlewares = jsonServer.defaults()
const router = jsonServer.router(STORAGE_DB)

const port = process.env.PORT || 3000

server.use(STORAGE_ROUTE, STORAGE_PATH)
server.use(middlewares)
server.use(storage)
server.use(adapter)
server.use(router)
server.listen(port, () => console.log(`JSON Server is listened at port ${port}`))