import request from 'superagent'
import config from 'config'
import Result from '../entity/result'
import ErrResult from '../errcode/errResult'
import op from 'object-path'

const userService = {
    hello:async (name) => {
         return new Result({
            say:`hello ${name}`
        });
    },
    getCaptcha:async (ctx,query) => {
        return request
            .get(config.get('domain.mall-api'))
            .set('X-Host','mall.user.captcha')
            .query(query)
            .then((res) => {
                ctx.log.info('第三方api响应',JSON.stringify(res))
                if (op(res).get('body.status') !== 0) {
                    return new ErrResult(op(res).get('body.status'), op(res).get('body.msg'));
                }else {
                    return new Result(op(res).get('body.data'));
                }
            })
            .catch((err) => {
                ctx.log.error(err)
                return ErrResult.NETWORK_ERROR;
            })
    },
    testRpc:async (ctx) => {
        var rpcClient = op(ctx.state).get("rpcClient");
        try {
            let result = await rpcClient.invoke('testService', 'ping')
            return new Result(result)
        } catch (err) {
            ctx.log.error(err)
        }
    } 
}

export default userService;