const Imap = require('imap');
const MailParser = require('mailparser').MailParser;

const imapConfig = {
  user: 'LimonyAssistant@gmail.com',
  password: 'ucgk utyo zgpa ahqa',
  host: 'imap.gmail.com',
  port: 993,
  tls: true,
};

const imap = new Imap(imapConfig);

function openInbox(cb) {
  imap.openBox('INBOX', true, cb);
}

imap.once('ready', function() {
  openInbox(function(err, box) {
    if (err) throw err;
    
    imap.search([ 'UNSEEN', ['SINCE', 'May 20, 2020'] ], function(err, results) {
      if (err) throw err;

      const fetch = imap.fetch(results, { bodies: '' });

      fetch.on('message', function(msg, seqno) {
        console.log('Message #%d', seqno);

        const mailparser = new MailParser();

        mailparser.on('headers', function(headers) {
          console.log('Header data: %s', headers);
        });

        mailparser.on('data', function(data) {
          if (data.type === 'text') {
            // Here you can access the email body
            console.log('Received data: %s', data.text);
          }
        });

        msg.on('body', function(stream, info) {
          stream.pipe(mailparser);
        });
      });

      fetch.once('end', function() {
        console.log('Done fetching all unseen emails!');
        imap.end();
      });
    });
  });
});

imap.once('error', function(err) {
  console.log(err);
});

imap.once('end', function() {
  console.log('Connection ended');
});

// Start the polling
imap.connect();
