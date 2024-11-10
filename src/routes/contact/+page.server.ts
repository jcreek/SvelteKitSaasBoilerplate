import type { Actions } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';
import { sendEmail } from '$lib/utils/brevo/email';
import { VITE_CONTACT_EMAIL } from '$env/static/private';
import logger from '$lib/utils/logger/logger';

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('name') as string;
		const email = formData.get('email') as string;
		const message = formData.get('message') as string;

		const emailContent = `
            <p>You have a new contact form submission:</p>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
        `;

		try {
			await sendEmail('New Contact Form Submission', emailContent, VITE_CONTACT_EMAIL);
			return { success: true };
		} catch (error) {
			logger.error('Failed to send email:', error);
			return fail(400, { error });
		}
	}
};
