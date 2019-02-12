const fs = require('fs')
const path = require('path')

function requireGraphQL(name) {
    const filename = require.resolve(name)  //require.resolve函数来查询某个模块文件的带有完整绝对路径的文件名
    return fs.readFileSync(filename, 'utf8')
}

const typeDefs = [
    `
  scalar ObjID
  type Query {
    # A placeholder, please ignore
    placeholder: Int
  }
  type Mutation {
    # A placeholder, please ignore
    placeholder: Int
  }
`
]

const filePath = path.join(__dirname, '.')
const files = fs.readdirSync(filePath)

for (let file of files) {
    if (file === 'index.js') continue
    typeDefs.push(requireGraphQL(`./${file}`))   //将graphql文件的内容写入typeDefs中
    console.log('====',typeDefs)
}

exports.module = typeDefs