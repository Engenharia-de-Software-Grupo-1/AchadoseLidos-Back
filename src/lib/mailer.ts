import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const loadTemplate = (template: string, replacements?: Record<string, string>) => {
  let html = fs.readFileSync(`@src/templates/${template}`, 'utf8');
  if (replacements) {
    Object.keys(replacements).forEach(key => {
      html = html.replace(new RegExp(`{{${key}}}`, 'g'), replacements[key]);
    });
  }
  return html;
};

export const sendEmail = async (
  to: string,
  subject: string,
  template: string,
  replacements?: Record<string, string>,
) => {
  try {
    const html = loadTemplate(template, replacements);
    await transporter.sendMail({
      from: `Achados e Lidos <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error('Erro ao enviar e-mail: ', error);
  }
};
