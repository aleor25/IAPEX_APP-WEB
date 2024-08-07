import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})

export class SettingsComponent implements OnInit {
  settingsForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.settingsForm = this.fb.group({
      name: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      secondLastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.settingsForm.patchValue({
      name: user.name,
      lastName: user.lastName,
      secondLastName: user.secondLastName,
      email: user.email,
    });
  }
}
