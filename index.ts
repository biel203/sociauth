import express, { Request, Response } from "express";
// import FacebookProvider from "./lib/facebook/";
import { GoogleUser, GoogleProvider } from "./lib/";

const app = express();

app.use(express.json());
const router = express.Router();

const teste = (user: GoogleUser, _request: Request, response: Response) => {
  response.json({ ...user });
};

const googleProvider = new GoogleProvider({
  clientId:
    "107554673928-l2rtor0aqphirtikkcoicu2djfu5i4t5.apps.googleusercontent.com",
  clientSecret: "pqN9aJwPUA4F-O44STHxDcH8",
  redirectUri: "http://localhost:3333/auth/google/",
  responseType: "code",
  doneCallback: teste,
});

/* const facebookProvider = new FacebookProvider({
  clientId: "269391634350250",
  clientSecret: "16950f0a936302f564492e0c8514dc01",
  redirectUri: "http://localhost:3333/authenticate/facebook/",
  responseType: "code",
  doneCallback: teste,
}); */

router.get("/google/", googleProvider.route);

router.get("/auth/google/", googleProvider.responseRoute);

app.use(router);

app.listen(3333, () => {
  console.log("Rodando");
});
