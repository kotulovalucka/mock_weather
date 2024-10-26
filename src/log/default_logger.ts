import { createLogger, format, transports } from 'npm:winston';
import DailyRotateFile from 'npm:winston-daily-rotate-file';
import { join } from 'node:path';

const logDir = join(Deno.cwd(), 'logs');

export const LOG = createLogger({
	level: 'info',
	format: format.combine(
        format.colorize(),
		format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
		format.printf(
			({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`,
		),
	),
	transports: [
		new transports.Console(),

		new DailyRotateFile({
			filename: `${logDir}/requests-%DATE%.log`,
			datePattern: 'YYYY-MM-DD',
			maxFiles: '1d',
			level: 'info',
		}),
	],
});



export default LOG;
