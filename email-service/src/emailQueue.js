let emailQueue = [];

function enqueueEmail(email) {
  emailQueue.push(email);
}

function dequeueEmail() {
    console.log('queue:8')
    return emailQueue.shift();  // Removes and returns the first email in the queue
}

function peekEmailQueue() {
    console.log('queue:13')
    return emailQueue[0];  // Returns the first email in the queue without removing it
}

module.exports = { enqueueEmail, dequeueEmail, peekEmailQueue };