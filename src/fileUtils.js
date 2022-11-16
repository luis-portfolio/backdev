const { createHash } = require('crypto')
const { join, extname, normalize } = require('path')
const { existsSync, copyFileSync, unlinkSync, readFileSync, mkdirSync } = require('fs')

const File = (() => {
    const ext = filename => extname(filename) || ""

    const path = (...paths) => join(...paths)

    const relative = (dirname, filenane) => (normalize(dirname + '/' + filenane)).split('\\').join('/').split('//').join('/')

    const load = filename => (exists(filename) === false) ? "" : JSON.parse(readFileSync(filename))

    const hash = filename => (exists(filename) === false) ? "" : createHash("sha256").update(readFileSync(filename)).digest("hex")

    const md = (dirname) => mkdirSync(dirname, { recursive: true })


    const exists = filename => {
        try {
            return existsSync(filename)
        } catch (err) {
            console.log(`exists(${filename}) ERROR: `, err)
            return false
        }
    }

    const erase = filename => {
        if (exists(filename) === false) return true
        try {
            unlinkSync(filename)
            return true
        } catch (err) {
            console.log(`exists(${filename}) ERROR: `, err)
            return false
        }
    }

    const copy = (src, dst) => {
        if (exists(src) !== true) return false
        if (erase(dst) === false) return false
        try {
            copyFileSync(src, dst)
            return true
        } catch (err) {
            console.log(`exists(${filename}) ERROR: `, err)
            return false
        }
        return exists(dst)
    }

    const move = (src, dst) => {
        if (exists(src) !== true) return false
        if (erase(dst) === false) return false
        if (copy(src, dst) === false) return false
        if (erase(src) === false) return false
        return exists(dst)
    }

    return {
        ext,
        path,
        relative,
        md,
        exists,
        delete: erase,
        copy,
        move,
        load,
        hash
    }
})()

module.exports = {
    File
}