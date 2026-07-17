import nodemailer from "nodemailer";
//This code creates an SMTP email transporter using Gmail and sends emails like login credentials, passwords, or notifications.
const sendMail = async ( to, subject, text, html) => {
  try {
    const transporter =
      nodemailer.createTransport({
        service: "gmail",
        auth: {
          user:
            process.env.EMAIL_USER,
          pass:
            process.env.EMAIL_PASS,
        },
      });

    await transporter.sendMail({
      from:
        process.env.EMAIL_USER,
      to,
      subject,
      text,    
      html,
    });

    console.log(
      "Mail Sent Successfully"
    );
  } catch (error) {
    console.log(
      "Mail Error:",
      error.message
    );
  }
};

export default sendMail;






// await sendMail(
//   employee.email,
//   "Leave Approved",
//   `
//   Your leave has been approved.

//   From: ${leave.fromDate}
//   To: ${leave.toDate}
//   `
// );

// await sendMail(
//   employee.email,
//   "Leave Rejected",
//   `
//   Your leave request was rejected.
//   `
// );

// export default sendMail;



















