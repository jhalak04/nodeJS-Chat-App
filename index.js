// including all require files and modules

var express = require("express"),
  user = require("./user"),
  chat = require("./chat"),
  config = require("./public/js/config"),
  path = require("path"),
  dateFormat = require("dateformat");

const session = require("express-session");
const app = express();
const bodyParser = require("body-parser");
const http = require("http").Server(app);
const mysql = require("mysql");

// Setting up mysql connection
var mySqlConnection = mysql.createConnection({
  host: config.HOST_NAME,
  port: config.DB_PORT,
  user: config.ROOT_USER_NAME,
  password: config.ROOT_PASSWORD,
  database: config.DATABASE_NAME
});

// check database connected or not
mySqlConnection.connect(function(error) {
  if (!error) {
    console.log("Database connected");
  } else {
    console.log("Error Database not connected");
  }
});

// setting connection as global so can be used any files
global.dbConnection = mySqlConnection;

//listening to server port
const server = http.listen(config.PORT, function() {
  console.log("listening on *:" + config.PORT);
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    secret: "session secret",
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
  })
);
app.use(express.static(path.join(__dirname, "public")));

// ajax request for likes and message functionality

app.post("/likes", function(req, res) {
  if (req.method == "POST") {
    var post = req.body;
    var messageId = post.message_id;
    var sqlInsert =
      "INSERT INTO `lc_likes`(`message_id`, `user_id`) VALUES('" +
      messageId +
      "', '" +
      req.session.userID +
      "')";

    dbConnection.query(sqlInsert, function(err, result) {
      res.end(JSON.stringify(result));
    });
  }
});

app.post("/message", function(req, res) {
  if (req.method == "POST") {
    var post = req.body;
    var mText = post.messageText;
    var mDate = dateFormat(new Date(), "yyyy-m-d HH:MM");

    if (req.session.userID == null) {
      res.redirect("/login");
      return;
    }
    var sqlInsert =
      "INSERT INTO `lc_user_messages`(`user_id`,`message`,`message_date`) VALUES('" +
      req.session.userID +
      "','" +
      mText +
      "','" +
      mDate +
      "')";

    dbConnection.query(sqlInsert, function(err, result) {
      var JSONObj = {
        u_name: req.session.user.user_name,
        message: mText,
        m_date: mDate,
        message_id: result.insertId,
        count: 0,
        highlightMsg: "hightlight-row"
      };
      res.end(JSON.stringify(JSONObj));
    });
  }
});

// defining all routes
app.get("/login", user.login);
app.get("/signup", user.signup);
app.post("/login", user.login);
app.post("/signup", user.signup);
app.get("/chats", chat.display);
app.post("/chats", chat.display);
//app.post("/message", chat.message);
app.get("/logout", user.logout);
