import http, { IncomingMessage, ServerResponse, Server } from 'http'

// const proto = {
//   handle() {

//   }
// }
// function Pipu() {
//   function pipu(req, res, next) {
//     this.handle(req, res, next)
//   }
//   return pipu
// }
// Pipu.listen()
function requestListener(req: IncomingMessage, res: ServerResponse) {
  res.writeHead(200);
  console.log('333')
  res.end('My first server!')
  console.log('444')
  console.log('444')
  res.end('My first server!')
}

const server: Server = http.createServer(requestListener)

const port = 6000

server.listen(port, function () {
  console.log(`Server is listening on ${port}`)
})



