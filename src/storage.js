const multer = require("multer")
const { static } = require("express")
const { router } = require("json-server")
const { File } = require("./fileUtils")
const DiskStorage = require("./Multer/DiskStorage")

const STATIC_ROUTE = "/public"
/*  STORAGE_FOLDER = */
const StorageFolder = (resource = "") => File.path(__dirname, `../store/public/${resource}`,)
const STORAGE_DB = File.path(__dirname, "../store/data/db.json")
const StaticStorage = static(StorageFolder())
const RoutesResourcesDB = router(STORAGE_DB)

var storage = DiskStorage({
    destination: (req, file, callback) => {
        const resource = req.originalUrl.toLowerCase()
        const storageFolder = StorageFolder(resource)
        File.md(storageFolder)
        callback(null, storageFolder)
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname)
    },
    onFinish: (req, file, data) => {
        const { destination, filename } = data
        console.log({ destination, filename });
        const srcName = filename
        const srcFilename = File.path(destination, srcName)
        const dstName = File.hash(srcFilename) + File.ext(srcFilename)
        const dstFilename = File.path(destination, dstName)
        if (File.move(srcFilename, dstFilename) === false) return;
        const publicFileName = File.relative(req.originalUrl.toLowerCase().split('/').splice(1).join('/'), dstName)
        req.body['image'] = req.body['image'] || []
        req.body.image.push(publicFileName)
    }
})

var ObserverFileUpload = multer({ storage }).any()

module.exports = {
    STATIC_ROUTE,
    RoutesResourcesDB,
    StaticStorage,
    ObserverFileUpload
}