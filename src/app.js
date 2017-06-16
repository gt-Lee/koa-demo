import Koa from "koa";
import bodyparser from "koa-bodyparser"
import config from 'config'
import createLogger from 'concurrency-logger'
import session from 'koa-generic-session'
import redisStore from 'koa-redis'
import api from "./server/route/api/index"
import grpc from 'grpc'
import path from 'path'
import RpcClient from './server/entity/rpcClient'
//rpc service for test
// import RpcServer from './server/entity/rpcService'

// import { createWriteStream } from 'fs';
const app = new Koa();

/**
 * 异常处理
 */
{
   app.on('error',async (err,ctx) => {
       ctx.body = {
            status: -1,
            data: {},
            msg: '系统异常'
        }
        ctx.log.error('发生异常：',err);
    })
}

/**
 * .解析请求body
 */
{
    app.use(bodyparser());
 }
 

 /*
 * .日志
 */
{
    // const log = createWriteStream('logs/requests.log');
    var loggerConfig = {
        req: ctx => (
            `\n
            Request:\n
            原始地址:${ctx.originalUrl}\n
            url参数：${JSON.stringify(ctx.query)}\n
            请求body：${JSON.stringify(ctx.request.body)}\n`
        ),
        res: ctx => (
            `\n
            Response:\n
            响应状态:${ctx.status}\n
            响应body:${JSON.stringify(ctx.body)}
            \n`
        )
    }
    const logger = createLogger(loggerConfig)
    app.use(logger);
}



/**
*设置响应头信息 
*/
{
    app.use(async (ctx, next) => {
        let startAt = new Date().getTime() / 1000
        ctx.set("startAt", startAt)
        ctx.set("X-Powered-By", `koa-demo${config.get('version')}`) 
        await next();
    })
}

/**
 * 配置redis存储session
 */
{
    let HOST = config.get('redis.host');
    let PORT = config.get('redis.port');
    let PASSWORD = config.get('redis.password');
    let DB = config.get('redis.database');
    let PREFIX = config.get('redis.prefix');
    app.use(session({
            store: redisStore({
                host: HOST,
                port: PORT,
                password: PASSWORD,
                db: DB,
                retry_strategy: 3,
                prefix: PREFIX
            })
        }))
}

/**
 * 配置grpc链接
 */

{//启动rpc service （for testing）
    /*app.use(async (ctx, next)=> {
        ctx.log.info('Starting RPC Server:')
        const rpcServer = new RpcServer('127.0.0.1', 50051)
        rpcServer.autoRun(path.join(__dirname, './server/proto'))
        await next();
    });*/
   //rpc客户端链接
   app.use(async (ctx, next) => {
       // ctx.log.info('RPC Client connecting:')
        const rpcClient = new RpcClient(config.get("grpc.ip"), config.get("grpc.port"))
        rpcClient.autoRun(path.join(__dirname, './server/proto'))
        ctx.state.rpcClient = rpcClient
        await next();
    }); 
}

/*{
    
    let PROTO_PATH = path.resolve(__dirname,"./server/proto/test.proto")
    let testProto = grpc.load(PROTO_PATH).testPackage
    let address = config.get("grpc.address")
    app.use(async (ctx,next) => {
        const client = new testProto.testService(address,grpc.credentials.createInsecure());
        
        client.ping({}, function(err, response) {
            if(response){
                console.log('ping -> :', response.message);
            }
        });
        await next();
    })
}*/

/**
 * 路由
 */ 
{
    app.use(api.routes())
}


export default app;