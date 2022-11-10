const { static } = require("express")
const { mkdirSync, copyFileSync, unlinkSync } = require("fs")
const multer = require("multer")
const { File } = require("./fileUtils")
const DiskStorage = require("./Multer/DiskStorage")

const STORAGE_ROUTE = "/files"
const STORAGE_FOLDER = File.path(__dirname, "../store/files")
const STORAGE_DB = File.path(__dirname, "../store/data/db.json")
const STORAGE_PATH = static(STORAGE_FOLDER)

File.md(STORAGE_FOLDER)

var storeAdapter = DiskStorage({
    destination: (req, file, callback) => callback(null, STORAGE_FOLDER),
    filename: (req, file, callback) => {
        callback(null, file.originalname)
    },
    onFinish: (req, file, data) => {
        const { destination, filename } = data
        const srcName = filename
        const srcFilename = File.path(destination, srcName)
        const dstName = File.hash(srcFilename) + File.ext(srcFilename)
        const dstFilename = File.path(destination, dstName)
        if (File.move(srcFilename, dstFilename) === false) return;
        req.body['image'] = req.body['image'] || []
        req.body.image.push(dstName)
    }
})

var storage = multer({ storage: storeAdapter }).any()

module.exports = {
    STORAGE_DB,
    STORAGE_ROUTE,
    STORAGE_PATH,
    storage
}