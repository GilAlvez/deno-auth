import { Hono } from "hono";

const router = new Hono()

router.get("/", (c) => {
  const body = c.req.json()
  return c.json(body)
})

router.get("/:id", (c) => {
  const id = c.req.param("id")
  return c.text(id)
})

export default router
