const { static } = require("express")
const { mkdirSync } = require("fs")
const { join, extname } = require("path")
const multer = require("multer")

const STORAGE_ROUTE = "/files"
const STORAGE_FOLDER = join(__dirname, "../store/files")
const STORAGE_DB = join(__dirname, "../store/data/db.json")
const STORAGE_PATH = static(STORAGE_FOLDER)

mkdirSync(STORAGE_FOLDER, { recursive: true })

var storeAdapter = multer.diskStorage({
    destination: (req, file, callback) => callback(null, STORAGE_FOLDER),
    filename: (req, file, callback) => {
        req.body['image'] = req.body['image'] || []
        req.body.image.push(Date.now() + (extname(file.originalname) || ".jpg"))
        callback(null, req.body.image[(req.body.image.length - 1)])
    }
})

var storage = multer({ storage: storeAdapter }).any()

module.exports = {
    STORAGE_DB,
    STORAGE_ROUTE,
    STORAGE_PATH,
    storage
}