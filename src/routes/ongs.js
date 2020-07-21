const express = require('express');
const controller = require('../controllers/ongs');
const routes = express.Router();

routes.get('/', controller.index);
routes.get('/:id', controller.show);
routes.post('/', controller.create);
routes.put('/:id', controller.update);
routes.delete('/:id', controller.delete);

module.exports = routes;