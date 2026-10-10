import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { EmpleadosService } from './empleados.service';
import { CreateEmpleadoDto } from './dto/create-empleado.dto';
import { UpdateEmpleadoDto } from './dto/update-empleado.dto';
import { BajaEmpleadoDto } from './dto/baja-empleado.dto';

@Controller('empleados')
export class EmpleadosController {
  constructor(private readonly empleadosService: EmpleadosService) {}

  @Get()
  findAll() {
    return this.empleadosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.empleadosService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateEmpleadoDto) {
    return this.empleadosService.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateEmpleadoDto,
  ) {
    return this.empleadosService.update(id, dto);
  }

  @Post(':id/baja')
  @HttpCode(HttpStatus.OK)
  baja(@Param('id', ParseUUIDPipe) id: string, @Body() dto: BajaEmpleadoDto) {
    return this.empleadosService.baja(id, dto);
  }

  @Post(':id/reactivar')
  @HttpCode(HttpStatus.OK)
  reactivar(@Param('id', ParseUUIDPipe) id: string) {
    return this.empleadosService.reactivar(id);
  }
}
