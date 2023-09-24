const express = require('express');
const mongoose = require('mongoose');
const user = require('./controllers/user');
const auth = require('./middlewares/auth');

const PORT = 3000;
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
}).then(() => {
  console.log('Conected to db');
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/signin', user.login);
app.post('/signup', user.createUser);

app.use(auth);

app.use('/users', require('./routes/user'));
app.use('/cards', require('./routes/card'));
app.use('/*', require('./routes/error'));

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
