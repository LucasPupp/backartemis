require('dotenv').config();
const connection = require('../database/connection');
const md5 = require('md5');
const crypto = require('crypto');
const table= 'ongs';
module.exports = {

  async index(req,res){
    try{
      const ongs = await connection(table).select();

      return res.json({ongs, status:'sucesso'});

    }catch(e){
      return res.json({message: e.message, status:'erro'});
    }
  },

  async show(req,res){
    let {id} = req.params;
    try{
      const ong = await connection(table).select().where('id',id);
      const consultado = ong[0];
      if(!consultado){
        return res.json({message: 'Não existe ong com esse id', status:'erro'});

      }
      return res.json({ong, status:'sucesso'});

    }catch(e){
      return res.json({message: e.message, status:'erro'});
    }
  },

  async create(req,res){
    let id = crypto.randomBytes(4).toString('HEX');
    let {nome, email, senha, telefone, cidade, uf} = req.body;
    let key = process.env.SALT_KEY;
    senha = md5(senha + key);
  
    try{
      await connection(table).insert({
        id,nome,email,senha,telefone,cidade,uf
      }).returning('id');
      return res.json({message: 'Sucesso, sua ong foi criada com ID: ' + id, status:'sucesso'});

    }catch(e){
      return res.json({message: e.message, status:'erro'});
    }
  },

  async update(req,res){
    let {id} = req.params;
    let{nome,email,senha,telefone,cidade,uf} = req.body;

    try{
      const consulta = await connection(table).select().column('id').where('id',id);
      const consultado = consulta[0];
      if(!consultado){
        return res.json({message: 'Não existe ong com esse id', status:'erro'});

      }

    if(senha ===''|| senha === undefined || senha === null){
      await connection(table).update({
        nome,email,telefone,cidade,uf
      });

      return res.json({message: 'Ong atualizada com sucesso!', status:'sucesso'});
    }else{
      let key = process.env.SALT_KEY;
        senha = md5(senha + key);
    
        await connection(table).update({
          id, nome,email,senha,telefone,cidade,uf
        }).where('id',id);

        return res.json({message: 'Ong atualizada com sucesso!', status:'sucesso'});
    }
    
    }catch(e){
      return res.json({message: e.message, status:'erro'});
    }
  },
  
  async delete(req,res){
    let {id} = req.params;
    try{
      const consulta = await connection(table).select().column('id').where('id',id);
      const consultado = consulta[0];
      if(!consultado){
        return res.json({message: 'Não existe ong com esse id', status:'erro'});

      }
      await connection(table).delete().where('id',id);

      return res.json({message: 'Usuário deletado com sucesso', status:'sucesso'});

    }catch(e){
      return res.json({message: e.message, status:'erro'});
    }
  },



}