var express = require('express');
var bodyParser = require('body-parser');
var redis = require('redis');
var swig = require('swig');

var app = express();
var client = redis.createClient(6379, "redis");

app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/view');
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/', function (req, res) {
    client.lrange('guestbook-node-messages', 0, -1, function (err, msgs) {
        if (err) {
            console.log(err);
        }
        res.render('list', { messages: msgs })
    });
});

app.post('/post', function(req, res) {
    if (!req.body.msg) {
        res.redirect('/');
    }

    client.rpush('guestbook-node-messages', req.body.msg, function (err) {
        if (err) {
            console.log(err);
        }
        res.redirect('/');
    });
});

client.on("error", function (err) {
    console.log("Error " + err);
});

process.on("SIGTERM", function () {
    client.quit();
    app.close(function () {
        process.exit(0);
    });
});

app.listen(3000);
