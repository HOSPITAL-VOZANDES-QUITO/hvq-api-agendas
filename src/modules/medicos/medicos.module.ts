import { Module } from '@nestjs/common';
import { MedicosService } from './medicos.service';
import { MedicosController } from './medicos.controller';
import { ExternalAuthService } from './external-auth.service';

@Module({
  providers: [MedicosService, ExternalAuthService],
  controllers: [MedicosController],
  exports: [MedicosService],
})
export class MedicosModule {}
