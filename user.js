var dateFormat = require("dateformat");
var passwordHash = require("password-hash");

// function to login
exports.login = function(req, res) {
  var message = "";
  var session = req.session;

  if (req.method == "POST") {
    var post = req.body;
    var name = post.lc_username;
    var sqlStatementUser =
      "SELECT * FROM `lc_users` WHERE user_name = '" + name + "'";

    dbConnection.query(sqlStatementUser, function(err, results) {
      if (results.length > 0) {
        var validPass = passwordHash.verify(
          post.lc_password,
          results[0].password
        ); // verifying the hashed password
        if (validPass) {
          req.session.userID = results[0].id;
          req.session.user = results[0];
          if (req.session.userID != null) {
            res.redirect("/chats");
          }
        } else {
          message = "Invalid Password";
          res.render("login.ejs", { message: message });
        }
      } else {
        message = "Incorrect Credential";
        res.render("login.ejs", { message: message });
      }
    });
  } else {
    res.render("login.ejs", { message: message });
  }
};

// function to logout
exports.logout = function(req, res) {
  req.session.destroy(function(err) {
    res.redirect("/login");
  });
};

// function to signup
exports.signup = function(req, res) {
  message = "";

  if (req.method == "POST") {
    var post = req.body;
    var fname = post.lc_first_name;
    var lname = post.lc_last_name;
    var uname = post.lc_user_name;
    var pass = passwordHash.generate(post.lc_password); // hashed password
    var created_at = dateFormat(new Date(), "yyyy-m-d HH:MM:ss");

    var sqlInsert =
      "INSERT INTO `lc_users`(`first_name`,`last_name`,`user_name`,`password`,`created_at`) VALUES('" +
      fname +
      "','" +
      lname +
      "','" +
      uname +
      "','" +
      pass +
      "','" +
      created_at +
      "' )";

    var query = dbConnection.query(sqlInsert, function(err, result) {
      if (!err) {
        message = "Account created successfully!!!";
        res.render("login.ejs", { message: message });
      } else {
        message = err;
        res.render("signup.ejs", { message: message });
      }
    });
  } else {
    res.render("signup.ejs");
  }
};
