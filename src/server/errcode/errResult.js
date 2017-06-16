class ErrResult {
    constructor(status,msg) {
        this.status = status;
        this.msg = msg;
    }
    resultWithData(data) {
        return {
            status: this.status,
            msg: this.msg,
            data:data
        }
    }
    transformMsgtoMine() {
        if (this.error_map.has(this.status)){
            this.msg = this.error_map.get(this.status)
        }
        return this
    }

}

ErrResult.REQUEST_ILLEGAL_ERROR = new ErrResult(-2, "非法请求")
ErrResult.SYSTEM_ERROR = new ErrResult(-1, "系统异常")
ErrResult.PARAM_ERROR = new ErrResult(1001, "参数错误")
ErrResult.NETWORK_ERROR = new ErrResult(-3, '系统网络错误，请稍后再试')

ErrResult.error_map = new Map([
        [6007 ,'请输入图形验证码'],
        [6102 , '验证码失效，请重新发送短信验证码'],
		[1100020 , '手机号不存在，请先注册～'],
        [1100004 , '手机号已注册，请登录']
    ])

export default ErrResult