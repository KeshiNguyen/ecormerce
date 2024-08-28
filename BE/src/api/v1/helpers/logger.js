import { createLogger, format, transports } from 'winston';

export const logger = createLogger({
    format: format.combine(
        format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
        format.align(),
        format.printf(
            (i) => `${i.level}: ${[i.timestamp]}: ${i.message}`
        )
    ),
    transports: [
        new transports.File({
            filename: '../logs/info.log',
            level: 'info',
            format: format.combine(
                format.printf(
                    (i) => i.level === "info" ? `${i.level} : ${i.timestamp} : ${i.message}`: ""
                )
            )
        }),
        new transports.File({
            filename: '../logs/errors.log',
            level: 'error',
        }),
        new transports.Console()
    ]
})