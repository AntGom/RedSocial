import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, 
  port: process.env.SMTP_PORT, 
  secure: false, 
  auth: {
    user: process.env.SMTP_USER, 
    pass: process.env.SMTP_APIKEY, 
  },
});

export const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: `"MiApp" <${process.env.SMTP_USER}>`, 
      to, 
      subject, 
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Correo enviado exitosamente a ${to}`);
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    throw new Error("No se pudo enviar el correo.");
  }
};
