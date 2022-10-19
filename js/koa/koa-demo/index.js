const Koa = require('../koa-master/lib/application');
const app = new Koa();

app.use(async ctx => {
  ctx.body = 'Hello World';
});

app.listen(3000, function () {
  console.log('listening on http://127.0.0.1:3000')
});