const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/samuelaccenture', {
  useFindAndModify: false, useUnifiedTopology: true, useCreateIndex: true, useNewUrlParser: true,
});
mongoose.Promise = global.Promise;

module.exports = mongoose;
