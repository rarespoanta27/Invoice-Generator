const express = require('express');
const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const MONGODB_URI = 'mongodb://localhost:27017/facturiDB';
const EMAIL_USER = 'rarespoanta10@gmail.com';
const EMAIL_PASS = 'owwx nxgi zfte ixak';
const JWT_SECRET = 'secretkey';

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.error('Could not connect to MongoDB:', error));

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  type: { type: String, required: true }, 
  name: { type: String, required: true }, 
  CUI: String, 
  billingAddress: { type: String, required: true },
  homeAddress: { type: String, required: true }, 
  phone: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

const invoiceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  invoiceNumber: { type: Number, required: true },
  details: { type: Object, required: true }
});
const Invoice = mongoose.model('Invoice', invoiceSchema);

let invoiceCounter = 1;

app.post('/register', async (req, res) => {
  const { email, password, confirmPassword, type, name, CUI, billingAddress, homeAddress, phone } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).send('Passwords do not match');
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      type,
      name,
      CUI: type === 'juridica' ? CUI : undefined,
      billingAddress,
      homeAddress,
      phone
    });

    await newUser.save();
    res.send('User registered');
  } catch (error) {
    res.status(500).send('Error registering user: ' + error.message);
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ id: user._id, type: user.type }, JWT_SECRET);
      res.json({ token });
    } else {
      res.status(401).send('Invalid credentials');
    }
  } catch (error) {
    res.status(500).send('Error logging in: ' + error.message);
  }
});

app.post('/generate-invoice', async (req, res) => {
  const { token, details } = req.body;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).send('User not found');
    }

    const newInvoice = new Invoice({ userId: decoded.id, invoiceNumber: invoiceCounter++, details });
    await newInvoice.save();

    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const logoPath = path.join(__dirname, 'solodev.png');
    doc.image(logoPath, 50, 45, { width: 50 });

    doc.fillColor('#0000FF')
      .fontSize(20)
      .text('Factura fiscala', 110, 57);
    doc.moveDown();

    doc.fillColor('black')
      .fontSize(12)
      .text(`Factura Nr.: ${newInvoice.invoiceNumber}`, 50, 150)
      .text(`Data: ${new Date().toLocaleDateString('ro-RO')}`, 50, 165)
      .text(`Comanda Nr.: ${newInvoice._id}`, 50, 180);

    doc.fontSize(12)
      .fillColor('#0000FF')
      .font('Helvetica-Bold')
      .text('Vanzator', 50, 200)
      .font('Helvetica')
      .fillColor('black')
      .text('Nume vanzator: N/A', 215)
      .text('CUI: N/A', 50, 230)
      .text('Nr. Reg: n/a', 50, 245)
      .text('locatie:n/a', 50, 260);

    doc.fillColor('#0000FF')
      .font('Helvetica-Bold')
      .text('Cumparator', 300, 200)
      .font('Helvetica')
      .fillColor('black');

    if (user.type === 'juridica') {
      doc.text(`Nume firma: ${user.name}`, 300, 215)
        .text(`CUI: ${user.CUI}`, 300, 230)
        .text(`Adresa facturare: ${user.billingAddress}`, 300, 245)
        .text(`Adresa livrare: ${user.homeAddress}`, 300, 260)
        .text(`Telefon: ${user.phone}`, 300, 275);
    } else {
      doc.text(`Nume cumparator:${user.name}`, 300, 215)
        .text(`Adresa livrare: ${user.homeAddress}`, 300, 230)
        .text(`Adresa facturare: ${user.billingAddress}`, 300, 245)
        .text(`Telefon: ${user.phone}`, 300, 260);
    }

    doc.moveDown();

    doc.fontSize(12)
      .fillColor('#0000FF')
      .font('Helvetica-Bold')
      .text('Produse', 50, 300, { underline: true })
      .font('Helvetica')
      .fillColor('black');
    
    const productTableTop = 320;
    doc.text('Denumire', 50, productTableTop)
      .text('Cantitate', 200, productTableTop, { width: 90, align: 'right' })
      .text('Pret unitar', 300, productTableTop, { width: 90, align: 'right' })
      .text('Pret total', 400, productTableTop, { width: 90, align: 'right' });
    
    const tableTop = 340;
    const itemTop = tableTop + 20;

    doc.fontSize(10);
    details.products.forEach((product, i) => {
      const y = itemTop + i * 25;
      const productPrice = parseFloat(product.price);
      const productQuantity = parseFloat(product.quantity);
      doc.text(product.name, 50, y)
        .text(productQuantity, 200, y, { width: 90, align: 'right' })
        .text(productPrice.toFixed(2) + ' lei', 300, y, { width: 90, align: 'right' })
        .text((productPrice * productQuantity).toFixed(2) + ' lei', 400, y, { width: 90, align: 'right' });
    });

    const subtotal = details.products.reduce((sum, product) => sum + parseFloat(product.price) * parseFloat(product.quantity), 0);
    const subtotalPosition = itemTop + details.products.length * 25;
    doc.text('Subtotal', 300, subtotalPosition)
      .text(subtotal.toFixed(2) + ' lei', 400, subtotalPosition, { width: 90, align: 'right' });

    const transport = parseFloat(details.transport);
    const transportPosition = subtotalPosition + 20;
    doc.text('Transport', 300, transportPosition)
      .text(transport.toFixed(2) + ' lei', 400, transportPosition, { width: 90, align: 'right' });

    const total = subtotal + transport;
    const totalPosition = transportPosition + 20;
    doc.font('Helvetica-Bold')
      .text('Total', 300, totalPosition)
      .text(total.toFixed(2) + ' lei', 400, totalPosition, { width: 90, align: 'right' });

    doc.moveDown(2);

    doc.fontSize(10)
      .font('Helvetica')
      .text(`Metoda plata: numerar la livrare`, 50, totalPosition + 40);

    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', async () => {
      const pdfData = Buffer.concat(buffers);

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: EMAIL_USER,
          pass: EMAIL_PASS
        }
      });

      const mailOptions = {
        from: EMAIL_USER,
        to: user.email,
        subject: 'Invoice',
        text: 'Please find attached your invoice.',
        attachments: [{ filename: 'invoice.pdf', content: pdfData }]
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return res.status(500).send('Error sending email: ' + error.message);
        }
        res.send('Invoice sent');
      });
    });

    doc.end();
  } catch (error) {
    res.status(500).send('Error generating invoice: ' + error.message);
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
