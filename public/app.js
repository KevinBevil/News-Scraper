// JQuery get method to retrieve articles as JSON
$.getJSON("/articles", function(data) {
  for (let i = 0; i < data.length; i++) {
    // This displays our article info
    $("#articles").append(
      `<p data-id="${data[i]._id}">${data[i].title}<br />${data[i].link}</p>`
    );
  }
});

// When the user clicks a p tag
$(document).on("click", "p", function() {
  $("#notes").empty();
  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // Adding the note info
    .then(function(data) {
      console.log(data);
      $("#notes").append("<h2>" + data.title + "</h2>");
      $("#notes").append("<input id='titleinput' name='title' >");
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      $("#notes").append(
        "<button data-id='" + data._id + "' id='savenote'>Save Note</button>"
      );

      if (data.note) {
        $("titleinput").val(data.note.title);
        $("bodyinput").val(data.note.body);
      }
    });
});

$(document).on("click", "#savenote", function() {
  let thisId = $(this).attr("data-id");

  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
  .then(function(data) {
     console.log(data);
     $("#notes").empty();
  });

  // Clear the values that have been entered in the input
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
