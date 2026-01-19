const { db } = require("../db");
const Events = db.events;

exports.getAll = async (req, res) => {
  try {
    const events = await Events.findAll({ order: [["createdAt", "DESC"]] });
    return res.status(200).json(events);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Failed to fetch events", details: err.message });
  }
};

exports.getByID = async (req, res) => {
  try {
    const { EventID } = req.params;
    const event = await Events.findByPk(EventID);

    if (!event) return res.status(404).json({ error: "Event not found" });
    return res.status(200).json(event);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Failed to fetch event", details: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { Title, Description, StartTime, EndTime, Location } = req.body;

    if (!Title || !StartTime) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["Title", "StartTime"],
      });
    }

    const created = await Events.create({
      Title,
      Description: Description ?? null,
      StartTime,
      EndTime: EndTime ?? null,
      Location: Location ?? null,
    });

    return res.status(201).json(created);
  } catch (err) {
    return res
      .status(400)
      .json({ error: "Failed to create event", details: err.message });
  }
};

exports.deleteById = async (req, res) => {
  try {
    const { EventID } = req.params;
    const deleted = await Events.destroy({ where: { EventID } });

    if (!deleted) return res.status(404).json({ error: "Event not found" });
    return res.status(204).send();
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Failed to delete event", details: err.message });
  }
};

exports.updateById = async (req, res) => {
  try {
    const { EventID } = req.params;
    const event = await Events.findByPk(EventID);

    if (!event) return res.status(404).json({ error: "Event not found" });

    const allowed = ["Title", "Description", "StartTime", "EndTime", "Location"];
    const updates = {};

    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No valid fields to update", allowed });
    }

    await event.update(updates);
    return res.status(200).json(event);
  } catch (err) {
    return res
      .status(400)
      .json({ error: "Failed to update event", details: err.message });
  }
};
