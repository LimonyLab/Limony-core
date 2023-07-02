let emailQueue = [];

function enqueueEmail(email) {
  emailQueue.push(email);
}

function dequeueEmail() {
    return emailQueue.shift();  // Removes and returns the first email in the queue
}

function peekEmailQueue() {
    return emailQueue[0];  // Returns the first email in the queue without removing it
}

module.exports = { enqueueEmail, dequeueEmail, peekEmailQueue };