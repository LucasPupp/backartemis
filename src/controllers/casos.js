require('dotenv').config();
const connection = require('../database/connection');
const table= 'casos';
module.exports = {

  async index(req,res){
    let {id} = req.params;
    try{

      if(!id)
        return res.json({message: 'Informe a ONG', status: 'erro'})
      
      const ong = await connection('ongs').select().column('id').where('id', id);
      
      if(!ong[0])
        return res.json({message: 'Esta ONG não está cadastrada em nosso sistema', status: 'erro'});
      
      const casos = await connection(table).where('ong_id',id).join('ongs', 'ongs.id', '=', 'casos.ong_id').select(['casos.*', 'ongs.nome', 'ongs.email', 'ongs.telefone', 'ongs.cidade', 'ongs.uf']);

      return res.json({casos, status:'sucesso'});

    }catch(e){
      return res.json({message: e.message, status:'erro'});
    }
  },


  async show(req,res){
    let {id, ong_id} = req.params;
    // let {ong_id} = req.body;
    try{
      if(!ong_id)
      return res.json({message: 'Informe sua ong', status: 'erro'});

      const ong = await connection('ongs').select().column('id').where('id', ong_id);
      if(!ong[0])
        return res.json({message: "Essa ONG não está cadastrada em nosso sistema!", status: 'erro'});
      
      const caso = await connection(table).select().where('id',id).where('ong_id', ong_id);
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
      return res.json({message: 'Sucesso, seu caso foi criado sucesso', status:'sucesso'});

    }catch(e){
      return res.json({message: e.message, status:'erro'});
    }
  },
  
  
  async update(req,res){
    let {id} = req.params;
    let{titulo,descricao,valor,tipo,ong_id} = req.body;

    try{
      const consultaOng = await connection('ongs').select('id').where('id', ong_id);
      if(!consultaOng[0])
        return res.json({message: 'Essa ONG não está cadastrada no nosso sistema', status: 'erro'});

      
      const consulta = await connection(table).select().column('ong_id').where('id',id);
      if(!consulta[0])
        return res.json({message: 'Não existe caso cadastrado com esse id para essa ONG', status: 'erro'});

      await connection(table).update({
        titulo,descricao,valor,tipo
      }).where('id',id).andWhere('ong_id', ong_id);

      return res.json({message: 'Caso atualizado com sucesso', status:'sucesso'});
    
    }catch(e){
      return res.json({message: e.message, status:'erro'});
    }
  },
  
  
  async delete(req,res){
    let {id, ong_id} = req.params;

    console.log(id);
    console.log(ong_id);

    try{
      const consultaOng = await connection('ongs').select('id').where('id', ong_id);
      if(!consultaOng[0])
        return res.json({message: 'Essa ONG não está cadastrada no nosso sistema', status: 'erro'});
      
        const consultaOng2 = await connection(table).select().column('ong_id').where('id',id);
        if(!consultaOng2[0])
          return res.json({message: 'Não existe caso com esse id para essa ONG', status: 'erro'});

      await connection(table).delete().where('id',id);

      return res.json({message: 'Caso deletado com sucesso', status:'sucesso'});

    }catch(e){
      return res.json({message: e.message, status:'erro'});
    }
  },



}