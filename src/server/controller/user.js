import userService from '../service/user'
import ErrResult from '../errcode/errResult'
import op from 'object-path'
import _ from 'underscore'

const userContrello = {
    hello:async (ctx,next) => {
        //校验参数
        var userName =  op(ctx.params).get('name');
        if (userName == ''||!userName){
            ctx.body = ErrResult.PARAM_ERROR
            await next();
            return
        }
        //调用service
        
        let result = await userService.hello(userName)
        ctx.body = result;
        await next();
    },
    getCaptcha:async (ctx,next) => {
        //校验参数
       /* if (_.isEmpty(ctx.query)) {
            ctx.log.info("in here")
            ctx.body = ErrResult.PARAM_ERROR;
            await next();
            return;
        }; */

        let result = await userService.getCaptcha(ctx,ctx.query)
        ctx.body = result;
        await next();
    },
    testRpc: async (ctx,next) => {
        let result = await userService.testRpc(ctx)
        ctx.body = result;
        await next()
    }
}

export default userContrello;