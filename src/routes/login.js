const express = require('express');
const controller = require('../controllers/login');
const routes = express.Router();

routes.post('/', controller.index);
routes.get('/:id-:ong_id', (req,res)=>{
  try{
    return res.json(req.params);

  }
  catch(e){
    return res.json(e.message)
  }
})

module.exports = routes;