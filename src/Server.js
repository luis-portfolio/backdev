const { STATIC_ROUTE, RoutesResourcesDB, StaticStorage, ObserverFileUpload } = require("./storage")
const { Observer, ObserverBody, AdapterBody } = require("./adapter")
const { Login, AuthMiddleware } = require("./auth")

const { create, defaults } = require("json-server")

const server = create()
const DEFAULT_PORT = process.env.PORT || 3000

server.use(defaults({ bodyParser: true }))
server.use(STATIC_ROUTE, StaticStorage)
server.use(ObserverFileUpload)

server.use(ObserverBody)
server.use(Observer)

server.use(AdapterBody)

server.post('/login', Login(RoutesResourcesDB))

server.use(AuthMiddleware)
server.use(RoutesResourcesDB)

const DefaultCallback = (port) => { }

const Server =
    (port = DEFAULT_PORT, callback = DefaultCallback) =>
        server.listen(port, (port = DEFAULT_PORT) => callback(DEFAULT_PORT))

module.exports = {
    DEFAULT_PORT,
    DefaultCallback,
    Server
}