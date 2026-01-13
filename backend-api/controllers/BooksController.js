const { db } = require("../db");
const Utilities = require("./Utilities");
const UUID = require("uuid");
const { Op } = require("sequelize");

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

    // Filter by Language
    if (language && language.trim()) {
      where.Language = language.trim();
    }

    // Filter by exact year OR range
    if (year) {
      where.ReleaseYear = Number(year);
    } else if (minYear || maxYear) {
      where.ReleaseYear = {};
      if (minYear) where.ReleaseYear[Op.gte] = Number(minYear);
      if (maxYear) where.ReleaseYear[Op.lte] = Number(maxYear);
    }

    const books = await db.books.findAll({
      where,
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).send(books);
  } catch (err) {
    return res.status(400).send({
      error: "Failed to fetch books",
      details: err.message,
    });
  }
};

// GET /books/:BookID
exports.getByID = async (req, res) => {
  const book = await getBook(req, res);
  if (!book) return res.status(404).send({ error: "Book not found" });
  return res.status(200).send(book);
};

// POST /books
exports.create = async (req, res) => {
 eleaseYear, et midagi katki ei läheks.
  const releaseYear = req.body.ReleaseYear ?? req.body.RealeaseYear;

  if (!req.body.Name || !req.body.Description || !req.body.Pages || !releaseYear || !req.body.Language) {
    return res.status(400).send({
      error: "Missing some parameter, please review your request data!",
    });
  }

  const newBook = {
    BookID: UUID.v7(),
    Name: req.body.Name,
    Description: req.body.Description,
    Pages: Number(req.body.Pages),
    ReleaseYear: Number(releaseYear),
    Language: req.body.Language,
    UserScore: req.body.UserScore ?? null,
  };

  const createdBook = await db.books.create(newBook);

  return res
    .status(201)
    .location(`${Utilities.getBaseURL(req)}/books/${createdBook.BookID}`)
    .send(createdBook);
};

// DELETE /books/:BookID
exports.deleteById = async (req, res) => {
  const bookToBeDeleted = await getBook(req, res);
  if (!bookToBeDeleted) return;

  await bookToBeDeleted.destroy();
  return res.status(204).send();
};

// Helper: find book by PK
const getBook = async (req, res) => {
  const id = req.params.BookID;

  const book = await db.books.findByPk(id);
  if (!book) {
    res.status(404).send({ error: `Book with this id was not found: ${id}` });
    return null;
  }
  return book;
};
