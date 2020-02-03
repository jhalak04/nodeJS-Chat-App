var LOCAL_PATH = "http://localhost:8090";

// Like Messages
function sendLike(ele) {
  var mId = $(ele).attr("data-val");
  $.ajax({
    url: LOCAL_PATH + "/likes",
    data: { message_id: mId },
    method: "POST",
    success: function(response) {
      if (response) {
        $(ele).addClass("m-liked");
      }
    }
  });
}

// Auto Appear Message on Top of Div immediate after submit the form
function autoAppearMessage() {
  $.ajax({
    url: LOCAL_PATH + "/message",
    data: $("#chatApp").serialize(),
    method: "POST",
    success: function(response) {
      var data = JSON.parse(response);
      var likeClass = "";
      if (data.count > 0) {
        likeClass = "m-liked";
      }
      var HTML =
        '<div class="list-group rounded-0">' +
        '<a class="list-group-item list-group-item-action active text-white rounded-0 ' +
        data.highlightMsg +
        ' ">' +
        '<div class="media">' +
        '<div class="media-body ml-4">' +
        '<div class="d-flex align-items-center justify-content-between mb-1">' +
        '<h6 class="mb-0">' +
        data.u_name.toUpperCase() +
        "</h6>" +
        "</div>" +
        '<p class="font-italic mb-0 text-small">' +
        data.message +
        "</p>" +
        '<small class="small font-weight-bold">' +
        data.m_date +
        "</small>" +
        "</div>" +
        '<i class="glyphicon glyphicon glyphicon-heart like-message ' +
        likeClass +
        ' " aria-hidden="true" id="likeMessage" data-val="' +
        data.message_id +
        '" onclick="sendLike(this)"></i>' +
        "</div>" +
        "</a>" +
        "</div>";

      $(".messages-box").prepend(HTML);
    }
  });
}
