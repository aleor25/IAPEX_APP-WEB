import { FormGroup } from "@angular/forms";

// Validador personalizado para la confirmación de contraseña
export function MustMatch(password: any, repeatPassword: any) {
    return (formGroup: FormGroup) => {
  
      const passwordControl = formGroup.controls[password];
      const repeatPasswordControl = formGroup.controls[repeatPassword];
  
      if (repeatPasswordControl.errors && !repeatPasswordControl.errors['mustMatch']) {
        return;
      }
  
      if (passwordControl.value !== repeatPasswordControl.value) {
        repeatPasswordControl.setErrors({ mustMatch: true });
      } else {
        repeatPasswordControl.setErrors(null);
      }
    };
  }