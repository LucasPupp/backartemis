const express=require('express');
const routes = express.Router();

routes.get('/', (req,res)=>{
  return res.send('Api Artêmis | Todos por um!')
});

module.exports = routes;
