const { db } = require('../db');
const Utilities = require('./Utilities');
const UUID = require('uuid');

exports.getAll =
async (req, res) => {
  const users = await db.users.findAll();
  return res.status(200).send(
    users.map(({ UserID, First_name, Last_name }) => ({
      UserID,
      First_name,
      Last_name
    }))
  );
};
