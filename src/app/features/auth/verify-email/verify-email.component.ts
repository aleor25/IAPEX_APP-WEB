import { Component, ElementRef, inject, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './verify-email.component.html'
})
export class VerifyEmailComponent {

  verificationForm: FormGroup;
  email: string = '';
  allInputsFilled: boolean = false;

  private _fb = inject(FormBuilder);
  private _userService = inject(UserService);
  private _router = inject(Router);

  constructor() {
    this.verificationForm = this._fb.group({
      code: ['']
    });
    this.email = localStorage.getItem('email') || '';
  }

  @ViewChildren('codeInput') inputCodes!: QueryList<ElementRef<HTMLInputElement>>;

  onSubmit(): void {
    if (this.verificationForm.valid) {
      // Juntar los valores de los inputs en un solo string
      const code = this.inputCodes.map(input => input.nativeElement.value).join('');
      console.log('Código ingresado:', code);

      // Establecer el valor en el control del formulario
      this.verificationForm.patchValue({ code });

      if (this.verificationForm.get('code')?.value === code) {
        // Llamar al servicio para verificar el código
        this._userService.confirmUser(code).subscribe(
          response => {
            console.log('Código verificado correctamente', response);
            this._router.navigate(['/access/mail-verification']);
          },
          error => {
            console.error('Error al verificar el código', error);
          }
        );
      } else {
        console.error('El código ingresado no coincide con el formulario.');
      }
    } else {
      console.log('Formulario inválido');
      // Muestra detalles de las validaciones
      Object.keys(this.verificationForm.controls).forEach(field => {
        const control = this.verificationForm.get(field);
        console.log(`Campo ${field} - errores:`, control?.errors);
      });
    }
  }

  onInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/\D/, ''); // Solo permite números

    if (value.length === 1) {
      input.value = '';
      this.fillFromLeft(value);
      this.moveFocusToNextEmptyInput();
    } else {
      input.value = value;
    }

    // Verificar si todos los inputs están llenos
    this.checkIfAllInputsFilled();
  }

  checkIfAllInputsFilled(): void {
    const inputs = this.inputCodes.toArray();
    this.allInputsFilled = inputs.every(input => input.nativeElement.value.length > 0);
  }

  fillFromLeft(value: string): void {
    const inputs = this.inputCodes.toArray();
    for (let i = 0; i < inputs.length; i++) {
      const currentInput = inputs[i].nativeElement;
      if (currentInput.value === '') {
        currentInput.value = value;
        this.moveFocusToNextEmptyInput();
        return;
      }
    }
  }

  moveFocusToNextEmptyInput(): void {
    const inputs = this.inputCodes.toArray();
    for (let i = 0; i < inputs.length; i++) {
      const currentInput = inputs[i].nativeElement;
      if (currentInput.value === '') {
        currentInput.focus();
        return;
      }
    }
  }

  onKeyDown(event: KeyboardEvent, index: number): void {
    const input = event.target as HTMLInputElement;

    if (event.key === 'Backspace' && input.value.length === 0 && index > 0) {
      this.inputCodes.toArray()[index - 1].nativeElement.focus();
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      this.moveFocusToNextEmptyInput();
    }
  }

  resendCode(): void {
    console.log('Enviando código de verificación...');
    console.log('Correo electrónico:', this.email);

    this._userService.resendVerificationCode(this.email).subscribe(
      response => {
        console.log('Código reenviado', response);
      },
      error => {
        console.error('Error al reenviar el código', error);
      }
    );
  }
}