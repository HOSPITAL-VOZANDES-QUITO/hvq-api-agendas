import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseService {
  private readonly logger = new Logger(DatabaseService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
  ) {}

  async logStartupConnectionStatus(): Promise<void> {
    const mode = this.configService.get<string>('DB_MODE') ?? 'thin';
    this.logger.log(`Oracle driver mode: ${mode.toUpperCase()}`);

    // TypeORM inicializa el DataSource cuando Nest arranca el módulo
    const isInitialized: boolean = this.dataSource.isInitialized;
    if (isInitialized) {
      this.logger.log('Conexión TypeORM inicializada correctamente.');
      return;
    }

    // Como fallback, intentamos inicializar explícitamente si no lo estuviera
    try {
      await this.dataSource.initialize();
      this.logger.log(
        'Conexión TypeORM inicializada correctamente (lazy init).',
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Error inicializando la conexión TypeORM: ${message}`);
    }
  }
}
