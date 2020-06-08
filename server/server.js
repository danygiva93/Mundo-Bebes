require('./app.config');
const express = require('express');
const app = express();
app.use(require('./controller/index.controller'));


app.listen(process.env.PORT, () => {
  console.log('listening over port 3000')
});

