/**
 * Structured logger for hierarchical coordination system
 */

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

interface LogEntry {
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  timestamp: Date;
  agentId?: string;
}

class Logger {
  private minLevel: LogLevel;

  constructor(minLevel: LogLevel = LogLevel.INFO) {
    this.minLevel = minLevel;
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
    return levels.indexOf(level) >= levels.indexOf(this.minLevel);
  }

  private log(entry: LogEntry): void {
    if (!this.shouldLog(entry.level)) return;

    const logData = {
      ...entry,
      timestamp: entry.timestamp.toISOString(),
    };

    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(JSON.stringify(logData));
        break;
      case LogLevel.INFO:
        console.info(JSON.stringify(logData));
        break;
      case LogLevel.WARN:
        console.warn(JSON.stringify(logData));
        break;
      case LogLevel.ERROR:
        console.error(JSON.stringify(logData));
        break;
    }
  }

  debug(message: string, context?: Record<string, unknown>): void {
    this.log({ level: LogLevel.DEBUG, message, context, timestamp: new Date() });
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.log({ level: LogLevel.INFO, message, context, timestamp: new Date() });
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.log({ level: LogLevel.WARN, message, context, timestamp: new Date() });
  }

  error(message: string, context?: Record<string, unknown>): void {
    this.log({ level: LogLevel.ERROR, message, context, timestamp: new Date() });
  }

  setMinLevel(level: LogLevel): void {
    this.minLevel = level;
  }
}

export const logger = new Logger(
  process.env.LOG_LEVEL as LogLevel || LogLevel.INFO
);
