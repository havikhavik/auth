import express from "express";
import { sequelize } from "./db";
import { Auth } from "./db/auth";
import { User } from "./db/user";
import * as crypto from "crypto";
import * as jwt from "jsonwebtoken";

const SECRET = "asd123";
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

function getSHA256ofString(text: String) {
  return crypto.createHash("sha256").digest("hex");
}

app.listen(port, () => {
  console.log("escuchando el puerto " + port);
});

app.post("/auth", async (req, res) => {
  const { email, name, birthdate } = req.body;

  const [user, created] = await User.findOrCreate({
    where: { email },
    defaults: {
      email,
      name,
      birthdate,
    },
  });
  const [auth, authCreated] = await Auth.findOrCreate({
    where: { email },
    defaults: {
      email,
      password: getSHA256ofString(req.body.password),
      userID: user.get("id"),
    },
  });
  console.log({ user, auth });
  res.json(user);
});
app.post("/auth/token", async (req, res) => {
  const { email } = req.body;
  const passwordHasheada = getSHA256ofString(req.body.password);
  console.log(passwordHasheada);

  const auth = await Auth.findOne({
    where: {
      email: email,
      password: passwordHasheada,
    },
  });

  const token = jwt.sign({ id: auth.get("userID") }, SECRET);
  console.log(auth);
  if (auth) {
    res.json(auth);
  } else {
    res.status(400).json({ error: "email o password incorrecto" });
  }
});

app.get("/me", async (req, res) => {});

(async function main() {
  await sequelize.sync({ alter: true });

  await User.sync({ force: true });
  await Auth.sync({ force: true });

  // try {
  //     await sequelize.authenticate();
  //     console.log('Connection has been established successfully.');
  //   } catch (error) {
  //     console.error('Unable to connect to the database:', error);
  //   }

  // const user = await User.create({username:"havikhavik",lastname:"pascual",birthday:"1995-04-14"})
  //   const product = await Product.create({ title: "Coca", price: 1000 });

  //   const usersCreated = await User.findAll();

  //   console.log({ usersCreated: usersCreated.map((i) => i.dataValues) });
})();
