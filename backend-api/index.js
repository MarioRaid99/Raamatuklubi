require('dotenv').config();
const port = process.env.PORT || 8080;
const host = 'localhost';
const express = require('express');
const cors = require('cors');
const app = express();

const swaggerUI = require('swagger-ui-express');
const yamljs = require('yamljs');

const swaggerDocument = yamljs.load('./docs/swagger.yaml')
//const swaggerDocument = require('./docs/swagger.yaml')
const { sync } = require("./db")


//app.get('/books', (req, res) => {
//    res.send(["Kalevipoeg", "Harry Potter", "Kriminoloogia"])
//})


app.use(cors());
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))
app.use(express.json());

require("./routes/bsRoutes")(app);
require("./routes/eventsRoutes")(app);
require("./routes/authRoutes")(app);
require("./routes/usersRoutes")(app);
require("./routes/eventsRoutes")(app);
require("./routes/userBooksRoutes")(app);
require("./routes/uploadRoutes")(app);

app.listen(port, async () =>{
    if (process.env.SYNC === 'true') {await sync();}
    console.log(`API on aadressil: http://${host}:${port}`)
})

const path = require("path");

app.use("/uploads", require("express").static(path.join(__dirname, "uploads")));
