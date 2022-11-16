const cluster = require("cluster");
const { File } = require("./fileUtils");
const { main, description } = require("../package.json")

if (cluster.isMaster) {
  const instances = require("os").cpus().length
  console.log(description, "Cluster in", instances, "instanceis");

  const startInstance = (function* (callback) {
    var i = 0;
    while (true) {
      if (i >= instances) return;
      setImmediate(callback)
      yield i++
    }
  })(cluster.fork)

  startInstance.next()

  cluster.on('listening', (worker, { address, port }) => {
    const host = (address || "port")
    const data = JSON.parse(JSON.stringify(worker))
    const { id, process: { pid } } = data
    console.log("   Instance", id, 'listen to', host, port, 'on process number', pid);
    startInstance.next()
  })

  cluster.on("exit", (worker, code, signal) => {
    if (code !== 0 && !worker.exitedAfterDisconnect)
      cluster.fork()
  })

} else {
  const server = File.path(__dirname, main)
  if (!File.exists(server)) {
    console.log("Server do not found")
    return;
  }
  const { Server, DEFAULT_PORT, DefaultCallback } = require(server)
  Server(DEFAULT_PORT, DefaultCallback)
}