const Bull = require('Bull');
const {sendEmail} = require("../utils/sendEmail");

const emailQueue = new Bull("emailQueue");

emailQueue.process(async (job) => {
    const {to, subject, text} = job.data;
    await sendEmail(to, subject, text);
})

const addEmailToQueue = (to, subject, text) => {
    emailQueue.add({
        to, subject, text
    })
}

module.exports = {
    addEmailToQueue
}
