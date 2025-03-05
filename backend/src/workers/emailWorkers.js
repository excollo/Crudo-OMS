const { Queue, Worker } = require("bullmq");
const { sendEmail } = require("../utils/sendEmail");
const { redisConfig } = require("../config/config");

const emailQueue = new Queue("emailQueue", {
  connection: redisConfig,
});

/**
 * Processes email jobs from the queue
 */
const emailWorker = new Worker(
  "emailQueue",
  async (job) => {
    try {
      const { to, subject, text, html } = job.data;
      const success = await sendEmail(to, subject, text, html);

      if (!success) {
        throw new Error("Email sending failed");
      }
    } catch (error) {
      console.error("Email job processing error:", error);
      throw error; // Allows BullMQ to handle retries
    }
  },
  {
    connection: redisConfig,
    attempts: 3, // Retries failed jobs up to 3 times
    backoff: { type: "exponential", delay: 5000 }, // Retry with delay
    removeOnComplete: true, // Auto-cleanup successful jobs
    removeOnFail: 10, // Keep last 10 failed jobs for debugging
  }
);

/**
 * Adds an email job to the queue
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} text - Plain text content
 * @param {string} [html] - Optional HTML content
 */
const addEmailToQueue = (to, subject, text, html = null) => {
  emailQueue.add("sendEmail", { to, subject, text, html });
};

module.exports = {
  addEmailToQueue,
};
