import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-verified-email',
  standalone: true,
  templateUrl: './verified-email.component.html',
  styleUrls: ['./verified-email.component.css']
})
export class VerifiedEmailComponent implements AfterViewInit {

  ngAfterViewInit() {
    const inputs = document.querySelectorAll('.code-input') as NodeListOf<HTMLInputElement>;
    const submitBtn = document.getElementById('submitBtn');
    const errorMessage = document.getElementById('error-message');

    // Habilitar el primer input
    inputs[0].focus();

    inputs.forEach((input, index) => {
      input.addEventListener('input', () => {
        // Asegúrate de que solo se permita un dígito
        if (input.value.length > 1) {
          input.value = input.value.slice(0, 1); // Limita a un solo carácter
        }

        // Habilitar la siguiente casilla
        if (input.value.length > 0) {
          if (index < inputs.length - 1) {
            inputs[index + 1].disabled = false;
            inputs[index + 1].focus();
          }
        } else {
          // Permitir al usuario modificar el dígito actual
          if (index > 0) {
            inputs[index - 1].focus();
          }
        }
      });

      // Seleccionar el contenido al hacer clic en la casilla
      input.addEventListener('focus', () => {
        input.select();
      });

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace') {
          if (input.value.length === 0 && index > 0) {
            inputs[index - 1].focus();
          }
        }
      });
    });

    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        const code = Array.from(inputs).map(input => input.value).join('');
        if (code.length < 6) {
          errorMessage!.innerText = 'Por favor, ingrese los 6 dígitos del código de verificación enviados a tu correo.';
          // Limpia los inputs si hay un error
          inputs.forEach(input => {
            input.value = '';
            input.disabled = true; // Deshabilita los inputs
          });
          inputs[0].disabled = false; // Habilita el primer input
          inputs[0].focus(); // Regresa el foco al primer input
        } else {
          errorMessage!.innerText = ''; // Limpia el mensaje de error
        }
      });
    }
  }
}