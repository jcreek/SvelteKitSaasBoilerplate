import { createLogger, transports, format } from 'winston';
import { WinstonTransport as AxiomTransport } from '@axiomhq/winston';
import { VITE_AXIOM_DATASET, VITE_AXIOM_TOKEN } from '$env/static/private';

const axiomTransport = new AxiomTransport({
	dataset: VITE_AXIOM_DATASET,
	token: VITE_AXIOM_TOKEN
});

const logger = createLogger({
	level: 'info',
	defaultMeta: { service: 'example-site' }, // Change this so you can identify your website if you have multiple logging into Axiom
	format: format.combine(
		format.errors({ stack: true }), // Captures error stack traces
		format.timestamp(),
		format.json() // Formats logs as JSON for structured logging
	),
	transports: [
		new transports.Console({
			format: format.combine(
				format.colorize(),
				format.printf(({ timestamp, level, message, stack }) => {
					// Stack traces will be included in error messages automatically
					return `${timestamp} [${level.toUpperCase()}]: ${message}${stack ? `\n${stack}` : ''}`;
				})
			)
		}),
		axiomTransport
	],
	exceptionHandlers: [axiomTransport], // Logs uncaught exceptions
	rejectionHandlers: [axiomTransport] // Logs unhandled promise rejections
});

// Uncomment this for testing your initial logging setup
// logger.log({
// 	level: 'info',
// 	message: 'Logger successfully setup'
// });

export default logger;
