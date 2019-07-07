// This gets the articles as JSON
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the info on the page
    $("#articles").append(
      "<p data-id='" +
        data[i]._id +
        "' id='title'>" +
        data[i].title +
        "<br />" +
        "<a href=" +
        data[i].link +
        " target='_blank'>" +
        data[i].link +
        "</a>" +
        "</p>"
    );
  }
});

// P tag handler
$(document).on("click", "p", function() {
  $("#notes").empty();
  var thisId = $(this).attr("data-id");

  // The ajax call to get the note data from db
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  }).then(function(data) {
    console.log(data);
    $("#notes").append("<h6>" + data.title + "</h6>");
    $("#notes").append("<input id='titleinput' name='title' >");
    $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
    $("#notes").append(
      "<button data-id='" + data._id + "' id='savenote'>Save Note</button>"
    );
    $("#notes").append(
      "<button data-id='" + data._id + "' id='deletenote'>Delete Note</button>"
    );

    if (data.note) {
      $("#titleinput").val(data.note.title);
      $("#bodyinput").val(data.note.body);
    } else {
      $("#titleinput").val("");
      $("#bodyinput").val("");
    }
  });
});

$(document).on("click", "#scrape", function() {
  $.ajax({
    method: "GET",
    url: "/scrape"
  })
  .then(function() {
    window.location.reload();
  })
})
// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // ajax call to update the fields of the note document
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  }).then(function(data) {
    console.log(data);
    $("#notes").empty();
  });

  $("#titleinput").val("");
  $("#bodyinput").val("");
});
// Here we will save the note as empty strings upon delete
$(document).on("click", "#deletenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // ajax call to update the fields of the note document
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: "",
      // Value taken from note textarea
      body: ""
    }
  }).then(function(data) {
    console.log(data);
    $("#notes").empty();
  });

  $("#titleinput").val("");
  $("#bodyinput").val("");
});


