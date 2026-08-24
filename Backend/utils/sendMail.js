import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
const sendMail = async (to, subject, html) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error(
        "EMAIL_USER or EMAIL_PASS is missing in environment variables."
      );
    }
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    };
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("Email sending error:", error);
    throw error;
  }
};
export default sendMail;




































// import nodemailer from "nodemailer";

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });
// // EMAIL_USER=sushmitav9944@gmail.com
// // EMAIL_PASS=weufxvzvyiarnrtk
// const sendMail = async (to, subject, html) => {
//   try {
//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to,
//       subject,
//       html, 
//     };
//     const info = await transporter.sendMail(mailOptions);
//     console.log("Email sent successfully:", info.messageId);
//     return info;
//   } catch (error) {
//     console.error("Email sending error:", error);
//     throw error;
//   }
// };
// export default sendMail;











// import nodemailer from "nodemailer";
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });
// const sendMail = async (to, subject, html) => {
//   try {
//     const info = await transporter.sendMail({
//       from: `"HRMS Portal" <${process.env.EMAIL_USER}>`,
//       to,
//       subject,
//       html,
//     });
//     console.log("Email sent successfully:", info.messageId);
//     return info;
//   } catch (error) {
//     console.error("Email Error:", error);
//     throw error;
//   }
// };
// export default sendMail;




























// import nodemailer from "nodemailer";

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// const sendMail = async (to, subject, html) => {
//   try {
//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to,
//       subject,
//       html, // IMPORTANT: use html here
//     };

//     const info = await transporter.sendMail(mailOptions);

//     console.log("Email sent successfully:", info.messageId);

//     return info;
//   } catch (error) {
//     console.error("Email sending error:", error);
//     throw error;
//   }
// };

// export default sendMail;










































// import nodemailer from "nodemailer";
// //This code creates an SMTP email transporter using Gmail and sends emails like login credentials, passwords, or notifications.
// const sendMail = async ( to, subject, text, html) => {
//   try {
//     const transporter =
//       nodemailer.createTransport({
//         service: "gmail",
//         auth: {
//           user:
//             process.env.EMAIL_USER,
//           pass:
//             process.env.EMAIL_PASS,
//         },
//       });

//     await transporter.sendMail({
//       from:
//         process.env.EMAIL_USER,
//       to,
//       subject,
//       text,    
//       html,
//     });

//     console.log(
//       "Mail Sent Successfully"
//     );
//   } catch (error) {
//     console.log(
//       "Mail Error:",
//       error.message
//     );
//   }
// };

// export default sendMail;






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



















