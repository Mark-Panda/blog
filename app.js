const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const ejs = require('ejs')
const session = require('express-session')
//import myrouter from './server/router'
const router = require('./server/router')
const app = express()

//const PORT = process.env.port || '80'

//配置解析普通表单post请求体
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//配置模板引擎
app.engine('html', ejs.__express);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');


//使用session中间件
app.use(session({
    secret: 'secret',  //对session ID相关的cookie进行签名
    resave: false,
    saveUninitialized: false,  //是否保存未初始化的会话
    cookie: {
        maxAge: 1000 * 60 * 3,  //设置session的有效时间，单位毫秒
    },
})),

//静态资源服务
app.use(express.static("./public"));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));
console.log('router===', router)

router.myrouter(app)

app.listen(3000, '127.0.0.1', () => {
    console.log('server is running at port 3000')
})
