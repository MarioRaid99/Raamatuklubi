const { db } = require("../db");
const Utilities = require('./Utilities');
const UUID = require('uuid');
const getUser = async (req, res) => {
  const id = req.params.UserID;
  if (!id) {
    res.status(400).send({ error: "Missing User ID!" });
    return null;
  }

  const user = await db.users.findByPk(id);
  if (!user) {
    res.status(404).send({ error: "User not found" });
    return null;
  }

  return user;
};

exports.getAll = async (req, res) => {
  const users = await db.users.findAll();
  return res.status(200).send(
    users.map(({ UserID, First_name, Last_name }) => ({
      UserID,
      First_name,
      Last_name,
    }))
  );
};

exports.getByID = async (req, res) => {
  const user = await getUser(req, res);
  if (!user) return;
  return res.status(200).send(user);
};

exports.create =
async (req, res) => {
  if (!req.body.First_name || !req.body.Last_name || !req.body.Email) {
    return res.status(400).send({
      error: 'Missing some parameter, please review your request data!'
    });
  }

  const newUser = {
    UserID: UUID.v7(),
    First_name: req.body.First_name,
    Last_name: req.body.Last_name,
    Email: req.body.Email,
    Phone_number: req.body.Phone_number ?? null
  };

  const createdUser = await db.users.create(newUser);

  return res
    .location(`${Utilities.getBaseURL(req)}/users/${createdUser.UserID}`)
    .sendStatus(201);
};
