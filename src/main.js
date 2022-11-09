const { STORAGE_DB, STORAGE_ROUTE, STORAGE_PATH, storage } = require("./storage")
const { Observer, ObserverBody, AdapterBody } = require("./adapter")
const { Login, AuthMiddleware } = require("./auth")

const { create, defaults, router } = require("json-server")
const server = create()
const jsonServerRouter = router(STORAGE_DB)

const port = process.env.PORT || 3000
server.use(defaults({ bodyParser: true }))
server.use(STORAGE_ROUTE, STORAGE_PATH)
server.use(storage)

server.use(ObserverBody)
server.use(Observer)

server.use(AdapterBody)

server.post('/login', Login(jsonServerRouter))

server.use(AuthMiddleware)
server.use(jsonServerRouter)

server.listen(port, () => {
    console.clear()
    console.log(`JSON Server is listened at port ${port}`)
})