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

exports.create =
async (req, res) => {
  if (
    !req.body.Event_type ||
    !req.body.Title ||
    !req.body.User_id ||
    !req.body.Start_time
  ) {
    return res.status(400).send({
      error: 'Missing some parameter, please review your request data!'
    });
  }

  const newEvent = {
    UniqueID: UUID.v7(),
    Event_type: req.body.Event_type,
    Title: req.body.Title,
    Description: req.body.Description ?? null,
    User_id: req.body.User_id,
    Start_time: req.body.Start_time,
    Created_at: new Date(),
    Location: req.body.Location ?? null
  };

  const createdEvent = await db.events.create(newEvent);

  return res
    .location(`${Utilities.getBaseURL(req)}/events/${createdEvent.UniqueID}`)
    .sendStatus(201);
};

exports.modify =
async (req, res) => {
  const event = await getEvent(req, res);
  if (!event) return;

  const body = req.body || {};
  const updatableFields = ['Event_type', 'Title', 'Description', 'User_id', 'Start_time', 'Location'];
  const hasAny = updatableFields.some((k) => body[k] !== undefined);

  if (!hasAny) {
    return res.status(400).send({ error: 'No valid fields provided for update!' });
  }

  const patch = {};
  for (const k of updatableFields) {
    if (body[k] !== undefined) patch[k] = body[k];
  }

  await event.update(patch);
  return res.status(200).send(event);
};