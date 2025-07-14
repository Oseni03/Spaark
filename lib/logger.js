import winston from "winston";

class Logger {
	static #instance;
	#logger;

	constructor() {
		this.#logger = winston.createLogger({
			level: process.env.LOG_LEVEL || "info",
			format: winston.format.combine(
				winston.format.timestamp(),
				winston.format.json()
			),
			transports: [
				new winston.transports.File({
					filename: "error.log",
					level: "error",
				}),
				new winston.transports.File({ filename: "combined.log" }),
			],
		});

		if (process.env.NODE_ENV !== "production") {
			this.#logger.add(
				new winston.transports.Console({
					format: winston.format.combine(
						winston.format.colorize(),
						winston.format.simple()
					),
				})
			);
		}
	}

	static getInstance() {
		if (!Logger.#instance) {
			Logger.#instance = new Logger();
		}
		return Logger.#instance;
	}

	info(message, meta) {
		this.#logger.info(message, meta);
	}

	error(message, meta) {
		this.#logger.error(message, meta);
	}

	warn(message, meta) {
		this.#logger.warn(message, meta);
	}

	debug(message, meta) {
		this.#logger.debug(message, meta);
	}
}

const logger = Logger.getInstance();
export default logger;
