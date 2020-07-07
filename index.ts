import express from "express";
import FacebookProvider from "./lib/facebook/";

const app = express();

app.use(express.json());
const router = express.Router();

const teste = (user: any) => {
  console.log(user);
};

const facebookProvider = new FacebookProvider({
  clientId: "",
  clientSecret: "",
  redirectUri: "http://localhost:3333/authenticate/facebook/",
  responseType: "code",
  doneCallback: teste,
});

router.get("/fb/", facebookProvider.route);

router.get("/authenticate/facebook/", facebookProvider.responseRoute);

app.use(router);

app.listen(3333, () => {
  console.log("Rodando");
});
