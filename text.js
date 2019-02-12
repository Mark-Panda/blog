const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://hospital_dlyy_server:hospital_dlyy_server@192.168.99.2:27017/hospital_dlyy_server';

const dbName = 'hospital_dlyy_server';

MongoClient.connect(url, { useNewUrlParser: true },function(err, client) {
    //assert.equal(null, err);
    if (err){
      console.log('连接失败');
    }else{
      console.log('连接成功');

    }
    client.close();
});
MongoClient.connect(url, { useNewUrlParser: true },function(err, client) {
    //assert.equal(null, err);
    const db = client.db(dbName);
    // let cursor = db.collection("user").find().toArray(function (err,docs) {
    //     console.log("Connected successfully",cursor);
    //     callback(docs)
    // })
    // console.log("Connected successfully to server",cursor);
    let aa = db.collection('user').find().skip(0).limit(0).sort().toArray(function(err,cursor){
      console.log('111',cursor);
      cursor.forEach(function (err,doc) {
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
    //console.log('=====',aa);

});


// var express = require('express');
// var bodyParser = require('body-parser');
// var { graphqlExpress, graphiqlExpress } = require('graphql-server-express');
// var { makeExecutableSchema } = require('graphql-tools');
//
// var typeDefs = [`
// type Query {
//   hello: String
// }
//
// schema {
//   query: Query
// }`];
//
// var resolvers = {
//     Query: {
//         hello(root) {
//             return 'world';
//         }
//     }
// };
// console.log('111',{typeDefs,resolvers})
// var schema = makeExecutableSchema({typeDefs, resolvers});
// console.log('22222',schema)
// var app = express();
// console.log('======',graphqlExpress({schema}))
// app.use('/graphql', bodyParser.json(), graphqlExpress({schema}));
// app.use('/graphiql', graphiqlExpress({endpointURL: '/graphql'}));
// app.listen(4000, () => console.log('Now browse to localhost:4000/graphiql'));

/*
*
*GraphQLSchema {
 astNode:
 { kind: 'SchemaDefinition',
 directives: [],
 operationTypes: [ [Object], [Object] ],
 loc: { start: 588, end: 634 } },
 extensionASTNodes: undefined,
 _queryType: Query,
 _mutationType: Mutation,
 _subscriptionType: null,
 _directives: [ @skip, @include, @deprecated ],
 _typeMap:
 { Query: Query,
 Post: Post,
 ID: ID,
 String: String,
 Author: Author,
 Int: Int,
 Mutation: Mutation,
 __Schema: __Schema,
 __Type: __Type,
 __TypeKind: __TypeKind,
 Boolean: Boolean,
 __Field: __Field,
 __InputValue: __InputValue,
 __EnumValue: __EnumValue,
 __Directive: __Directive,
 __DirectiveLocation: __DirectiveLocation },
 _implementations: {},
 _possibleTypeMap: undefined,
 __validationErrors: undefined,
 __allowedLegacyNames: [] }
* */


/*
* ====== function (req, res, next) {
 apollo_server_core_1.runHttpQuery([req, res], {
 method: req.method,
 options: options,
 query: req.method === 'POST' ? req.body : req.query,
 }).then(function (gqlResponse) {
 res.setHeader('Content-Type', 'application/json');
 res.setHeader('Content-Length', Buffer.byteLength(gqlResponse, 'utf8').toString());
 res.write(gqlResponse);
 res.end();
 }, function (error) {
 if ('HttpQueryError' !== error.name) {
 return next(error);
 }
 if (error.headers) {
 Object.keys(error.headers).forEach(function (header) {
 res.setHeader(header, error.headers[header]);
 });
 }
 res.statusCode = error.statusCode;
 res.write(error.message);
 res.end();
 });
 }
* */
