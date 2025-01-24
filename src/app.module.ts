import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CustomLoggerModule } from './custom-logger/custom-logger.module';
import { CustomLoggerService } from './custom-logger/custom-logger.service';
import { CustomTypeOrmLogger } from './custom-logger/custom-typeorm-logger.service';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { RequestIdMiddleware } from './middlewares/request-id.middleware';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.dev'],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService, CustomLoggerService],
      useFactory: (
        configService: ConfigService,
        loggerService: CustomLoggerService,
      ) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: +configService.get<string>('DB_PORT')!,
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: ['dist/**/*.entity{.ts,.js}'],
        synchronize: true,
        autoLoadEntities: true,
        logging: 'all',
        logger: new CustomTypeOrmLogger(loggerService),
      }),
    }),
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
    CustomLoggerModule,
    UsersModule,
  ],
  providers: [
    {
      useClass: LoggingInterceptor,
      provide: APP_INTERCEPTOR,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
