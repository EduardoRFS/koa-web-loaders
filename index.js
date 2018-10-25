'use strict'

const fs = require('fs-extra')
const Koa = require('koa')
const morgan = require('koa-morgan')
const koaStatic = require('koa-static')
const app = new Koa()

const loaders = {
  async json (ctx, data) {
    ctx.type = 'application/javascript'
    ctx.body = `export default ${data.toString()}`
  }
}
app.use(morgan('dev'))
app.use(async (ctx, next) => {
  const parts = ctx.path.split('!')
  const file = parts[0]
  const loader = loaders[parts[1]]

  if (parts.length === 1 || !loader) {
    return next();
  }
  const data = await fs.readFile(`static/${file}`);
  return loader(ctx, data);
})
app.use(koaStatic('static'))

app.listen(8080)