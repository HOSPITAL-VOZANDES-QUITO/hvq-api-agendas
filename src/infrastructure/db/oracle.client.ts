import { Logger } from '@nestjs/common';
import * as oracledb from 'oracledb';

export type OracleClientMode = 'thin' | 'thick';

export function initializeOracleClientIfNeeded(
  logger: Logger,
  mode: OracleClientMode,
  libDir?: string,
): void {
  if (mode !== 'thick') {
    logger.log('Oracle driver running in THIN mode (default).');
    return;
  }

  try {
    if (!libDir || libDir.trim().length === 0) {
      throw new Error(
        'ORACLE_CLIENT_LIB_DIR no está configurado para modo THICK.',
      );
    }
    oracledb.initOracleClient({ libDir });
    logger.log('Cliente de Oracle inicializado en modo THICK.');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(`Error al inicializar Oracle Instant Client: ${errorMessage}`);
    throw error;
  }
}
