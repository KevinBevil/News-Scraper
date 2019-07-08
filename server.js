var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

// var dbMongo = require("./config/keys").mongoURI;

// These will be used in our scraping
var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = process.env.PORT || 3000;

// Initialize express, which is used for our routing
var app = express();

// Using morgan for logging requests
app.use(logger("dev"));
// For parsing request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// 'public' needs to be a static folder
app.use(express.static("public"));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/unit18Populater";

mongoose.connect(MONGODB_URI);
// Routes =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

app.get("/", function(req, res) {
  res.json(path.join(__dirname, "public/index.html"));
});
// This route is for scraping the echoJS website
app.get("/scrape", function(req, res) {
  // ..grab body of html with axios
  axios.get("http://www.echojs.com/").then(function(response) {
    var $ = cheerio.load(response.data);

    $("article h2").each(function(i, element) {
      var result = {};

      result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");

      // This creates the new Article using the 'result' object being built in the scrape
      db.Article.create(result)
        .then(function(dbArticle) {
          console.log(dbArticle);
        })
        .catch(function(err) {
          console.log(err);
        });
    });

    //  Once complete, confirmation is sent to DOM
    res.send("Scrape Complete");
  });
});

// Route for retrieving all articles from the db
app.get("/articles", function(req, res) {
  db.Article.find({})
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.delete("/delete", function(req, res) {
  db.Article.deleteMany({})
    .then(function(data) {
      res.json(data)
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Route for getting a certain article by its id, and populating it with its note
app.get("/articles/:id", function(req, res) {
  db.Article.findOne({ _id: req.params.id })
    .populate("note")
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Route for saving and updated an article's associated note
app.post("/articles/:id", function(req, res) {
  // Create new note and pass req.body to entry
  db.Note.create(req.body)

    .then(function(dbNote) {
      // If successfull, find article with params.id, and update article
      // to be associated with new note
      return db.Article.findOneAndUpdate(
        { _id: req.params.id },
        { note: dbNote }
      );
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.delete("/articles/:id", function(req, res) {
  // Create new note and pass req.body to entry
  db.Note.create(req.body)

    .then(function(dbNote) {
      // If successfull, find article with params.id, and update article
      // to be associated with new note
      return db.Article.findOneAndUpdate(
        { _id: req.params.id },
        { note: dbNote }
      );
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
