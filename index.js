const express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');
const fetchUrl = require("fetch").fetchUrl;

const app = express()
const port = 3000;

var schema = buildSchema(`
  type Response {
    page: Int
    per_page: Int
    total: Int
    total_pages: Int
    data: [Data]
    support: Support
  }

  type Data {
    id: Int
    email: String
    first_name: String
    last_name: String
    avatar: String
  }

  type Support {
    url: String
    text: String
  }

  type Query {
    getUsers(page: Int): Response
  }
`);
 
var root = {
  getUsers: async ({page}) => {

    let data = (page) => {
      return new Promise((resolve,reject)=> {
        const pageNo = page? page : 1;
        fetchUrl(`https://reqres.in/api/users?page=${pageNo}`,(err,meta,body)=>{  
          resolve(body.toString());
        })
      })
    }
    return await data(page).then(data=>JSON.parse(data));
  },
};

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});
