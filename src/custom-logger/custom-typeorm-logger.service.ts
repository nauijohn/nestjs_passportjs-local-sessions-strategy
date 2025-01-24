import { Logger as TypeOrmLogger } from 'typeorm';

import { CustomLoggerService } from '../custom-logger/custom-logger.service';

export class CustomTypeOrmLogger implements TypeOrmLogger {
  constructor(private readonly logger: CustomLoggerService) {
    this.logger.parentClassName = '[TypeOrm]';
  }

  logQuery(query: string, parameters?: unknown[]) {
    this.logger.log(`${query.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim()}`);
    if (parameters) {
      this.logger.verbose(
        `Parameters: ${this.stringifyParameters(parameters)}`,
      );
    }
  }

  logQueryError(error: string, query: string, parameters?: unknown[]) {
    this.logger.error(
      `${query} -- Parameters: ${this.stringifyParameters(parameters)} -- ${error}`,
    );
  }

  logQuerySlow(time: number, query: string, parameters?: unknown[]) {
    this.logger.warn(
      `Time: ${time} -- Parameters: ${this.stringifyParameters(parameters)} -- ${query}`,
    );
  }

  logMigration(message: string) {
    this.logger.log(message);
  }

  logSchemaBuild(message: string) {
    this.logger.log('logSchemaBuild...');
    this.logger.log(message);
  }

  log(level: 'log' | 'info' | 'warn', message: string) {
    if (level === 'log') {
      return this.logger.log(message);
    }
    if (level === 'info') {
      return this.logger.log(message);
    }
    if (level === 'warn') {
      return this.logger.warn(message);
    }
  }

  private stringifyParameters(parameters?: unknown[]) {
    try {
      return JSON.stringify(parameters);
    } catch {
      return '';
    }
  }
}
