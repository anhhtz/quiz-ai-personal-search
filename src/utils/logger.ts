import { SeqTransport } from '@datalust/winston-seq';
import chalk from 'chalk';
import dayjs from 'dayjs';
import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';

const APP_NODE_ID: string = process.env.APP_NODE_ID || 'unknown';
const APP_NAME = 'Quiz.AI-Next';

// System metadata
const systemMeta = {
    _meta: {
        application: APP_NAME,
        appNodeId: APP_NODE_ID,
        environment: process.env.NODE_ENV || 'development',
        timestamp: () => dayjs().format('YYYY-MM-DD HH:mm:ss')
    }
};

// Custom format to add file and function context
const addContext = format((info) => {
    // Get the file path and function name from the stack trace
    // const stack = new Error().stack;
    // if (stack) {
    //     const callerLine = stack.split('\n')[3]; // Skip Error, addContext, and logger call
    //     const match = callerLine.match(/at\s+(?:\w+\s+)?\(?(?:(?:file|http|https):\/\/)?([^:]+):(\d+):(\d+)\)?/);

    //     if (match) {
    //         const [, filePath, line, column] = match;
    //         info._context = {
    //             file: path.relative(process.cwd(), filePath),
    //             line: parseInt(line, 10),
    //             column: parseInt(column, 10)
    //         };
    //     }
    // }
    return info;
});

// Custom format to add request context
const addRequestContext = format((info) => {
    if (info.requestId || info.clientIP) {
        info._request = {
            requestId: info.requestId,
            clientIP: info.clientIP
        };
        // Remove the original fields to avoid duplication
        delete info.requestId;
        delete info.clientIP;
    }
    return info;
});

// JSON formatter for production
const jsonFormatter = format.combine(
    format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.errors({ stack: true }),
    addContext(),
    addRequestContext(),
    format.json()
);

// Colorized formatter for development
const colorizedFormatter = format.combine(
    format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.errors({ stack: true }),
    addContext(),
    addRequestContext(),
    format.printf((info) => {
        const { timestamp, level, message, _context, _request, _meta, stack, ...rest } = info;
        const logMessage = stack || message;

        // Build context string
        const contextStr = ''//_context ? `[${_context.file}:${_context.line}:${_context.column}]` : '';

        // Build metadata string
        const metaStr = Object.keys(rest).length ? ` ${JSON.stringify(rest)}` : '';

        let outputLog = `${timestamp} [${level}]${contextStr}: ${logMessage}${metaStr}`;

        switch (level.toUpperCase()) {
            case 'INFO':
                outputLog = chalk.blueBright(outputLog);
                break;
            case 'WARN':
                outputLog = chalk.yellowBright(outputLog);
                break;
            case 'SUCCESS':
                outputLog = chalk.greenBright(outputLog);
                break;
            case 'ERROR':
                outputLog = chalk.redBright(outputLog);
                break;
            default:
                break;
        }
        return outputLog;
    })
);

// Create the logger instance
export const logger = createLogger({
    defaultMeta: systemMeta,
    transports: [
        new transports.DailyRotateFile({
            level: 'debug',
            filename: `logs/debug_%DATE%.log`,
            datePattern: 'YYYY-MM-DD-HH',
            zippedArchive: true,
            format: jsonFormatter,
            maxSize: '20m',
            maxFiles: '14d'
        }),
        // Error log file
        new transports.File({
            level: 'error',
            filename: `logs/error_${dayjs().format('YYYY-MM-DD-HH')}.log`,
            format: jsonFormatter,
        }),
        //Logflare
        // new LogflareTransport({
        //     apiKey: process.env.LOGFLARE_API_KEY!,
        //     source: process.env.LOGFLARE_SOURCE_ID!,
        //     level: 'debug',
        //     format: colorizedFormatter || jsonFormatter,
        //     colorize: false,
        //     maxSize: '20m',
        // }),
    ],
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(
        new transports.Console({
            format: colorizedFormatter,
            level: 'verbose',
        }),
    );

    // logger.add(
    //     new SeqTransport({
    //         serverUrl: process.env.SEQ_URL!,
    //         onError: (e) => { console.error('Seq transport error:', e); },
    //         apiKey: process.env.SEQ_API_KEY!,
    //         handleExceptions: true,
    //         handleRejections: true,
    //     }),
    // )
}

// Add Seq transport for production
if (process.env.NODE_ENV === 'production') {
    // logger.add(
    //     new SeqTransport({
    //         serverUrl: process.env.SEQ_URL!,
    //         onError: (e) => { console.error('Seq transport error:', e); },
    //         apiKey: process.env.SEQ_API_KEY!,
    //         handleExceptions: true,
    //         handleRejections: true,
    //     }),

    // );
}

// Fluent Logger Interface
class FluentLogger {
    private logData: Record<string, any> = {};
    private logLevel: string;
    private loggerInstance: any;

    constructor(loggerInstance: any, level: string) {
        this.loggerInstance = loggerInstance;
        this.logLevel = level;
    }

    message(msg: string | Record<string, any>): FluentLogger {
        this.logData.message = typeof msg === 'string' ? msg : msg;
        return this;
    }

    data(data: string | Record<string, any>): FluentLogger {
        this.logData.data = typeof data === 'string' ? data : data;
        return this;
    }

    identify(identity: string | Record<string, any>): FluentLogger {
        this.logData.identity = typeof identity === 'string' ? identity : identity;
        return this;
    }

    service(service: string | Record<string, any>): FluentLogger {
        this.logData.service = typeof service === 'string' ? service : service;
        return this;
    }

    function(func: string | Record<string, any>): FluentLogger {
        this.logData.function = typeof func === 'string' ? func : func;
        return this;
    }

    trace(trace: string | Record<string, any>): FluentLogger {
        this.logData.trace = typeof trace === 'string' ? trace : trace;
        return this;
    }

    // Call this method to actually log the data
    log(): void {
        const { message, ...metadata } = this.logData;
        this.loggerInstance[this.logLevel](message || '', metadata);
    }
}

// Extend the logger with fluent interface
export const fluentLogger = {
    info(): FluentLogger {
        return new FluentLogger(logger, 'info');
    },
    error(): FluentLogger {
        return new FluentLogger(logger, 'error');
    },
    warn(): FluentLogger {
        return new FluentLogger(logger, 'warn');
    },
    debug(): FluentLogger {
        return new FluentLogger(logger, 'debug');
    },
    success(): FluentLogger {
        return new FluentLogger(logger, 'info'); // Using info level with success flag
    }
};

// Helper functions to add context to logs
export const createLoggerWithContext = (context: Record<string, any>) => {
    return {
        info: (message: string, meta?: any) => {
            logger.info(message, { _context: context, data: meta });
        },
        error: (message: string | Error, meta?: any) => {
            if (message instanceof Error) {
                logger.error(message.message, {
                    _context: context,
                    stack: message.stack,
                    data: meta
                });
            } else {
                logger.error(message, { _context: context, data: meta });
            }
        },
        warn: (message: string, meta?: any) => {
            logger.warn(message, { _context: context, data: meta });
        },
        debug: (message: string, meta?: any) => {
            logger.debug(message, { _context: context, data: meta });
        },
        success: (message: string, meta?: any) => {
            logger.info(message, { _context: context, level: 'success', data: meta });
        }
    };
};

export default logger;