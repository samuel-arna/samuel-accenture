const uuidv4 = require('uuid/v4');
const bcrypt = require('bcryptjs');
const mongoose = require('../database');

const UserSchema = mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4(),
  },
  nome: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  senha: {
    type: String,
    required: true,
    select: false,
  },
  telefones: {
    numero: { type: Number },
    ddd: { type: Number },
  },
  data_criacao: {
    type: Date,
    default: Date.now,
  },
  data_atualizacao: {
    type: Date,
    default: Date.now,
  },
  ultimo_login: {
    type: Date,
    default: Date.now,
  }
});

UserSchema.pre('save', async function salvar(next) {
  const hash = await bcrypt.hash(this.senha, 9);
  this.senha = hash;
  next();
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
