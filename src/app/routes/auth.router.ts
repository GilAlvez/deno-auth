import { Hono } from "hono";
import { ZodError } from "zod";
import { ResourceConflict } from "../../core/errors/resource_conflict.ts";
import { SignUpWithEmailUseCase } from "../../core/usecases/sign_up_with_email.usecase.ts";

const router = new Hono()

router.post("/sign-up", async (c) => {
  try { 
    const body = await c.req.json()

    const signUp = new SignUpWithEmailUseCase()
    const accessToken = await signUp.execute(body)

    return c.json({ accessToken })
  } catch (e) {
    if (e instanceof ZodError) {
      return c.json({ error: e.issues }, 400)
    }
    if (e instanceof ResourceConflict) {
      return c.json({ error: e.message }, 409)
    }
    console.error(e)
    throw e
  }
})

router.post("/sign-in", async (c) => {
  const body = await c.req.json()

  console.log(body)
  return c.json(body)
})

export default router
