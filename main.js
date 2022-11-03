const { mkdirSync } = require("fs")
const { join, extname } = require("path")
const { static } = require("express")
const multer = require("multer")
const jsonServer = require("json-server")
const server = jsonServer.create()
const router = jsonServer.router("db.json")
const middlewares = jsonServer.defaults()

const STORAGE_ROUTE = "/image"
const STORAGE_PATH = join(__dirname, "store/images")
mkdirSync(STORAGE_PATH, { recursive: true })
let image = ""

var storage = multer.diskStorage({
    destination: (req, file, callback) => callback(null, STORAGE_PATH),
    filename: (req, file, callback) => {
        image = Date.now() + (extname(file.originalname) || ".jpg")
        callback(null, image)
    }
})

var upload = multer({ storage })

const port = process.env.PORT || 3000

server.use(STORAGE_ROUTE, static(STORAGE_PATH))
server.use(middlewares)
server.use(upload.any())

const resource = req => {
    const { id, created_at, updated_at, ...body } = req.body
    req.body = { id: +id, ...body, image, created_at, updated_at }
}

server.use((req, res, next) => {
    if (req.originalUrl = "/users") resource(req)
    next()
})

server.use(router)
server.listen(port, () => console.log(`JSON Server is listened at port ${port}`))