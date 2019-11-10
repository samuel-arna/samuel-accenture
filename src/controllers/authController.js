const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.json');
const User = require('../models/user');

function gerarToken(params = {}) {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 60 * 60 * 24, // expira em um dia caso desejar 30 min alterar para 30 * 60
  });
}

const router = express.Router();

router.post('/sign_up', async (req, res) => {
  const { email } = req.body;
  try {
    if (await User.findOne({ email })) { return res.status(400).send({ mensagem: 'E-mail já existente' }); }
    const user = await User.create(req.body);
    return res.send({
      user,
      token: gerarToken({ id: user.id }),
    });
  } catch (err) {
    return res.status(400).send({ mensagem: 'Falha ao se registrar, verifique os valores digitados' });
  }
});
router.post('/sign_in', async (req, res) => {
  const { email, senha } = req.body;
  const user = await User.findOne({ email }).select('+senha');
  if (!user) { return res.status(401).send({ mensagem: 'Usuário e/ou senha inválidos' }); }
  if (!await bcrypt.compare(senha, user.senha)) { return res.status(401).send({ mensagem: 'Usuário e/ou senha inválidos' }); }
  const agora = new Date();
  try {
    const usuario = await User.findByIdAndUpdate(user.id, { ultimo_login: agora }, { new: true });
    res.send({
      usuario,
      token: gerarToken({ id: user.id }),
    });
  } catch (err) {
    return res.status(401).send({ mensagem: 'Usuário e/ou senha inválidos' });
  }
  return false;
});
module.exports = (app) => app.use('/auth', router);
