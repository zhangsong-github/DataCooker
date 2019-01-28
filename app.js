const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const cors = require('koa2-cors') // 新增部分处理跨域

//这里提一点题外话 假如routes文件新增一个路径就的在下面增加路劲
//假设routes新增一个user.js
//新增一个user需要修改两个地方这里是一个 下面还有一个地方
//这里需要 const user = require('./routes/user')
const index = require('./routes/index')
const users = require('./routes/user')
const auth = require('./routes/auth')
const blog = require('./routes/blog')

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))
app.use(cors())    // 新增部分处理跨域
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

//这里提一点题外话 假如routes文件新增一个路径就的在下面增加路劲
//假设routes新增一个user.js
//这里需要 app.use(user.routes(), user.allowedMethods())
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(auth.routes(), auth.allowedMethods())
app.use(blog.routes(), blog.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
