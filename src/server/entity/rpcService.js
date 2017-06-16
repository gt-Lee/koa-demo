import grpc from 'grpc'
import fs from 'fs'
import path from 'path'
import _ from 'underscore'
class RpcServer {
  constructor(ip, port) {
    this.ip = ip
    this.port = port
    this.services = {}
    this.functions = {}
  }
 
  // 自动加载proto并且运行Server
  autoRun(protoDir) {
      var me = this;
    fs.readdir(protoDir, (err, files) => {
      if (err) {
        return console.error("proto error:",err)
      }
      _.forEach(files,(file) => {
        const filePart = path.parse(file)
        const serviceName = filePart.name + 'Service'
        const packageName = filePart.name + 'Package'
        const extName = filePart.ext
        const filePath = path.join(protoDir, file)
 
        if (extName === '.js') {
          const functions = require(filePath).default
          me.functions[serviceName] = Object.assign({}, functions)
        } else if (extName === '.proto') {
          me.services[serviceName] = 
            grpc.load(filePath)[packageName][serviceName].service
        }
      })
 
      return me.runServer()
    })
  }
 
  runServer() {
      var me = this;
    const server = new grpc.Server()
 
    _.forEach(_.keys(me.services),(serviceName) => {
      const service = me.services[serviceName]
      server.addService(service, me.functions[serviceName] || {})
    })
 
    server.bind(`${me.ip}:${me.port}`, 
                grpc.ServerCredentials.createInsecure())
    server.start()
  }
}
 
export default RpcServer;