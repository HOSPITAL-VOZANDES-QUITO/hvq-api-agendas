import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  initializeOracleClientIfNeeded,
  OracleClientMode,
} from './oracle.client';
import { DatabaseService } from './database.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const logger = new Logger('TypeORM');

        const mode = (configService.get<string>('DB_MODE') ||
          'thin') as OracleClientMode;
        const oracleClientLibDir = configService.get<string>(
          'ORACLE_CLIENT_LIB_DIR',
        );

        initializeOracleClientIfNeeded(logger, mode, oracleClientLibDir);

        const username = configService.get<string>('DB_USER');
        const password = configService.get<string>('DB_PASSWORD');
        const connectString = configService.get<string>('DB_CONNECT_STRING');

        const poolMin = Number(configService.get<string>('DB_POOL_MIN') ?? '2');
        const poolMax = Number(
          configService.get<string>('DB_POOL_MAX') ?? '10',
        );
        const poolIncrement = Number(
          configService.get<string>('DB_POOL_INCREMENT') ?? '1',
        );
        const poolTimeout = Number(
          configService.get<string>('DB_POOL_TIMEOUT') ?? '300',
        );

        const synchronize =
          (configService.get<string>('DB_SYNCHRONIZE') ?? 'false') === 'true';
        const logging =
          (configService.get<string>('DB_LOGGING') ?? 'false') === 'true';

        if (!username || !password || !connectString) {
          throw new Error(
            'Variables de entorno de DB faltantes: DB_USER, DB_PASSWORD o DB_CONNECT_STRING',
          );
        }

        const schema =
          configService.get<string>('DB_SCHEMA') ||
          configService.get<string>('EDITOR_CUSTOM_SCHEMA');

        return {
          type: 'oracle' as const,
          username,
          password,
          connectString,
          synchronize,
          logging,
          autoLoadEntities: true,
          schema: schema,
          extra: {
            poolMin,
            poolMax,
            poolIncrement,
            poolTimeout,
          },
        };
      },
    }),
  ],
  controllers: [],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
