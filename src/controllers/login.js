'use strict'
require('dotenv').config();
const connection = require('../database/connection');
const jwt = require('jsonwebtoken');
const md5 = require('md5');
const tabela = 'usuarios';

function generateToken(params ={}){
  return jwt.sign(params, process.env.SALT_KEY, {expiresIn: '1d'});
}

module.exports = {
  async index(req,res){
    let {email,senha} = req.body;
    senha = md5(senha + process.env.SALT_KEY);

    try{
      const user = await connection(tabela).column('id','nome','email', 'senha').select().where('email', email);
      if(user.length===0){
        const ong = await connection('ongs').column('id','nome','email', 'senha').select().where('email', email);
        if(ong.length === 0)
          return res.json({message: 'Email não encontrado', status: 'erro'});
        
        if(senha !== ong[0].senha)
          return res.json({message: 'Senha inválida', status: 'erro'});

        ong[0].senha = undefined;
        return res.json({acesso: 'ong', ong, token:generateToken({id: ong[0].id}), status: 'sucesso'});
      }
      if(senha !== user[0].senha)
        return res.json({message: 'Senha inválida', status: 'erro'});
      
      user[0].senha = undefined;
      return res.json({acesso: 'privado', user, token: generateToken({id: user[0].id}), status: 'sucesso'});
      
    }catch(e){
      return res.json({message: e.message, status: 'error'})
    }
  }
}