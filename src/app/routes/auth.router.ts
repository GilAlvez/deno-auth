import { Hono } from "hono";
import { ZodError } from "zod";
import { InvalidFlow } from "../../core/errors/invalid_flow.ts";
import { ResourceConflict } from "../../core/errors/resource_conflict.ts";
import { Unauthorized } from "../../core/errors/unauthorized.ts";
import { SignInWithEmailUseCase } from "../../core/usecases/sign_in_with_email.usecase.ts";
import { SignUpWithEmailUseCase } from "../../core/usecases/sign_up_with_email.usecase.ts";

const router = new Hono()

router.post("/sign-up", async (c) => {
  try { 
    const { givenName, familyName, email, password } = await c.req.json()

    const signUp = new SignUpWithEmailUseCase()
    const accessToken = await signUp.execute({ givenName, familyName, email, password })

    return c.json({ accessToken })
  } catch (e) {
    if (e instanceof ZodError) return c.json({ error: e.issues }, 400)
    if (e instanceof ResourceConflict) return c.json({ error: e.message }, 409)
    console.error(e)
    throw e
  }
})

router.post("/sign-in", async (c) => {
  try {

    const { email, password } = await c.req.json()
  
    const signIn = new SignInWithEmailUseCase()
    const accessToken = await signIn.execute({ email, password })
  
    return c.json({ accessToken })
  } catch (e) {
    if (e instanceof ZodError) return c.json({ error: e.issues }, 400)
    if (e instanceof Unauthorized) return c.json({ error: e.message }, 401)
    if (e instanceof InvalidFlow) return c.json({ error: e.message }, 400)
    console.error(e)
    throw e
  }
})

export default router
