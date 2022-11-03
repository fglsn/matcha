import nodemailer from 'nodemailer';

export const sendMail = (to: string, subject: string, text: string) => {
	const transporter = nodemailer.createTransport({
		service: 'hotmail',
		auth: {
			user: process.env.EMAIL,
			pass: process.env.PASSWORD
		}
	});

	transporter.sendMail({ from: process.env.EMAIL, to, subject, html: text }, (err, info) => {
		if (err) {
			console.error('Error: ', err);
			return err;
		} else {
			console.log(info);
			return true;
		}
	});
};
