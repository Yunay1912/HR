import { Transform } from 'class-transformer';
import {
  IsISO8601,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class BajaEmpleadoDto {
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'La fecha debe tener el formato AAAA-MM-DD',
  })
  @IsISO8601({ strict: true }, { message: 'La fecha de salida no es válida' })
  fechaSalida: string;

  @Transform(({ value }: { value: unknown }) => {
    if (typeof value !== 'string') return value;
    const texto = value.trim();
    return texto === '' ? null : texto;
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  motivoSalida?: string | null;
}
