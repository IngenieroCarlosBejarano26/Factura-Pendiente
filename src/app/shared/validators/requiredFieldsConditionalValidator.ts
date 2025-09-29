import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const requiredFieldsConditionalValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const fechaInicial = control.get('fechaInicial')?.value;
  const fechaFinal = control.get('fechaFinal')?.value;
  const numeroGuia = control.get('numeroGuia')?.value;
  const numeroDocumento = control.get('numeroDocumento')?.value;

  const datesAreEmpty = !fechaInicial && !fechaFinal;

  if (datesAreEmpty) {
    const guiaIsFilled = numeroGuia && numeroGuia.trim() !== '';
    const documentoIsFilled = numeroDocumento && numeroDocumento.trim() !== '';

    if (!guiaIsFilled && !documentoIsFilled) {
      return { requiredFieldsConditional: true };
    }
  }

  return null;
};