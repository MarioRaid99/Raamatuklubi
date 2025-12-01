const {db} = require('../db')
const Utilities = require('./Utilities')

exports.getAll =
async (req,res) => {
    const books = await db.books.findAll();
    console.log("getAll: " +books )
    res
    .status(200)
    .send(books.map(({BookID,Name}) => {return{FilmID,Name}}))
}