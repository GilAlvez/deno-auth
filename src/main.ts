import { Hono } from 'hono';
import auth from "./app/routes/auth.router.ts";
import users from "./app/routes/users.router.ts";

const app = new Hono()

app.route('/auth', auth)
app.route('/users', users)

export default app

