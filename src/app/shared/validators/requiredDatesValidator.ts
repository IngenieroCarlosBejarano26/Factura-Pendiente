import { FormGroup, ValidationErrors, ValidatorFn, AbstractControl } from '@angular/forms';

export const requiredDatesValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const formGroup = group as FormGroup; 
  
  const fechaInicial = formGroup.get('fechaInicial');
  const fechaFinal = formGroup.get('fechaFinal');

  const fechaInicialHasValue = !!(fechaInicial?.value);
  const fechaFinalHasValue = !!(fechaFinal?.value);

  const isInvalid = (fechaInicialHasValue && !fechaFinalHasValue) || (!fechaInicialHasValue && fechaFinalHasValue);

  if (isInvalid) {
    return { 'requiredDates': true };
  }
  return null;
};