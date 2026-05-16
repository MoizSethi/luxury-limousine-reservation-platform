const Contact = require("./contact.model");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

exports.createContact = async (req, res) => {
  try {
    console.log("📩 Incoming Contact:", req.body);

    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and message are required",
      });
    }

    const contact = await Contact.create({
      name,
      email,
      phone: phone || null,
      subject: subject || null,
      message,
    });

    console.log("✅ Saved to DB");

    const emailSubject = subject
      ? `New Contact Message: ${subject}`
      : "New Contact Message";

    const html = `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#222">
        <h2 style="margin:0 0 12px">New Contact Form Submission</h2>

        <table cellspacing="0" cellpadding="0" style="border-collapse:collapse;width:100%;max-width:720px">
          <tr>
            <td style="padding:10px;border:1px solid #eee;background:#fafafa;width:180px"><b>Name</b></td>
            <td style="padding:10px;border:1px solid #eee">${escapeHtml(name)}</td>
          </tr>

          <tr>
            <td style="padding:10px;border:1px solid #eee;background:#fafafa"><b>Email</b></td>
            <td style="padding:10px;border:1px solid #eee">${escapeHtml(email)}</td>
          </tr>

          <tr>
            <td style="padding:10px;border:1px solid #eee;background:#fafafa"><b>Phone</b></td>
            <td style="padding:10px;border:1px solid #eee">${escapeHtml(phone || "—")}</td>
          </tr>

          <tr>
            <td style="padding:10px;border:1px solid #eee;background:#fafafa"><b>Subject</b></td>
            <td style="padding:10px;border:1px solid #eee">${escapeHtml(subject || "—")}</td>
          </tr>

          <tr>
            <td style="padding:10px;border:1px solid #eee;background:#fafafa"><b>Message</b></td>
            <td style="padding:10px;border:1px solid #eee;white-space:pre-line">${escapeHtml(message)}</td>
          </tr>
        </table>
      </div>
    `;

    await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: process.env.NOTIFY_EMAIL,
      replyTo: email,
      subject: emailSubject,
      text: `
Name: ${name}
Email: ${email}
Phone: ${phone || "-"}
Subject: ${subject || "-"}

Message:
${message}
      `,
      html,
    });

    console.log("📧 Email sent");

    return res.status(201).json({
      success: true,
      message: "Contact submitted successfully",
      contact,
    });
  } catch (error) {
    console.error("❌ Contact API Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};