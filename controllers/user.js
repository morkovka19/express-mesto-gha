const User = require('../models/user');;

module.exports.getUsers =(req, res) =>{
  User.find({})
  .then(users => res.send({data: users}))
  .catch((e) =>  {
    console.log(e.name);
    if (e.name === 'ValidationError')
      res.status(400).send({message: 'Переданы некорректные данные'});
    else res.status(500).send({message: 'Произола ошибка'});
  });
}

module.exports.createUser = (req, res) =>{
  User.create(req.body)
  .then(user => res.send({data:  user}))
  .catch((e) => {
    console.log(e.name);
    if (e.name === 'ValidationError')
      res.status(400).send({message: 'Переданы некорректные данные'});
    else res.status(500).send({message: 'Произола ошибка'});
  });
}

module.exports.getUser = (req, res) =>{
  const userId = req.params.userId;
  console.log(userId)
  User.findById(req.params.userId)
  .then(user => res.send({data: user}))
  .catch((e) => {
    console.log(e.name);
    if (e.name === 'CastError')
      res.status(404).send({message: 'Пользователь по указанному _id не найден'});
    else res.status(500).send({message: 'Произола ошибка'});
  })
};

module.exports.installProfile = (req, res) =>{
  User.findByIdAndUpdate({_id: req.user._id},
  {$set: { name: req.body?.name, about: req.body?.about }}, {new: true} )
  .then(card => res.status(200).send({data:card}))
  .catch(e =>{
    console.log(e);
    if (e.name === 'CastError')
      res.status(404).send({message: 'Пользователь по указанному _id не найден'});
    if (e.name == 'ValidationError')
      res.status(400).send({message: 'Переданы некорректные данные'});
    else
      res.status(500).send({message: 'Произола ошибка'});
  })
};

module.exports.installAvatar = (req, res) =>{
  User.findByIdAndUpdate({_id: req.user._id},
    {$set: { avatar: req.body?.avatar}}, {new: true} )
    .then(card => res.status(200).send({data:card}))
    .catch(e =>{
      console.log(e);
      if (e.name === 'CastError')
        res.status(404).send({message: 'Пользователь по указанному _id не найден'});
      if (e.name === 'ValidationError')
        res.status(400).send({message: 'Переданы некорректные данные'});
      else
        res.status(500).send({message: 'Произола ошибка'});
    })
}