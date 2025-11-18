const nodemailer = require("nodemailer");

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT || 587),
  auth: {
    user: process.env.SMTP_USER || "doghmoh@gmail.com",
    pass: process.env.SMTP_PASS || "xlzlbvblwcktbgos",
  },
});
// Read template once

// Replace placeholders {{var}} with actual values
function renderTemplate(template, variables) {
  let html = template;
  for (const key in variables) {
    const regex = new RegExp(`{{${key}}}`, "g");
    html = html.replace(regex, variables[key]);
  }
  return html;
}

// Generic sendEmail
async function sendEmail(to, subject, variables = {}, templateHTML) {
  const html = renderTemplate(templateHTML, variables);

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject,
    html,
  });
}

module.exports = { sendEmail };
