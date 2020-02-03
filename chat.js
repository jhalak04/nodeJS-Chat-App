var dateFormat = require("dateformat");

// Function to display chat window
exports.display = function(req, res) {
  var user = req.session.user,
    messageResult = [];

  if (req.session.userID == null) {
    res.redirect("/login");
    return;
  }

  // fetching all messages
  var messagesSql =
    "SELECT u.id AS user_id, m.message_id, u.user_name AS u_name, m.message AS message, m.message_date AS m_date FROM lc_user_messages m JOIN lc_users u ON u.id = m.user_id ORDER BY m_date DESC;";

  dbConnection.query(messagesSql, function(err, messageResults) {
    if (err) throw err;

    //fetching all likes
    var likeSql =
      "SELECT like_id, message_id, user_id FROM lc_likes as l WHERE l.user_id = ? AND message_id = ? GROUP BY message_id;";

    messageResults.forEach(function(mResult, index) {
      dbConnection.query(
        likeSql,
        [req.session.userID, mResult["message_id"]],
        function(err, likeResults) {
          if (err) throw err;
          var addClass = "";
          // hightlight the message of loggedin user
          if (req.session.userID == mResult["user_id"]) {
            addClass = "hightlight-row";
          }
          messageResult.count = 0;
          likeResults.forEach(function(likeResult, index) {
            if (req.session.userID == likeResult["user_id"]) {
              messageResult.count = 1;
            }
          });
          messageResult.push({
            count: messageResult.count,
            u_name: mResult["u_name"],
            message: mResult["message"],
            m_date: dateFormat(mResult["m_date"], "yyyy-mm-dd hh:mm"),
            highlightMsg: addClass,
            message_id: mResult["message_id"]
          });
        }
      );
    });
    var sql = "SELECT * FROM lc_users WHERE id ='" + req.session.userID + "'";
    dbConnection.query(sql, function(err, results) {
      //console.log(messageResult);
      if (err) throw err;
      res.render("chat.ejs", {
        user: user,
        chat_messages: messageResult
      });
    });
  });
};

// exports.message = function(req, res) {
//   if (req.method == "POST") {
//     var post = req.body;
//     var mText = post.messageText;
//     var mDate = dateFormat(new Date(), "yyyy-m-d HH:MM");

//     if (req.session.userID == null) {
//       res.redirect("/login");
//       return;
//     }
//     var sqlInsert =
//       "INSERT INTO `lc_user_messages`(`user_id`,`message`,`message_date`) VALUES('" +
//       req.session.userID +
//       "','" +
//       mText +
//       "','" +
//       mDate +
//       "')";

//     dbConnection.query(sqlInsert, function(err) {
//       if (!err) {
//         res.redirect("/chats");
//       }
//     });
//   }
// };
