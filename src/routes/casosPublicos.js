const express = require('express');
const connection = require('../database/connection');
const routes = express.Router();

routes.get('/', async(req,res)=>{
  try{
    const casos = await connection('casos').join('ongs', 'ongs.id', '=', 'casos.ong_id').select('casos.*','ongs.email','ongs.nome');
    console.log(casos)
    return res.json({casos,status:'sucesso'});

  }catch(e){
    return({message: e.message, status: 'erro'})
  }
});

module.exports = routes;