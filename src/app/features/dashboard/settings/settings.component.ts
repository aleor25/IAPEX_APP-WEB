import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LoginService } from '../../../core/services/access/login/login.service';
import { UserWebService } from '../../../core/services/user-web.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit implements OnInit {
  textSize: string = '16px'; // Tamaño inicial del texto
  isBold: boolean = false; // Estado inicial del texto en negritas
  isLightOnDark: boolean = false; // Estado inicial de texto claro sobre fondo oscuro

  ngOnInit() {
    // Inicializar los estilos globales
    this.applyTextSize(this.textSize);
    this.applyTextBold(this.isBold);
    this.applyLightOnDark(this.isLightOnDark);
  }

  onTextSizeChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.textSize = `${input.value}px`;
    this.applyTextSize(this.textSize);
  }

  onTextBoldChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    this.isBold = checkbox.checked;
    this.applyTextBold(this.isBold);
  }

  onLightOnDarkChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    this.isLightOnDark = checkbox.checked;
    this.applyLightOnDark(this.isLightOnDark);
  }

  private applyTextSize(size: string) {
    document.documentElement.style.setProperty('--text-size', size);
  }

  private applyTextBold(isBold: boolean) {
    document.documentElement.style.setProperty('--font-weight', isBold ? 'bold' : 'normal');
  }

  private applyLightOnDark(isLightOnDark: boolean) {
    if (isLightOnDark) {
      document.documentElement.style.setProperty('--background-color', 'black');
      document.documentElement.style.setProperty('--text-color', 'white');
    } else {
      document.documentElement.style.setProperty('--background-color', 'white');
      document.documentElement.style.setProperty('--text-color', 'black');
    }
  }
  settingsForm: FormGroup;

  private _userWebService = inject(UserWebService);
  private _loginService = inject(LoginService);
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

  onSubmit() {
    // Handle form submission logic here
    console.log(this.settingsForm.value);
  }

  ngOnInit(): void {
    this.loadUserData();
  }

  private loadUserData(): void {
    const user = this._loginService.getUser();
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
