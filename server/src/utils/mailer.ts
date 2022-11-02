import nodemailer from 'nodemailer';

export const sendMail = (to: string, subject: string, text: string) => {
	const transporter = nodemailer.createTransport({
		service: 'hotmail',
		auth: {
			user: 'matcha_web@hotmail.com',
			pass: 'Test!111'
		}
	});

	transporter.sendMail({ from: 'matcha_web@hotmail.com', to, subject, html: text }, (err, info) => {
		if (err) {
			console.error('Error: ', err);
			return err;
		} else {
			console.log(info);
			return true;
		}
	});
};
