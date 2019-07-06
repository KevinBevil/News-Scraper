var mongoose = require("mongoose");

// Constructor for mongoose schema
var Schema = mongoose.Schema;

var NoteSchema = new Schema({
   title: String,
   body: String
});

var Note = mongoose.model("Note", NoteSchema);

module.exports = Note;