import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './settings.component.html'
})
export class SettingsComponent implements OnInit {

  settingsForm!: FormGroup;
  isFormModified: boolean = false;

  private _userWebService = inject(UserService);
  private _userService = inject(UserService);
  private _formBuilder = inject(FormBuilder);

  constructor() {
    this.settingsForm = this._formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      secondLastName: ['', [Validators.required, Validators.maxLength(50)]],
      position: ['', [Validators.required, Validators.maxLength(25)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]]
    });
  }

  ngOnInit() {
    this.loadUserData();

    this.settingsForm.valueChanges.subscribe(() => {
      this.isFormModified = this.settingsForm.dirty; // Activar botón si se modificó el formulario
    });
  }


  editProfile() {
    if (this.settingsForm.valid) {
      const id = this._userService.getUser()?.id;
      console.log('Usuario obtenido:', id); // <-- Asegúrate de que este usuario tiene un ID

      const formData = {
        name: this.settingsForm.get('name')?.value,
        lastName: this.settingsForm.get('lastName')?.value,
        secondLastName: this.settingsForm.get('secondLastName')?.value,
        position: this.settingsForm.get('position')?.value,
        email: this.settingsForm.get('email')?.value
      };

      // Llamar al servicio con el ID y los datos del formulario
      this._userWebService.updateUserWeb(id, formData).subscribe(
        response => {
          console.log('Usuario actualizado con éxito', response);
        },
        error => {
          console.error('Error al actualizar el usuario', error);
        }
      );
    }
  }

  private loadUserData(): void {
    const user = this._userService.getUser();
    if (user && user.email) {
      this.settingsForm.patchValue({
        name: user.name,
        lastName: user.lastName,
        secondLastName: user.secondLastName,
        position: user.position,
        email: user.email
      });
    } else {
      this._userWebService.getCurrentUser().subscribe(
        response => {
          this.settingsForm.patchValue({
            name: response.name,
            lastName: response.lastName,
            secondLastName: response.secondLastName,
            position: response.position,
            email: response.email
          });
        },
        error => {
          console.error('Error al obtener los datos del usuario', error);
        }
      );
    }
  }

  get name() {
    return this.settingsForm.get('name');
  }

  get lastName() {
    return this.settingsForm.get('lastName');
  }

  get secondLastName() {
    return this.settingsForm.get('secondLastName');
  }

  get position() {
    return this.settingsForm.get('position');
  }

  get email() {
    return this.settingsForm.get('email');
  }
}