const mongoose = require('mongoose');


// Membuat schema
const Contact = mongoose.model('Contact', {
  nama: {
    type: String,
    require: true
  },
  telepon: {
    type: String,
    require: true
  },
  email: {
    type: String
  }
});


module.exports = Contact;