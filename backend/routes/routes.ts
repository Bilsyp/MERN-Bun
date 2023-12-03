import { Elysia, t } from "elysia";
import { db } from "..";
import { swagger } from "@elysiajs/swagger";

import {
  allUsers,
  authUser,
  deleteUser,
  registerUser,
  updateUser,
} from "../controller/userController";
import { cookie } from "@elysiajs/cookie";
import { jwt } from "@elysiajs/jwt";

const app = new Elysia();

const registerTypes = {
  type: "json",
  response: t.Object({
    user: t.String(),
  }),
};

const authTypes = {
  body: t.Object({
    username: t.String(),
    email: t.String(),
    password: t.String(),
  }),

  response: t.Object({
    data: t.Object({
      username: t.String(),
      email: t.String(),
      cookie: t.String(),
    }),
  }),
};
export const userController = (app: Elysia) =>
  app.group("/users", (app) =>
    app
      .use(
        jwt({
          name: "jwt",
          secret: "Fischl von Luftschloss Narfidort",
        })
      )
      .use(cookie())
      .get("/register", registerUser, registerTypes)
      .get("/allUsers", allUsers)
      .get(
        "/profile",
        () => {
          return new Response("test");
        },

        {
          beforeHandle: async ({ jwt, set, cookie: { auth } }) => {
            const profile = await jwt.verify(auth);
            if (!profile) {
              set.status = 401;
              return "Unauthorized back to login page";
            }

            return `Hello with cookie : ${auth}`;
          },
        }
      )
      .post("/authUser", authUser, authTypes)
      .put("/update/id/:id", updateUser)
      .delete("delete/id/:id", deleteUser)
  );
