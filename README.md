# Sociauth

O Sociauth foi criado para minimizar a complexidade dos middlewares de autenticação no [express](http://expressjs.com/) para [Node.js](https://nodejs.org/en/).

O principal objetivo é fazer qualquer fluxo de autenticação ter a mesma resposta, para que as informações retornadas sejam trabalhadas da forma como o desenvolvedor preferir, seja comunicação via JWT, Sessão, ou qualquer outra.

## Install

```
$npm install sociauth
```

## Usage

Sociauth trabalha com o conceito de estratégias de requisições, trabalhando com autenticação OAuth. Para começar a trabalhar com qualquer uma delas disponíveis basta:

Importar a estratégia desejada;

```
import { GoogleUser, GoogleProvider } from "sociauth";
```

Instanciar o provider com as informações básicas para a requisição, colocando uma função de callback na propriedade doneCallback;

```
const googleProvider = new GoogleProvider({
  clientId:
    "107554673928-l2rtor0aqphirtikkcoicu2djfu5i4t5.apps.googleusercontent.com",
  clientSecret: "pqN9aJwPUA4F-O44STHxDcH8",
  redirectUri: "http://localhost:3333/auth/google/",
  responseType: "code",
  doneCallback: <CALLBACL_FUNCTION>,
});
```

Após isso basta inserir os métodos da instância desejada nas rotas;

```
router.get("/google/", googleProvider.route);

router.get("/auth/google/", googleProvider.responseRoute);
```

Não será necessário implementação dos botoẽs da rede social no Frontend, basta apontar para a primeira rota, `router.get("/google/", googleProvider.route);` que o usuário será redirecionado para a tela de login da rede social escolhida.
