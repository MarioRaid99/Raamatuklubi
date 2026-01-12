const { db } = require("../db");
const Books = db.books;

exports.getAll = async (req, res) => {
  try {
    const books = await Books.findAll({ order: [["createdAt", "DESC"]] });
    return res.status(200).json(books);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch books", details: err.message });
  }
};

exports.getByID = async (req, res) => {
  try {
    const { BookID } = req.params;
    const book = await Books.findByPk(BookID);

    if (!book) return res.status(404).json({ error: "Book not found" });
    return res.status(200).json(book);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch book", details: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { Name, Description, Pages, ReleaseYear, Language, UserScore } = req.body;

    // minimaalsed validatsioonid (DB teeb ka oma)
    if (!Name || !Description || Pages == null || ReleaseYear == null || !Language) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["Name", "Description", "Pages", "ReleaseYear", "Language"],
      });
    }

    const created = await Books.create({
      Name,
      Description,
      Pages,
      ReleaseYear,
      Language,
      UserScore,
    });

    return res.status(201).json(created);
  } catch (err) {
    return res.status(400).json({ error: "Failed to create book", details: err.message });
  }
};

exports.deleteById = async (req, res) => {
  try {
    const { BookID } = req.params;

    const deleted = await Books.destroy({ where: { BookID } });

    if (!deleted) return res.status(404).json({ error: "Book not found" });
    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ error: "Failed to delete book", details: err.message });
  }
};

exports.updateById = async (req, res) => {
  try {
    const { BookID } = req.params;

    const book = await Books.findByPk(BookID);
    if (!book) return res.status(404).json({ error: "Book not found" });

    const allowed = ["Name", "Description", "UserScore", "Pages", "ReleaseYear", "Language"];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No valid fields to update", allowed });
    }

    await book.update(updates);
    return res.status(200).json(book);
  } catch (err) {
    return res.status(400).json({ error: "Failed to update book", details: err.message });
  }
};

