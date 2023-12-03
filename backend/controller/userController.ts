import { Resolver } from "dns";
import { db } from "..";
import { t } from "elysia";

const registerUser: any = async () => {
  return (
    new Response("test"),
    {
      user: "Register User",
    }
  );
};

const allUsers = async () => {
  const query = db.query("SELECT * FROM users");
  const users: any = query.all();
  console.log(users);
  const description = t.String({ description: "dsad" });
  return {
    users,
  };
};
const authUser: any = async ({ body, set, jwt, cookie, setCookie }: any) => {
  const user = db.run(
    "INSERT INTO users (username,email,password) VALUES (?,?,?)",
    [body.username, body.email, body.password]
  );
  const data = {
    username: body.username,
    email: body.email,
    password: body.password,
  };
  setCookie("auth", await jwt.sign(data), {
    httpOnly: true,
    maxAge: 7 * 86400,
  });
  set.status = 201;
  return (
    new Response(
      JSON.stringify({
        user: "auth",
      })
    ),
    {
      data: {
        username: body.username,
        email: body.email,
        cookie: cookie.auth,
      },
    }
  );
};
const updateUser = async ({ request, params: { id } }: any) => {
  const data = await request.formData();
  const updateData = db.query(
    `UPDATE users SET email = $email , username = $username  WHERE id = $id`
  );

  // Run the query with specified parameters
  updateData.run({
    $email: data.get("email"),
    $username: data.get("username"),
    $id: id,
  });

  return (
    new Response(
      JSON.stringify({
        message: "Data Update",
      })
    ),
    {
      params: t.Object({
        id: t.String(),
      }),
      response: t.Object({
        data,
      }),
    }
  );
};

const deleteUser = async ({ params: { id } }: any) => {
  try {
    const query = db.query(`DELETE FROM users WHERE id=${id}`);
    return new Response(
      JSON.stringify({
        message: "Data has been Delete",
      })
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "Data doest Exist",
      })
    );
  }
};
export { registerUser, authUser, updateUser, allUsers, deleteUser };
