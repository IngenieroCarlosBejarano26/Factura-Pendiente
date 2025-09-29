import {
  AbstractControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

export const dateRangeValidator: ValidatorFn = (
  group: AbstractControl
): ValidationErrors | null => {
  const formGroup = group as FormGroup;
  const fechaInicial = formGroup.get('fechaInicial')?.value;
  const fechaFinal = formGroup.get('fechaFinal')?.value;

  if (fechaInicial && fechaFinal && fechaFinal <= fechaInicial) {
    return { dateRangeInvalid: true };
  }
  return null;
};
