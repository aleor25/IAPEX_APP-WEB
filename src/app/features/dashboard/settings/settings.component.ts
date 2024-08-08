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
export class SettingsComponent implements OnInit {

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
