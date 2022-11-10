var {createWriteStream, unlinkSync} = require('fs')
var os = require('os')
var { join } = require('path')
var { createHash } = require('crypto')
var mkdirp = require('mkdirp')

function getFilename(req, file, cb) {
  crypto.pseudoRandomBytes(16, function (err, raw) {
    cb(err, err ? undefined : raw.toString('hex'))
  })
}

function getDestination(req, file, cb) {
  cb(null, os.tmpdir())
}

function onFinish(req, file, data) {
  console.log({ ...data })
}

function DiskStorage(opts) {
  this.getFilename = (opts.filename || getFilename)
  this.onFinish = (opts.onFinish || onFinish)

  if (typeof opts.destination === 'string') {
    mkdirp.sync(opts.destination)
    this.getDestination = function ($0, $1, cb) { cb(null, opts.destination) }
  } else {
    this.getDestination = (opts.destination || getDestination)
  }
}

DiskStorage.prototype._handleFile = function _handleFile(req, file, cb) {
  var that = this
  var hash = createHash('sha256')
  that.getDestination(req, file, function (err, destination) {
    if (err) return cb(err)

    that.getFilename(req, file, function (err, filename) {
      if (err) return cb(err)

      var finalPath = join(destination, filename)
      var outStream = createWriteStream(finalPath)

      file.stream.pipe(outStream)
      outStream.on('error', cb)
      outStream.on('data', chunk => hash.update(chunk))
      outStream.on('finish', () => {
        const data = {
          destination,
          filename,
          path: finalPath,
          size: outStream.bytesWritten,
          hash: hash.digest('hex')
        }
        cb(null, data)
        that.onFinish(req, file, data)
      })
    })
  })
}

DiskStorage.prototype._removeFile = function _removeFile(req, file, cb) {
  var path = file.path

  delete file.destination
  delete file.filename
  delete file.path

  unlinkSync(path, cb)
}

module.exports = function (opts) {
  return new DiskStorage(opts)
}