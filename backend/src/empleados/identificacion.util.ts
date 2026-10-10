import { TipoIdentificacion } from './entities/empleado.entity';

// Quita espacios y guiones (cédula y DIMEX) o pasa a mayúsculas (pasaporte).
export function normalizarIdentificacion(
  tipo: TipoIdentificacion,
  valor: string,
): string {
  const limpio = valor.trim();
  if (tipo === TipoIdentificacion.PASAPORTE) {
    return limpio.replace(/\s+/g, '').toUpperCase();
  }
  return limpio.replace(/[\s-]/g, '');
}

// Devuelve un mensaje de error, o null si la identificación es válida.
export function validarIdentificacion(
  tipo: TipoIdentificacion,
  valorNormalizado: string,
): string | null {
  switch (tipo) {
    case TipoIdentificacion.CEDULA:
      return /^[1-9]\d{8}$/.test(valorNormalizado)
        ? null
        : 'La cédula debe tener 9 dígitos (ej. 1-2345-6789)';
    case TipoIdentificacion.DIMEX:
      return /^\d{11,12}$/.test(valorNormalizado)
        ? null
        : 'El DIMEX debe tener 11 o 12 dígitos';
    case TipoIdentificacion.PASAPORTE:
      return /^[A-Z0-9]{5,20}$/.test(valorNormalizado)
        ? null
        : 'El pasaporte debe tener entre 5 y 20 letras o números';
  }
}
