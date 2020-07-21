const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 3333;

app.use(bodyParser.json({
  limit: '5mb'
}));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.json());
app.use(cors());

const index = require('./routes/index');
const ongs = require('./routes/ongs');
const casos = require('./routes/casos');
const publico = require('./routes/casosPublicos');
const usuarios = require('./routes/usuarios');
const adminCasos = require('./routes/casosAdmin');
const adminOngs = require('./routes/ongsAdmin');
const login = require('./routes/login');


app.use('/', index);
app.use('/ongs', ongs);
app.use('/casos', casos);
app.use('/publico', publico);
app.use('/usuarios', usuarios);
app.use('/admin-casos', adminCasos);
app.use('/admin-ongs', adminOngs);
app.use('/login', login);

app.listen(process.env.PORT || port, ()=>{
  console.log('api rodando na porta: '+ port);
})
