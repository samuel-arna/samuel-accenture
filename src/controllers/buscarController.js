const express = require('express');
const authMiddleware = require('../middlewares/auth');
const User = require('../models/user');

const router = express.Router();

router.use(authMiddleware);

router.get('/', (req, res) => {
  res.send({ id: req.userId });
});

router.get('/:usuarioId', async (req, res) => {
  try {
    const usuario = await User.findById(req.params.usuarioId).populate('usuario');
    if (usuario.id !== req.userId) {
      return res.status(401).send({ mensagem: 'Não autorizado' });
    }
    const ultimoLogin = usuario.ultimo_login;
    const dataLimite = new Date(ultimoLogin.setMinutes(ultimoLogin.getMinutes() + 30));
    const agora = new Date();
    if (agora > dataLimite) {
      return res.status(401).send({ mensagem: 'Sessão inválida' });
    }
    Date(ultimoLogin.setMinutes(ultimoLogin.getMinutes() - 30));
    return res.send({ usuario });
  } catch (err) {
    return res.status(401).send({ mensagem: 'Usuário não encontrado' });
  }
});

module.exports = (app) => app.use('/buscar_usuarios', router);
