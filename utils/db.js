const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/bersamaMDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});


// // Membuat schema
// const Contact = mongoose.model('Contact', {
//   nama: {
//     type: String,
//     require: true
//   },
//   telepon: {
//     type: String,
//     require: true
//   },
//   email: {
//     type: String
//   }
// });


// // Menambahkan 1 data
// const contact1 = new Contact({
//   nama: 'Zein Kazama',
//   telepon: '0859-7989-7777',
//   email: 'zein.kazama@gmail.com'
// });

// // Simpan data contact baru ke collection
// contact1.save().then((contact) => console.log(contact));