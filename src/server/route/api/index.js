import Router from 'koa-router'
import userContrello from '../../controller/user'
const api = new Router({
    prefix:'/api'
})
api.get('/captcha', userContrello.getCaptcha);
api.get('/demo/:name',userContrello.hello) ;
api.get('/rpc',userContrello.testRpc);
export default api