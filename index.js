const path = require('path');
const express = require('express');
const app = express();
const db = require('./queries');

app.use(express.urlencoded({extended: true})); 
app.use(express.json());

let apiRoutes = require("./api-routes");


app.get('/', (req, res) => {
    res.send('hello world');
});

app.get('/data', db.getUsers);

app.get('/404', function(req, res, next){
  // trigger a 404 since no other middleware
  // will match /404 after this one, and we're not
  // responding here
  next();
});


app.use('/api', apiRoutes);
app.use(function(req, res, next){
  res.status(404);

  res.format({
    default: function () {
      res.type('txt').send('Error 404: Page not found, please enter a valid URL')
    }
  })
});

const port = process.env.PORT || 3001;
var server = app.listen(port, function () {
    var host = server.address().address;
    var port = server.address().port;
  
    console.log('App listening at http://%s:%s', host, port);
  });
module.exports = server