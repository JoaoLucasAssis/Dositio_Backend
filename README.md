# Dositio - API REST com Fastify e MongoDB

Este projeto é uma API REST feita com Fastify, um servidor web moderno em JavaScript/Node.js.

A API oferece rotas para manipulação de recursos como `produtos`, `categorias` e `usuários`, seguindo os princípios RESTful.

Ele implementa autenticação de usuários utilizando JSON Web Tokens (JWT) e separa as preocupações da aplicação durante o lifecycle do Fastify.

### Como funciona

O servidor Fastify é responsável por lidar com as requisições HTTP, roteando-as para as funções correspondentes que realizam as operações no banco de dados MongoDB.

As requisições HTTP são feitas pelo ThunderClient, Postman ou qualquer outro cliente HTTP.

O projeto inclui hooks personalizados criados para fazer verificações durante o ciclo de vida do Fastify.

### Testes das rotas

Para testar as rotas da API, foi criado um arquivo de testes: `src/test.js`. 

Para execução dos testes, deve-se alterar o arquivo `.env` para usar o ambiente de testes e criar um banco de dados de testes, para evitar conflitos com o ambiente de desenvolvimento.

Antes de executar os testes, é importante preparar o banco de dados de teste com itens pré-existentes nas coleções de categorias e produtos.

Abaixo estão exemplos de itens de teste para cada coleção:

> :bulb: obs: Para as rotas POST /login e /login-admin, o usuário utilizado é criado pelas rotas /register e /register-admin

```json
{
  "_id": {
    "$oid": "661d9cf8ad84d4573574d57c"
  },
  "name": "TesteCategory1",
  "img_url": "https://static.itdg.com.br/images/622-auto/ed4c4a501ed88775e87f279b2ced50c6/frutas-mais-saudaveis.jpg"
}

{
  "_id": {
    "$oid": "66215a14683ecf32e0dd6ebf"
  },
  "name": "TestProduct1",
  "qtd": 1,
  "cat_id": "661d9cf8ad84d4573574d57c"
}
```

## Pré-requisitos

Antes de começar, verifique se você atendeu aos seguintes requisitos:

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Fastify](https://img.shields.io/badge/Fastify-202020?style=for-the-badge&logo=fastify&logoColor=white)

## Instalação
<details>
<summary>Clique aqui!</summary>
<p>

### Pré-requisitos para instalação!

![Git](https://img.shields.io/badge/Git-E34F26?style=for-the-badge&logo=git&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
--------------------------------------------------------------------------------------------

Para começar, clone o repositório do projeto em seu ambiente local. Siga a etapa abaixo:

* Abra o terminal na pasta onde deseja clonar o repositório.

* Clone o repositório para o seu ambiente local usando o seguinte comando:

```git
git clone https://github.com/JoaoLucasAssis/Dositio.git
```

> :warning: obs: Certifique-se de ter o git instalado antes de executar o comando no terminal

* Navegue até o diretório do projeto e execute o seguinte comando para instalar todas as dependências:

```git
npm install
```

* Atualize as variáveis de ambiente do arquivo `.env` conforme necessário.
</p>
</details>

## Configuração do MongoDB
<details>
<summary>Clique aqui!</summary>
<p>
O projeto utiliza o MongoDB como banco de dados. Abaixo estão os exemplos das coleções e seus campos:

### Coleção "produtos"

```json
{
  "_id": ObjectId("614fdbd0$S31O5$2532b6d36"),
  "name": "maçã",
  "qtd": 20,
  "cat_id": "fruta"
}
```

### Coleção "categorias"

```json
{
  "_id": ObjectId("614fdbd0$S31O5$2532b6d37"),
  "name": "fruta",
}
```

### Coleção "usuários"

```json
{
  "_id": ObjectId("614fdbd0$S31O5$2532b6d38"),
  "name": "João",
  "password": "1234",
  "admin": false
}
```
</p>
</details>

## Executando o Projeto

Siga os seguintes  passos para executar o projeto:

* Crie um arquivo `.env` no diretório raiz do projeto baseado no arquivo `.env.sample` já existente.
  
* Altere as configurações do arquivo ***.env*** para utilizar os ambientes desejados.

Para o ambiente de desenvolvimento, foi utilizado a seguinte configuração:

```javascript
STAGE = 'dev'
PORT= '3000'
HOST= '127.0.0.1'
JWT_SECRET= 'Abcd@1234'
DB_URL = 'mongodb://localhost:27017/dositio'
```

Para o ambiente de teste, foi utilizado a seguinte configuração:

```javascript
STAGE = 'test'
PORT= '3000'
HOST= '127.0.0.1'
JWT_SECRET= 'Abcd@1234'
DB_URL = 'mongodb://localhost:27017/teste'
```

Após a instalação e configuração, você pode executar o projeto usando o seguinte comando:

```node
npm run dev
```

O servidor estará em execução em `http://localhost:3000`.

## Rotas

O projeto fornece as seguintes rotas:

### Produtos

* GET `/products`
* GET `/products/:id`
* POST `/products`
* PUT `/products/:id`

### Categorias

* GET `/categories`
* POST `/categories`
* PUT `/categories/:id`
* DELETE `/categories/:id`
* GET `/categories/:id/products`

### Usuários

* POST `/register`
* POST `/register-admin`
* POST `/login`
* POST `/login-admin`

## Executando testes do projeto

Siga os seguintes  passos para executar o arquivo `src/test.js`:

* Crie um arquivo `.env` no diretório raiz do projeto baseado no arquivo `.env.sample` já existente.
  
* Altere as configurações do arquivo ***.env*** para utilizar o ambiente de testes.

Para o ambiente de desenvolvimento, foi utilizado a seguinte configuração:

```c
STAGE = 'test'
PORT= '3000'
HOST= '127.0.0.1'
JWT_SECRET= 'Abcd@1234'
DB_URL = 'mongodb://localhost:27017/teste'
```

* Após a configuração, você pode executar o arquivo de teste usando o seguinte comando:

```node
npm run test
```

Para executar o script de teste mais de uma vez, é necessário realizar as seguintes ações:

- Criar novamente os itens de cada coleção informados no começo da documentação.
- Remover os itens criados pelo teste.

## Colaboradores

<table>
  <tr>
  <!-- João Lucas -->
    <td align="center">
      <a href="https://github.com/JoaoLucasAssis">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwxCRWlkfeigdbif83ap111RPNlGARl02wOF5OvW9zUA&s" width="100px;" height="100px;" alt="Foto do João Lucas"/><br>
        <sub>
          <b>JoaoLucasAssis</b>
        </sub>
      </a>
    </td>
    </td>
  </tr>
</table>

## Licença

Este projeto não possui nenhum licença. Sinta-se à vontade para usar, modificar e distribuir este código conforme necessário.
