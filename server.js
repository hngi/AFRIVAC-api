require('express-async-errors')
const express = require('express');
const app = express();

const preMiddlewares = require('./src/middlewares/preMiddlewares');
const errorMiddlewares = require('./src/middlewares/errorMiddlewares');
const apiRoutes = require('./src/routes');
const databaseConfig = require('./src/config/db');
const port = process.env.PORT;

preMiddlewares(app);

app.use('/api', apiRoutes())

app.use('/', (req, res) => {
  res.status(200).sendFile(express.static("public/index.html"));
})

errorMiddlewares(app)

app.listen(port, () => {
  console.log(`::: server listening on port ${port}. Open via http://localhost:${port}/`);
  databaseConfig();
});

app.on('error', (error) => {
  console.log(`::> an error occiurred in our server: \n ${error}`);
});
