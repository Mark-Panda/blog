/**
 * Created by simple on 2018/11/16.
 */

var MongoClient = require('mongodb').MongoClient;
const mongoConfig = require('../config/index')


//连接数据库
function _connectDB(callback) {
    console.log('=====');
    var url = mongoConfig.url;   //从settings文件中，都数据库地址
    MongoClient.connect(url,{useNewUrlParser:true}, function (err, client) {  //
        if (err) {
            console.log('连接数据库出错');
            return
        }
        callback(null,client)
    });
}
//查找一条数据并且匹配
exports.findOne = function(collectionName,json,callback){
    console.log('开始查找');
    _connectDB(function(err,client){
        if(err){
          console.log('查找失败');
          client.close();
          return
        }
        const db = client.db('blog');
        db.collection(collectionName).find(json).toArray(function(err,result){
          if(err){
              console.log('查找失败');
              db.close();
              return
          }
          if(!result){
              console.log('数据库没有该内容');
              callback(null,[])
              client.close()
          }else{
            console.log('查找到的数据',result);
            callback(null,result)
            console.log('关闭数据库');
            client.close()
          }

        })
    })
}

//查
exports.find = function (collectionName,json,C,D) {
    var result = []
    if (arguments.length === 3){    //arguments.length：获取实参个数
        var callback = C
        var skipnumber = 0
        //数目限制
        var limit = 0
    }else if (arguments.length === 4){
        var callback = D;
        var args = C;
        //应该省略的条数
        var skipnumber = args.pageamount * args.page || 0;
        //数目限制
        var limit = args.pageamount || 0;    //数目限制，查多少个
        //排序方式
        var sort = args.sort || {};   //排序
    }else {
        throw error("find函数的参数个数为3或4")
        return
    }

    //连接数据库
    _connectDB(function (err,client) {
        const db = client.db('blog');
        db.collection(collectionName).find(json).skip(skipnumber).limit(limit).sort(sort).toArray(function(err,docs){
            if (err){
                console.log('错了故障');
                client.close();
                return
            }
            docs.forEach(function (err,doc) {
                if (err){
                    client.close();//关闭数据库
                    return
                }
                if (doc !== null){
                    result.push(doc)  //放入结果数组
                    console.log('查找的数据',result);
                    client.close();
                    callback(null,result);
                }else {
                    //遍历结束，没有更多的文档了
                    console.log('查找的数据',result);
                    client.close(); //关闭数据库
                    callback(null, result);
                }
            })
        })
    })
}


//增
exports.create = function (collectionName,json,callback) {
  console.log('开始创建');
    _connectDB(function(err,client){
      if(err){
        console.log('增加失败');
        return
      }
      const db = client.db('blog');
      db.collection(collectionName).insertOne(json,function (err,result) {
          callback(err,result)
          console.log('关闭数据库');
          client.close()
      })
    })
}

//改，更新
exports.update = function (collextionName,json,jsons,callback) {
    _connectDB(function (err,client) {
        if(err){
            console.log('数据库连接失败',err)
            client.close();
            return
        }
        const db = client.db('blog');
        db.collection(collextionName).updateMany(
            json,
            jsons,
            function (err,result) {
                callback(err,result)
                client.close()
            }
        )
    })
}



//删除
exports.delete = function (collectionName,json,callback) {
    _connectDB(function (err,client) {
        if (err){
            console.log('数据库连接失败',err);
            client.close();
            return
        }
        const db = client.db('blog');
        db.collection(collectionName).deleteMany(
            json,
            function (err,result) {
                callback(err,result)
                client.close()
            }
        )
    })
}


//获得所有数量
exports.getAllCount = function (collectionName,callback) {
    _connectDB(function (err, client) {
        if (err){
            console.log('数据库连接失败');
            client.close();
            return
        }
        const db = client.db('blog');
        db.collection(collectionName).count({}).then(function(count) {
            callback(count);
            client.close();
        });
    })
};
