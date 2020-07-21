const express = require('express');
const controller = require('../controllers/casos');
const routes = express.Router();

routes.get('/all/:id', controller.index);
routes.get('/:id-:ong_id', controller.show);
routes.post('/', controller.create);
routes.put('/:id', controller.update);
routes.delete('/:id-:ong_id', controller.delete);


module.exports = routes;