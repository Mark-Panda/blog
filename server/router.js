/**
 * Created by simple on 2018/11/16.
 */

//import model from '../models'
const model  = require('../models')
 //路由

exports.myrouter = function (app) {
    //首页
    app.get("/",model.showIndex);
    //登录页面
    app.get('/login',model.showLogin);
    app.post('/login/dologin',model.doLogin);
    //注册
    app.get('/register',model.showRegister);
    app.post('/register/doregister',model.doRegister);

}
