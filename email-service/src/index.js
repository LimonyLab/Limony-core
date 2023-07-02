const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.listen(3002, () => {
  console.log('Email Service listening on port 3002');
});



app.post('/send-email', async (req, res) => {
    const { to, subject, text } = req.body;
  
    let transporter = nodemailer.createTransport({
      service: 'gmail', // use 'gmail' as an example, you can use other email service
      auth: {
        user: 'limonyassistant@gmail.com', // replace with your email
        //pass: 'LetsUseThisPa$$ForN0w', // replace with your password
        pass: 'ucgk utyo zgpa ahqa'
      }
    });
  
    let mailOptions = {
      from: 'limonyassistant@gmail.com', // replace with your email
      to: to,
      subject: subject,
      text: text
    };
  
    try {
      let info = await transporter.sendMail(mailOptions);
      res.json({ success: true, message: `Email sent to ${to}` });
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: 'Failed to send email' });
    }
  });
  


module.exports = app;
