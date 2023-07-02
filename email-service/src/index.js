const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const { enqueueEmail, dequeueEmail, peekEmailQueue } = require('./emailQueue');

const app = express();


let transporter = nodemailer.createTransport({
  service: 'gmail', // use 'gmail' as an example, you can use other email service
  auth: {
    user: 'limonyassistant@gmail.com', // replace with your email
    //pass: 'LetsUseThisPa$$ForN0w', // replace with your password
    pass: 'ucgk utyo zgpa ahqa'
  }
});


// Server functionality

app.use(cors());
app.use(bodyParser.json());

app.listen(3002, () => {
  console.log('Email Service listening on port 3002');
});

app.post('/enqueue-email', (req, res) => {
  const email = req.body;
  enqueueEmail(email); // From the emailQueue.js
  res.json({ message: 'Email enqueued successfully.' });
});


app.post('/send-email', async (req, res) => {
    const { to, subject, text } = req.body;
  
    let mailOptions = {
      from: 'LimonyAssistant@gmail.com', // replace with your email
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
  









// Functions (separate them later)
// Configure your transporter

function sendNextEmail() {
  console.log('sendNextEmail is invoked....')
  const email = dequeueEmail();
  
  if (email) {
    console.log('email is found ', email);
    transporter.sendMail(email, (err, info) => {
      if (err) {
        console.error(`Failed to send email: ${err.message}`);
      } else {
        console.log(`Email sent: ${info.response}`);
      }
      
    });
  }


  // Call the function again after a delay, regardless of whether an email was sent
  setTimeout(sendNextEmail, 60000);  // Check for a new email every 5 seconds
}

// Start sending emails
sendNextEmail();







module.exports = app;
