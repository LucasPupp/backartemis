require('dotenv').config();
const connection = require('../database/connection');
const table= 'casos';

module.exports = {

  async index(req,res){
    try{
      
      const casos = await connection(table).select();

      return res.json({casos, status:'sucesso'});

    }catch(e){
      return res.json({message: e.message, status:'erro'});
    }
  },


  async show(req,res){
    let {id} = req.params;
    try{
      
      const caso = await connection(table).select().where('id',id);
      const consultado = caso[0];

      if(!consultado){
        return res.json({message: 'Não existe caso com esse id para essa ONG', status:'erro'});

      }
      return res.json({caso, status:'sucesso'});

    }catch(e){
      return res.json({message: e.message, status:'erro'});
    }
  },
  
  
  async create(req,res){
    let {titulo,descricao,valor,tipo ,id} = req.body;  
    try{
      await connection(table).insert({
        titulo,descricao,valor,tipo,ong_id:id
      }).returning('id');
      return res.json({message: 'Sucesso, sua caso foi criada sucesso', status:'sucesso'});

    }catch(e){
      return res.json({message: e.message, status:'erro'});
    }
  },
  
  
  async update(req,res){
    let {id} = req.params;
    let{titulo,descricao,valor,tipo} = req.body;

    try{
           
      const consulta = await connection(table).select().column('ong_id').where('id',id);
      if(!consulta[0])
        return res.json({message: 'Não existe caso cadastrado com esse id para essa ONG', status: 'erro'});

      await connection(table).update({
        titulo,descricao,valor,tipo
      }).where('id',id);

      return res.json({message: 'Caso atualizado com sucesso', status:'sucesso'});
    
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
        return res.json({message: 'Não existe caso com esse id', status:'erro'});

      }
      await connection(table).delete().where('id',id);

      return res.json({message: 'Caso deletado com sucesso', status:'sucesso'});

    }catch(e){
      return res.json({message: e.message, status:'erro'});
    }
  },



}