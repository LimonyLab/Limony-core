const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(), // Add timestamp to the logs
    winston.format.json() // Keep the original JSON format
  ),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({
      filename: 'info.log',
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(), // Add timestamp to the logs
        winston.format.json() // Keep the original JSON format
      ),
    }),
    new winston.transports.File({
      filename: 'error.log',
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp(), // Add timestamp to the logs
        winston.format.json() // Keep the original JSON format
      ),
    }),
    new winston.transports.File({
      filename: 'combined.log',
      format: winston.format.combine(
        winston.format.timestamp(), // Add timestamp to the logs
        winston.format.json() // Keep the original JSON format
      ),
    }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(), // Add colors for the console output
        winston.format.simple(), // Use a simple format for the console output
        winston.format.timestamp(), // Add timestamp to the logs
        winston.format.printf((info) => {
          // Customize the console output format
          const { timestamp, level, message, ...meta } = info;
          return `${timestamp} [${level}]: ${message} ${
            Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
          }`;
        })
      ),
    })
  );
}

module.exports = logger;
