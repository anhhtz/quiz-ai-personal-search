const { createLogger, format, transports } = require("winston");
require("winston-daily-rotate-file");
// const LogflareTransport = require('winston-logflare');
const { ElasticsearchTransport } = require("winston-elasticsearch");
const chalk = require("chalk");
const dayjs = require("dayjs");
import { SeqTransport } from "@datalust/winston-seq";

const APP_NODE_ID = process.env.APP_NODE_ID || "unknown";

const logColorizedFormatter = format.printf((info) => {
  const { timestamp, level, stack, message } = info;
  var logMessage = stack || message;

  var outputLog = `${timestamp} [${level}]: ${logMessage}`;

  switch (level.toUpperCase()) {
    case "INFO":
      outputLog = chalk.blueBright(outputLog);
      break;

    case "WARN":
      outputLog = chalk.yellowBright(outputLog);
      break;

    case "SUCCESS":
      outputLog = chalk.greenBright(outputLog);
      break;

    case "ERROR":
      outputLog = chalk.redBright(outputLog);
      break;

    default:
      break;
  }
  return outputLog;
  // return `{"timestamp": "${timestamp}", "level": "${colorizedLevel}", "message": "${errorMessage}"}`;
  // return `${timestamp} ${colorizedLevel}: ${logMessage}`;
});

const logFormatter = format.printf((info) => {
  const { timestamp, level, stack, message } = info;
  var logMessage = stack || message;

  var outputLog = `${timestamp} [${level}]: ${logMessage}`;

  return outputLog;
});

export const logger = createLogger({
  format: format.combine(
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    format.errors({ stack: true }),
    format.json()
  ),
  defaultMeta: { application: "Quiz.AI-Next", appNodeId: APP_NODE_ID },
  transports: [
    new transports.DailyRotateFile({
      level: "debug",
      filename: `logs/debug_%DATE%.log`,
      datePattern: "YYYY-MM-DD-HH",
      zippedArchive: true,
      format: logFormatter,
      // colorize: false,
      maxSize: "20m",
    }),
    new transports.File({
      level: "error",
      json: true,
      format: logFormatter,

      colorize: false,
      filename: `logs/error_${dayjs().format("YYYY-MM-DD-HH")}.log`,
      maxSize: "20m",
    }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: logColorizedFormatter,
      level: "verbose",
      colorize: true,
    })
  );
}

// production
if (process.env.NODE_ENV === "production") {
  logger.add(
    //Seq
    new SeqTransport({
      serverUrl: process.env.SEQ_URL,
      apiKey: process.env.SEQ_API_KEY,
      handleExceptions: true,
      handleRejections: true,
    }),
    //Logflare
    // new LogflareTransport({
    // 	apiKey: process.env.LOGFLARE_API_KEY,
    // 	source: process.env.LOGFLARE_SOURCE_ID,
    // 	level: 'debug',
    // 	format: logFormatter,
    // 	colorize: false,
    // 	maxSize: '20m',
    // }),
    //ElasticSearch
    new ElasticsearchTransport({
      level: "info",
      indexPrefix:
        process.env.NODE_ENV === "production"
          ? "quiz.ai-next"
          : "bankquiz-next-dev",
      indexSuffixPattern: "YYYY-MM",
      clientOpts: {
        node: process.env.ELASTICSEARCH_URL,
        retryLimit: 5,
        auth: {
          username: process.env.ELASTICSEARCH_USERNAME,
          password: process.env.ELASTICSEARCH_PASSWORD,
        },
      },
    })
  );
}

module.exports = {
  logger,
  // logToFile,
  // logToConsole,
};
