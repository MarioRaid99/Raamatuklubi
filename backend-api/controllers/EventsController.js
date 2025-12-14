const { db } = require('../db');
const Utilities = require('./Utilities');
const UUID = require('uuid');

exports.getAll =
async (req, res) => {
  const events = await db.events.findAll();
  return res.status(200).send(
    events.map(({ UniqueID, Title }) => ({ UniqueID, Title }))
  );
};

