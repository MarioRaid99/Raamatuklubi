<<<<<<< Updated upstream
const {db} = require('../db')
const Utilities = require('./Utilities')
const UUID = require('uuid')

exports.getAll =
async (req,res) => {
    const books = await db.books.findAll();
    console.log("getAll: " +books )
    res
    .status(200)
    .send(books.map(({BookID,Name}) => {return{BookID,Name}}))
}
=======
const { db } = require("../db");
const Books = db.books;
const { Op } = require("sequelize");

exports.getAll = async (req, res) => {
  try {
    const { q, language, year, minYear, maxYear } = req.query;
<<<<<<< Updated upstream
<<<<<<< Updated upstream
=======
=======

    const where = {};

    if (q && q.trim().length > 0) {
      const needle = `%${q.trim()}%`;
      where[Op.or] = [
        { Name: { [Op.like]: needle } },
        { Description: { [Op.like]: needle } },
      ];
    }

    if (language && language.trim().length > 0) {
      where.Language = language.trim();
    }

    if (year) {
      where.ReleaseYear = Number(year);
    } else {
      if (minYear || maxYear) {
        where.ReleaseYear = {};
        if (minYear) where.ReleaseYear[Op.gte] = Number(minYear);
        if (maxYear) where.ReleaseYear[Op.lte] = Number(maxYear);
      }
    }

    const books = await Books.findAll({
      where,
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(books);
  } catch (err) {
    res.status(400).json({ error: "Failed to fetch books", details: err.message });
  }
};
>>>>>>> Stashed changes

    const where = {};

    if (q && q.trim().length > 0) {
      const needle = `%${q.trim()}%`;
      where[Op.or] = [
        { Name: { [Op.like]: needle } },
        { Description: { [Op.like]: needle } },
      ];
    }

    if (language && language.trim().length > 0) {
      where.Language = language.trim();
    }

    if (year) {
      where.ReleaseYear = Number(year);
    } else {
      if (minYear || maxYear) {
        where.ReleaseYear = {};
        if (minYear) where.ReleaseYear[Op.gte] = Number(minYear);
        if (maxYear) where.ReleaseYear[Op.lte] = Number(maxYear);
      }
    }

    const books = await Books.findAll({
      where,
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(books);
  } catch (err) {
    res.status(400).json({ error: "Failed to fetch books", details: err.message });
  }
};
>>>>>>> Stashed changes

    const where = {};

    if (q && q.trim().length > 0) {
      const needle = `%${q.trim()}%`;
      where[Op.or] = [
        { Name: { [Op.like]: needle } },
        { Description: { [Op.like]: needle } },
      ];
    }

    if (language && language.trim().length > 0) {
      where.Language = language.trim();
    }

    if (year) {
      where.ReleaseYear = Number(year);
    } else {
      if (minYear || maxYear) {
        where.ReleaseYear = {};
        if (minYear) where.ReleaseYear[Op.gte] = Number(minYear);
        if (maxYear) where.ReleaseYear[Op.lte] = Number(maxYear);
      }
    }

    const books = await Books.findAll({
      where,
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(books);
  } catch (err) {
    res.status(400).json({ error: "Failed to fetch books", details: err.message });
  }
};
>>>>>>> Stashed changes

exports.getByID = 
async (req, res) => {
    const book = await getBook(req, res);
    if (!book) 
        {return res.status(404).send({error: 'Book not found'})}
    return res.status(200).send(book)
}

exports.create =
async (req, res) => {
    if (
        !req.body.Name ||
        !req.body.Description ||
        !req.body.Pages ||
        !req.body.RealeaseYear ||
        !req.body.Language
    ){
        return res.status(400).send({error:'Missing some parameter, please review your request data!'})
    }
    const newBook = {
        BookID: UUID.v7(),
        Name: req.body.Name,
        Description: req.body.Description,
        Pages: req.body.Pages,
        ReleaseYear: req.body.RealeaseYear,
        Language: req.body.Language,
    }
    
    const createdBook = await db.books.create(newBook);
    return res
    .location(`${Utilities.getBaseURL(req)}/books/${createdBook.BookID}`).sendStatus(201);
}


exports.deleteById = 
async (req, res) => {
    const filmToBeDeleted = await getFilm(req,res);
    if(!filmToBeDeleted) 
    {
        return;
    }
    await filmToBeDeleted.destroy();
    res.status(204).send({error:"No Content!"})
}

const getBook =
async (req, res) => {
    const idNumber = req.params.BookID
    console.log(idNumber)
    

    const book = await db.books.findByPk(idNumber)
    if(!book) {
        res.status(404).send({Error: `Book with this id was not fould ${idNumber}`})
        return null;
    }
    return book;
}