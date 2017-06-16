const port = process.env.PORT || 4000;
const env = process.env.NODE_ENV || 'development';
const src = env === 'production' ? './build/app' : './src/app';

require('babel-polyfill');
if (env !== 'production') {
  // 开发环境使用 babel/register 更快地在运行时编译
  require('babel-register');
}

const app = require(src).default;
app.listen(port, function(){
    console.log("app listening at port" + port)
});