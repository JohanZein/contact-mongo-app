const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const { check, body, validationResult } = require('express-validator');
const methodOverride = require('method-override');

const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const req = require('express/lib/request');

require('./utils/db');
const Contact = require('./models/contact');

const app = express();
const port = 3000;

// Setup method-override
app.use(methodOverride('_method'));

// Gunakan EJS
app.set('view engine', 'ejs');

// Thrid-party middleware
app.use(expressLayouts);

//Build-in middleware untuk menampilkan file statis
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));


// Konfigurasi flash message
app.use(cookieParser('secret'));
app.use(
  session({
    cookie: { maxAge: 6000 },
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());



// Halaman Home
app.get('/', (req, res) => {
  // res.send('Hello World!');
  // res.sendFile('./index.html', { root: __dirname });
  const mahasiswa = [{
      nama: 'Johan Zein',
      email: 'zeins.syahputra@gmail.com'
    },
    {
      nama: 'Johan Zein',
      email: 'zeins.syahputra@gmail.com'
    },
    {
      nama: 'Johan Zein',
      email: 'zeins.syahputra@gmail.com'
    }
  ];
  res.render('index', {
    layout: 'layouts/main-layouts',
    nama: 'Johan Zein',
    title: 'Halaman Home',
    mahasiswa
  });
});


// Halaman About
app.get('/about', (req, res) => {
  res.render('about', {
    layout: 'layouts/main-layouts',
    title: 'Halaman About'
  });
});


// Halaman Contact
app.get('/contact', async (req, res) => {
  const contacts = await Contact.find();

  res.render('contact', {
    title: 'Halaman Contact',
    layout: 'layouts/main-layouts',
    contacts,
    msg: req.flash('msg')
  });
});


// Halaman form tambah contact
app.get('/contact/add', (req, res) => {
  // const contacts = loadContact();

  res.render('add-contact', {
    title: 'Form Tambah Data Contact',
    layout: 'layouts/main-layouts',
    // contacts
  });
});


// Proses tambah data contact
app.post(
  '/contact',
  [
    body('nama').custom(async (value) => {
      const duplikat = await Contact.findOne({nama: value});
      if (duplikat) {
        throw new Error('Nama contact sudah digunakan!');
      }
      return true;
    }),
    check('email', 'Email tidak valid').isEmail(),
    check('telepon', 'Nomor telepon tidak valid').isMobilePhone('id-ID')
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('add-contact', {
        title: 'Form Tambah Data Contact',
        layout: 'layouts/main-layouts',
        errors: errors.array()
      });
    } else {
      Contact.insertMany(req.body, (error, result) => {
        // Kirimkan flash message
        req.flash('msg', 'Data contact berhasil ditambahkan!');
        res.redirect('/contact');
      });
    }
  }
);


// Proses hapus data contact
app.delete('/contact', async (req, res) => {
  Contact.deleteOne({nama: req.body.nama}).then(() => {
    // Kirimkan flash message
    req.flash('msg', 'Data contact berhasil dihapus!');
    res.redirect('/contact');
  });
});


// Edit data contact
app.get('/contact/edit/:nama', async (req, res) => {
  const contact = await Contact.findOne({nama: req.params.nama});
  
  res.render('edit-contact', {
    title: 'Form Ubah Data Contact',
    layout: 'layouts/main-layouts',
    contact
  });
});


// Proses edit data contact
app.put(
  '/contact',
  [
    body('nama').custom( async (value, { req }) => {
      const duplikat = await Contact.findOne({nama: value});
      if (value !== req.body.oldNama && duplikat) {
        throw new Error('Nama contact sudah digunakan!');
      }
      return true;
    }),
    check('email', 'Email tidak valid').isEmail(),
    check('telepon', 'Nomor telepon tidak valid').isMobilePhone('id-ID')
  ],
  (req, res) => {
    const errors = validationResult(req);
    // return res.status(400).json({ errors: errors.array() });
    if (!errors.isEmpty()) {
      res.render('edit-contact', {
        title: 'Form Ubah Data Contact',
        layout: 'layouts/main-layouts',
        errors: errors.array(),
        contact: req.body
      });
    } else {
      Contact.updateOne(
        {_id: req.body._id},
        {
          $set: {
            nama: req.body.nama,
            telepon: req.body.telepon,
            email: req.body.email
          }
        }
      ).then((result) => {
        // Kirimkan flash message
        req.flash('msg', 'Data contact berhasil diubah!');
        res.redirect('/contact');
      });
    }
  }
);


// Halaman detail contact
app.get('/contact/:nama', async (req, res) => {
  const contact = await Contact.findOne({nama: req.params.nama});

  res.render('details', {
    title: 'Halaman Detail Contact',
    layout: 'layouts/main-layouts',
    contact
  });
});



app.listen(port, () => {
  console.log(`Contacts App | Listening at http://localhost:${port}`);
});