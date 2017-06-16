import grpc from 'grpc'
import path from 'path'
import fs from 'fs'
class RpcClient {
  constructor(ip, port) {
    this.ip = ip
    this.port = port
    this.services = {}
    this.clients = {}
  }
 
  // 自动加载proto并且connect
  autoRun(protoDir) {
    var me = this;
    fs.readdir(protoDir, (err, files) => {
      if (err) {
        return console.error(err)
      }
    return files.forEach((file) => {
        const filePart = path.parse(file)
        const serviceName = filePart.name + 'Service';
        const packageName = filePart.name + 'Package';
        const extName = filePart.ext
        const filePath = path.join(protoDir, file)
 
        if (extName === '.proto') {
          const proto = grpc.load(filePath)
          const Service = proto[packageName][serviceName]
          me.services[serviceName] = Service
          me.clients[serviceName] = new Service(`${me.ip}:${me.port}`,
            grpc.credentials.createInsecure())
        }
      }, files)
    })
  }
 
  async invoke(serviceName, name, params) {
      var me = this;
    return new Promise((resolve, reject) => {
      function callback(error, response) {
        if (error) {
          reject(error)
        } else {
          resolve(response)
        }
      }
 
      params = params || {}
      if (me.clients[serviceName]
        && me.clients[serviceName][name]) {
        me.clients[serviceName][name](params, callback)
      } else {
        const error = new Error(
          `RPC endpoint: "${serviceName}.${name}" does not exists.`)
        reject(error)
      }
    })
  }
}

export default RpcClient