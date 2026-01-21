const { db } = require("../db");
const UserBooks = db.userBooks;
const Books = db.books;

exports.getMyBooks = async (req, res) => {
  try {
    const UserID = req.user.UserID;

    const rows = await UserBooks.findAll({
      where: { UserID },
      include: [
        {
          model: Books,
          attributes: ["BookID", "Name", "Description", "Pages", "ReleaseYear", "Language"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    
    const result = rows.map((r) => ({
      UserBookID: r.UserBookID,
      UserID: r.UserID,
      BookID: r.BookID,
      UserScore: r.UserScore,
      ImageUrl: r.ImageUrl,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      Book: r.book, // include
    }));

    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch user books", details: err.message });
  }
};

exports.addToMyBooks = async (req, res) => {
  try {
    const UserID = req.user.UserID;
    const { BookID, UserScore, ImageUrl } = req.body;

    if (!BookID) {
      return res.status(400).json({ error: "Missing required field", required: ["BookID"] });
    }

    const book = await Books.findByPk(BookID);
    if (!book) return res.status(404).json({ error: "Book not found" });

    const created = await UserBooks.create({
      UserID,
      BookID,
      UserScore: UserScore ?? null,
      ImageUrl: ImageUrl ?? null,
    });

    return res.status(201).json(created);
  } catch (err) {
    
    return res.status(400).json({ error: "Failed to add book to user", details: err.message });
  }
};

exports.updateMyBook = async (req, res) => {
  try {
    const UserID = req.user.UserID;
    const { BookID } = req.params;

    const row = await UserBooks.findOne({ where: { UserID, BookID } });
    if (!row) return res.status(404).json({ error: "UserBook not found" });

    const allowed = ["UserScore", "ImageUrl"];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No valid fields to update", allowed });
    }

    await row.update(updates);
    return res.status(200).json(row);
  } catch (err) {
    return res.status(400).json({ error: "Failed to update user book", details: err.message });
  }
};

exports.removeFromMyBooks = async (req, res) => {
  try {
    const UserID = req.user.UserID;
    const { BookID } = req.params;

    const deleted = await UserBooks.destroy({ where: { UserID, BookID } });
    if (!deleted) return res.status(404).json({ error: "UserBook not found" });

    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ error: "Failed to remove user book", details: err.message });
  }
};
