var express = require('express');
var router = express.Router();
var admin = require('firebase-admin');
var serviceAccount = require('../iotdbfs-firebase-adminsdk.json');
var timestamp = require('unix-timestamp');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://iotdbfs.firebaseio.com'
});

var db = admin.database();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});
router.post('/savedata', function (req, res, next) {
  try {
    var ref = db.ref("Dispositivos/" + req.body.device);
    delete req.body.device;
    var time = Math.trunc(timestamp.now(), 0);
    var data = {};
    data[time] = req.body;
    ref.update(data)
    res.send(200);
  }
  catch (error) {
    console.log(error);
    res.send(500);
  }
});
router.post('/getdata', function (req, res, next) {
  try {
    console.log(JSON.stringify(req.body));
    var ref = db.ref("Dispositivos/" + req.body.device);
    ref.limitToLast(req.body.numQuery).orderByValue().once("value",function (data) {
      console.log(data);
      res.send(data);
    });
  } 
  catch (error) {
    console.log(error);
    res.send(500);
  }
});

module.exports = router;
