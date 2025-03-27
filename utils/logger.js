const winston = require('winston');

// Define log levels and format
const logger = winston.createLogger({
  levels: winston.config.syslog.levels,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    // Log to the console
    new winston.transports.Console({
      level: 'info', // Log only messages with level 'info' and above to the console
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    // Log to a file (optional)
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error'
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
      level: 'info'
    })
  ]
});

module.exports = logger;