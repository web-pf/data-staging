import koa from 'koa'
import koaRouter from 'koa-router'
import koaBody from 'koa-body'
import https from 'https'
import path from 'path'
import fs from 'fs'

// sub routers
import { beacon } from './beacon'
import { dbm } from '@/utils/beacon-utils'
import { hostname, port, uploadInterval } from '@config/serivce.json'

setInterval(() => {
  dbm.flush()
}, uploadInterval)

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
  const { method, originalUrl, host } = ctx.request
  console.log(`${method},${originalUrl}, ${host}`)
  next()
})
app.use(router.routes()).use(router.allowedMethods())
app.listen(port)

// const privateKey = fs.readFileSync(path.join(__dirname, '../ssl/ssl.key'), 'utf8')
// const certificate = fs.readFileSync(path.join(__dirname, '../ssl/ssl.crt'), 'utf8')
// const credentials = {
//   key: privateKey,
//   cert: certificate,
// }
// const httpsServer = https.createServer(credentials, app.callback())
// httpsServer.listen(port, hostname, () => {
//   console.log(`data staging service is running on ${hostname}:${port}`)
// })
