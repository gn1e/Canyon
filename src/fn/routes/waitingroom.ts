import { Hono } from 'hono'

export default (app: Hono) => {
    app.get("/waitingroom/api/waitingroom", (c) =>
        c.body(null, 204, {
            'X-Message': 'Thanks for using Canyon!',
            'Content-Type': 'text/plain',
          })
      );
}