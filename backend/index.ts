import { Elysia, t } from "elysia";
import { userController } from "./routes/routes";
import { Database } from "bun:sqlite";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";

export const db = new Database("mydb.sqlite", { create: true });
db.run(
  "CREATE TABLE  IF NOT EXISTS  users (id INTEGER PRIMARY KEY AUTOINCREMENT,username TEXT,email TEXT UNIQUE, password TEXT,  timestamp TIMESTAMP  DEFAULT CURRENT_TIMESTAMP)"
);
const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
  "Content-Type": "application/json",
};
const app = new Elysia();

app.use(
  swagger({
    documentation: {
      info: {
        title: "Hello World API",
        version: "1.0.0",
        description: "This API provides CRUD operations for user management.",
      },
    },
  })
);
app.use(cors());

app.use(userController);

app.listen(3000, () => {
  console.log("Server is running");
});
