import express from "express";
import FacebookProvider from "./lib/facebook/";

const app = express();

app.use(express.json());
const router = express.Router();

const facebookProvider = new FacebookProvider({
  clientId: "269391634350250",
  redirectUri: "http://localhost:3333/authenticate/facebook/",
});

router.get("/fb/", facebookProvider.route);

router.get("/authenticate/facebook/", async (_req, res) => {
  res.json({ message: "Chegou" });
});

app.use(router);

app.listen(3333, () => {
  console.log("Rodando");
});
