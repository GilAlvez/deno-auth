import { Hono } from 'hono';
import auth from "./routes/auth.router.ts";
import users from "./routes/users.router.ts";

const app = new Hono()

app.route('/auth', auth)
app.route('/users', users)

export default app

