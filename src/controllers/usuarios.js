require('dotenv').config();
const connection = require('../database/connection');
const md5 = require('md5');
const tabela = 'usuarios';


module.exports = {

  async index(req,res){
    try{
      const usuarios = await connection(tabela).select();
      return res.json(usuarios);

    }catch(e){
      return res.json({message: e.message});
    }
  },
  async show(req,res){
    let{id} = req.params;
    try{
      const usuario = await connection(tabela).select().where('id',id);
      return res.json(usuario);
    }catch(e){
      return res.json({message: e.message});
    }
  },
  async create(req,res){
    let{nome,email,senha} = req.body;
    try{
      senha = md5(senha + process.env.SALT_KEY);
      const user = await connection(tabela).select().column('email').where('email', email);
      if(user.length > 0)
        return res.json({message: 'Já existe usuario com esse email', status: 'errro'});

      await connection(tabela).insert({
        nome,email,senha
      })
      return res.json({message: 'Usuario cadastrado com sucesso', status: 'sucesso'});

    }catch(e){
      return res.json({message: e.message});
    }
  },
  async update(req,res){
    let {id}= req.params;
    let{nome,email,senha}= req.body;

    try{
      const user = await connection(tabela).select().column('email','id').where('email', email).andWhere('id',"<>", id);
      if(user.length > 0)
        return res.json({message: 'Já existe usuario com esse email', status: 'errro'});

      if(senha === '' || senha === undefined || senha === null){
        await connection(tabela).update({
          nome,email
        }).where('id',id);

        return res.json({message: 'Usuario atualizado com sucesso', status: 'sucesso'});
      }else{
        senha = md5(senha + process.env.SALT_KEY);
        await connection(tabela).update({
          nome,email,senha
        }).where('id', id);

        return res.json({message: 'Usuario atualizado com sucesso', status: 'sucesso'});
      }

    }catch(e){
      return res.json({message: e.message});
    }
  },
  async delete(req,res){
    let {id} = req.params;

    try{
      await connection(tabela).delete().where('id', id);
      return res.json({message: 'Usuário deletado com sucesso', status: 'sucesso'});
      
    }catch(e){
      return res.json({message: e.message});
    }
  },


}