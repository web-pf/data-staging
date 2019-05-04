import koa from 'koa'
import koaRouter from 'koa-router'
import koaBody from 'koa-body'
import https from 'https'
import path from 'path'
import fs from 'fs'

// sub routers
import { beacon } from './beacon'

const app = new koa()
const router = new koaRouter()

router.use('/beacon', beacon.routes(), beacon.allowedMethods())

app.use(
  koaBody({
    multipart: true,
    urlencoded: true,
  })
)
app.use((ctx, next) => {
  const {method, host} = ctx.request
  console.log(`${method}, ${host}`)
  next()
})
app.use(router.routes()).use(router.allowedMethods())

const privateKey = fs.readFileSync(path.join(__dirname, '../ssl/ssl.key'), 'utf8')
const certificate = fs.readFileSync(path.join(__dirname, '../ssl/ssl.crt'), 'utf8')
const credentials = {
  key: privateKey,
  cert: certificate,
}
const httpsServer = https.createServer(credentials, app.callback())
httpsServer.listen(4431, 'webpf.net', () => {
  console.log(`data staging service is running on: https://localhost:4431`)
})
