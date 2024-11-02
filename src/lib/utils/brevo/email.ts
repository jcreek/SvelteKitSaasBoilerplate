import brevo from '@getbrevo/brevo';
import {
	VITE_BREVO_API_KEY,
	VITE_BREVO_SENDER_EMAIL,
	VITE_BREVO_SENDER_NAME
} from '$env/static/private';

const apiInstance = new brevo.TransactionalEmailsApi();
const apiKey = apiInstance.authentications['apiKey'];
if (!VITE_BREVO_API_KEY) {
  throw new Error('Brevo API key is not configured');
}
apiKey.apiKey = VITE_BREVO_API_KEY;

const sendEmail = async (subject: string, htmlContentString: string, toAddress: string) => {
	const sendSmtpEmail = new brevo.SendSmtpEmail();

	sendSmtpEmail.subject = subject;
	sendSmtpEmail.htmlContent = htmlContentString;
	sendSmtpEmail.sender = { name: VITE_BREVO_SENDER_NAME, email: VITE_BREVO_SENDER_EMAIL };
	sendSmtpEmail.to = [{ email: toAddress, name: toAddress }];
	sendSmtpEmail.replyTo = { email: VITE_BREVO_SENDER_EMAIL, name: VITE_BREVO_SENDER_NAME };

	apiInstance.sendTransacEmail(sendSmtpEmail).then(
		function (data) {
			console.log('API called successfully. Returned data: ' + JSON.stringify(data));
		},
		function (error) {
			console.error(error);
		}
	);
};

export { sendEmail };
