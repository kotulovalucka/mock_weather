import DailyRotateFile from 'npm:winston-daily-rotate-file';
import { join } from 'node:path';
import * as winston from 'npm:winston';
import { format, transports } from 'npm:winston';
import type { TransformableInfo } from '../../../../../Library/Caches/deno/npm/registry.npmjs.org/logform/2.6.1/index.d.ts';

const logDir = join(Deno.cwd(), 'logs');

// Custom levels configuration
const customLevels = {
	levels: {
		error: 0,
		warn: 1,
		info: 2,
		message: 3,
		debug: 4,
	},
	colors: {
		error: 'red',
		warn: 'yellow',
		info: 'green',
		message: 'cyan',
		debug: 'blue',
	},
};

// Create format combinations
const commonFormat = format.combine(
	format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
	format.errors({ stack: true }),
	format.splat(),
	format.json(),
);

const consoleFormat = format.combine(
	format.colorize({ all: true }),
	format.printf((
		{ timestamp, level, message, stack }: TransformableInfo,
	) =>
		stack ? `${timestamp} [${level}]: ${message}\n${stack}` : `${timestamp} [${level}]: ${message}`
	),
);

const errorFilter = format((info: TransformableInfo) => {
	return info.level === 'error' ? info : false;
});

const messageFilter = format((info: TransformableInfo) => {
	return info.level === 'message' ? info : false;
});

const debugFilter = format((info: TransformableInfo) => {
	return info.level === 'debug' ? info : false;
});

const customTransports = [
	// App log - contains all logs (info and above)
	new DailyRotateFile({
		dirname: join(logDir, 'app'),
		filename: 'app-%DATE%.log',
		datePattern: 'YYYY-MM-DD',
		maxFiles: '1d',
		maxSize: '20m',
		level: 'info',
		format: commonFormat,
		zippedArchive: true,
	}),

	// Error log - contains only errors
	new DailyRotateFile({
		dirname: join(logDir, 'error'),
		filename: 'error-%DATE%.log',
		datePattern: 'YYYY-MM-DD',
		maxFiles: '1d',
		maxSize: '20m',
		format: format.combine(
			errorFilter(),
			commonFormat,
		),
	}),

	// Message log - contains only messages ( requests, responses, etc.)
	new DailyRotateFile({
		dirname: join(logDir, 'message'),
		filename: 'message-%DATE%.log',
		datePattern: 'YYYY-MM-DD',
		maxFiles: '1d',
		maxSize: '20m',
		format: format.combine(
			messageFilter(),
			commonFormat,
		),
	}),

	// Debug log - contains only debug messages
	new DailyRotateFile({
		dirname: join(logDir, 'debug'),
		filename: 'debug-%DATE%.log',
		datePattern: 'YYYY-MM-DD-HH',
		maxFiles: '1h',
		maxSize: '10m',
		format: format.combine(
			debugFilter(),
			commonFormat,
		),
	}),

	// Console transport for info and above
	new transports.Console({
		level: 'info',
		format: consoleFormat,
	}),
];

export const LOG = winston.createLogger({
	levels: customLevels.levels,
	level: 'debug',
	transports: customTransports,
});

winston.addColors(customLevels.colors);

export default LOG;
