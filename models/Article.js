const mongoose = require("mongoose");

// Our schema constructor
const Schema = mongoose.Schema;

// The mongoose schema model for our articles saved in the database
const ArticleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  // This part stores our Note id
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});
// The mongoos .model method lets us create the name of the collection
// as well as the model to use
const Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;