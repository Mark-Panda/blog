/**
 * Created by simple on 2018/11/16.
 */

const formidable = require('formidable')
//import md5 from '../config/md5'
const Encode = require('../config/md5')
const db = require('./db')
const moment = require('moment')
//import db from './db'
//首页
exports.showIndex = function (req,res,next) {
    //判断用户是否登录
    if(req.session.login){
        res.render('index');
    }else{
        res.render('login');
    }
};

//登录
exports.showLogin = function (req, res, next) {
    res.render('login');
}
exports.doLogin = function (req,res,next) {
    const content = req.body;
    const username = content.username;
    const password = content.password;
    const md5PassWord = Encode(password)
    db.findOne('user',{"username":username},function(err,result){
        console.log('登录的数据',result[0]);
        if (err){
            console.log('查找失败');
            res.send('-3');
            return
        }
        if (result.length == 0){
            console.log('没有该用户');
            res.send('-1');
            return
        }else if(md5PassWord === result[0].password){
            req.session.login = result[0].username;
            res.send('1');
            console.log('登录成功');
            return
        }else{
          res.send('-2');
          console.log('输入的密码错误');
          return
        }
    })
}
//注销
exports.logout = function(req,res,next){
    req.session.login = null
    res.render('index')
}

//注册
exports.showRegister = function (req,res,next) {
    res.render('register');
}
exports.doRegister = function (req,res,next) {
    //得到用户填写的东西
    //console.log('执行');
    //var form = new formidable.IncomingForm();
    //console.log('这里呢',req.body);
    const content = req.body;
    var username = content.username
    var password = content.password
    var md5PassWord = Encode(password)
    db.findOne('user',{"username":username},function(err,result){
      if(err){
          console.log('查找用户失败');
          res.send('-1');
          return
      }
      console.log('拿到的值',result);
      if(result.length == 0){
          db.create("user",{
              "username" : username,
              "password" : md5PassWord
          },function(err,result){
              // console.log('注册返回结果',result);
              if(err){
                  console.log('注册失败');;//服务器错误
                  res.send('-3');
                  return;
              }
              console.log('注册成功');
              // req.session.login = "1";
              res.send("1");//注册成功，写入SESSION
          });
      }else{
          res.send('-2')
      }
    })
}

//管理后台，文章录入
//编写页面
exports.showRecording = function (req, res, next) {
    if(req.session.login){
        res.redirect("/doContext");
    }else {
        res.render('login');
    }
};
//新录入文章
exports.insertContext = function (req,res,next) {
    const content = req.body;
    db.getAllCount("context",function(count){
        var allCount = count.toString()    //获取数据库中文章的数量
        var date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        db.create("context",{
            "contextId": parseInt(allCount) + 1,   //文章ID
            "title":content.title,  //文章标题
            "createTime":date,      //创建时间
            "editor":content.editor,    //创建作者
            "context":content.context,   //文章内容
            "category":content.category,   //文章类别
            "thumbsUp": 0,               //访问人数
            "visitNum" : 0,               //点赞人数
            "comment" : ''               //评论
            },function (err,result) {
            if(err){
                res.send("-1");//服务器错误
                return;
            }
            console.log('文章录入成功');
            res.send("1");
        })
    })
}

//管理后台，删除文章
exports.deleteContext = function (req,res,next) {
    const context = req.body;
    db.delete("context",{
        "contextId":parseInt(context.contextId)
    },function (err,next) {
        if (err){
            console.log("删除文章错误:"+err);
            res.send('-1');
            return
        }
        console.log('文章删除成功');
        res.send("1")
    })
}

//管理后台，修改文章
exports.updateContext = function(req,res,next){
  const context = req.body;
  db.findOne('context',{"contextId":parseInt(context.contextId)},function(err,next){
      if (err){
          console.log('文章匹配失败');
          res.send('-1');
          return
      }
      let content = result[0]
      db.updateMany('context',content,context,function(err,next){
          if (err){
              console.log('文章修改出错');
              res.send('-3');
              return
          }
          console.log('文章更新完毕');
          res.send('1');
      })
  })

}


//显示文章信息

//展示一页文章，分页
exports.getArticle = function (req, res, next) {
    var page = req.query.page;
    db.find("context",{},{"pageamount":10,"page":page,"sort":{"date":-1}}, function (err, result) {
        var obj = {"allResult" : result};
        res.json(obj);
    });
};

//详细展示某一个文章
exports.showContext = function (req,res,next) {
    if (req.body.contextId === undefined){
        res.send("你想干嘛？");
        return;
    }
    db.find("context",{"contextId":parseInt(req.body.contextId)},function (err,result) {
        if(err){
            console.log('查找文章失败');
            res.send('-1');
            return
        }
        res.redirect("/showContext",{
            "allResult" : result[0]    //返给前端展示的，前端获取这个就是获取到这个文章的所有信息
        });
    })
}

//取得总文章个数
exports.getAllAmount = function (req, res, next) {
    db.getAllCount("context", function (err,count) {
        if (err){
            console.log('获取文章数量失败');
            return
        }
        res.send(count.toString());
    });
};


//增加点赞数量
exports.addThumbsUp = function (req,res,next) {
    db.find("context",{"contextId":parseInt(req.body.contextId)},function (err,result) {
        if(err){
            console.log(err);
            return
        }
        var thumbsUp = result[0].thumbsUp;
        var contextId = result[0].contextId;
        db.update("context",{"contextId":contextId},{$set:{"thumbsUp":thumbsUp+1}},function (err,results) {   //$set操作符替换掉指定字段的值
            if(err){
                console.log("点赞数据错误:"+err);
                return
            }
            res.send("1");
        });
    });
};

//增加访问人数
exports.addVisitorNum = function (req, res, next) {
    db.find("context",{"contextId":parseInt(req.body.contextId)},function (err,result) {
        if(err){
            console.log('查找失败');
            return
        }
        var visitNum = result[0].visitNum;
        var ID = result[0].contextId;
        db.updateMany("context",{"contextId":ID},{$set:{"visitNum":visitNum+1}},function (err,results) {
            if(err){
                console.log("游览数据错误:"+err);
                return
            }
            res.send("1");
        });
    });
};





//按类别显示category
exports.showategory = function (req, res, result) {
    res.render("category");
};

exports.getategory = function (req, res, next) {
    db.find("context",{"category":req.body.category},{"pageamount":10,"sort":{"date":-1}}, function (err, result) {
        if(err){
            console.log(err);
            return
        }
        var obj = {"allResult" : result};
        res.json(obj);
    });
};

//取得评论
exports.getComment = function (req, res, next) {
    db.find("context",{"comment":req.body.comment},{"pageamount":10,"page":page,"sort":{"date":-1}}, function (err, result) {
        if (err){
            console.log('操作失败');
            return
        }
        var obj = {"allResult" : result};
        res.json(obj);
    });
};


//写入评论
exports.doComment = function (req, res, result) {
    var name = fields.name;
    var content = fields.content;
    db.getAllCount("context", function (count) {
        var allCount = count.toString();
        var date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
        db.update("context", {
            "commentId" : parseInt(allCount) + 1,
            "name" : name,
            "content" : content,
            "date" : date
        },function (err, result) {
            if(err){
                console.log("留言错误" + err);
                return;
            }
            res.send("1");
        });
    });
};
