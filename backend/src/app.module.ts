import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { DepartamentosModule } from './departamentos/departamentos.module';
import { EmpleadosModule } from './empleados/empleados.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: Number(config.get('DB_PORT', 5432)),
        username: config.get<string>('DB_USER', 'hr'),
        password: config.get<string>('DB_PASSWORD', 'yunaykelastuadev'),
        database: config.get<string>('DB_NAME', 'HR'),
        autoLoadEntities: true,
        // Solo para desarrollo: crea/actualiza las tablas automáticamente.
        synchronize: config.get<string>('DB_SYNCHRONIZE', 'true') === 'true',
      }),
    }),
    DepartamentosModule,
    EmpleadosModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
