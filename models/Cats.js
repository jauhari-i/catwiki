const mongoose = require('mongoose');

const catSchema = new mongoose.Schema({
  catId: { type: String, unique: true },
  search: { type: Number },
});

const Cats = mongoose.model('cat', catSchema);

module.exports = Cats;
