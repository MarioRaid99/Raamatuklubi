const { db } = require("../db");
const Books = db.books;
const { Op } = require("sequelize");

// GET /books?q=&language=&year=&minYear=&maxYear=
exports.getAll = async (req, res) => {
  try {
    const { q, language, year, minYear, maxYear } = req.query;

    const where = {};

    if (q && q.trim()) {
      const needle = `%${q.trim()}%`;
      where[Op.or] = [
        { Name: { [Op.like]: needle } },
        { Description: { [Op.like]: needle } },
      ];
    }

    if (language && language.trim()) {
      where.Language = language.trim();
    }

    if (year) {
      where.ReleaseYear = Number(year);
    } else if (minYear || maxYear) {
      where.ReleaseYear = {};
      if (minYear) where.ReleaseYear[Op.gte] = Number(minYear);
      if (maxYear) where.ReleaseYear[Op.lte] = Number(maxYear);
    }

    const books = await Books.findAll({
      where,
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json(books);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Failed to fetch books", details: err.message });
  }
};

// GET /books/:BookID
exports.getByID = async (req, res) => {
  try {
    const { BookID } = req.params;
    const book = await Books.findByPk(BookID);

    if (!book) return res.status(404).json({ error: "Book not found" });
    return res.status(200).json(book);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Failed to fetch book", details: err.message });
  }
};

// POST /books
exports.create = async (req, res) => {
  try {
    const releaseYear = req.body.ReleaseYear ?? req.body.RealeaseYear;

    const { Name, Description, Pages, Language, UserScore } = req.body;

    if (!Name || !Description || Pages == null || releaseYear == null || !Language) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["Name", "Description", "Pages", "ReleaseYear", "Language"],
      });
    }

    const created = await Books.create({
      Name,
      Description,
      Pages,
      ReleaseYear: Number(releaseYear),
      Language,
      UserScore,
    });

    return res.status(201).json(created);
  } catch (err) {
    return res
      .status(400)
      .json({ error: "Failed to create book", details: err.message });
  }
};

// DELETE /books/:BookID
exports.deleteById = async (req, res) => {
  try {
    const { BookID } = req.params;

    const deleted = await Books.destroy({ where: { BookID } });

    if (!deleted) return res.status(404).json({ error: "Book not found" });
    return res.status(204).send();
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Failed to delete book", details: err.message });
  }
};

// PATCH /books/:BookID
exports.updateById = async (req, res) => {
  try {
    const { BookID } = req.params;

    const book = await Books.findByPk(BookID);
    if (!book) return res.status(404).json({ error: "Book not found" });

    const allowed = [
      "Name",
      "Description",
      "UserScore",
      "Pages",
      "ReleaseYear",
      "Language",
    ];

    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    // legacy typo support
    if (updates.ReleaseYear === undefined && req.body.RealeaseYear !== undefined) {
      updates.ReleaseYear = req.body.RealeaseYear;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No valid fields to update", allowed });
    }

    await book.update(updates);
    return res.status(200).json(book);
  } catch (err) {
    return res
      .status(400)
      .json({ error: "Failed to update book", details: err.message });
  }
};
