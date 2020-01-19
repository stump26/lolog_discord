import { Context } from 'koa';

const Koa = require('koa');

const app = new Koa();

app.use((ctx: Context) => {
  ctx.body = 'hello, stumpark!';
});

app.listen(4000, () => {
  console.log('Listening to port 4000');
});
