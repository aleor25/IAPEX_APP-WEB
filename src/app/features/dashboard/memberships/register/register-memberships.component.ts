import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { tap, catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MembershipService } from '../../../../core/services/membership.service';
import { InstitutionService } from '../../../../core/services/institution.service';

@Component({
  selector: 'app-register-memberships',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule],
  templateUrl: './register-memberships.component.html'
})
export class RegisterMembershipsComponent {
  registerMemberships: FormGroup;
  errorMessage: string | null = null;
  loading = false;
  institutionNames: string[] = [];

  private _institutionService = inject(InstitutionService);
  private _membershipsService = inject(MembershipService);
  private _router = inject(Router);
  private _fb = inject(FormBuilder);

  constructor() {
    this.registerMemberships = this._fb.group({
      institutionName: ['', [Validators.required, Validators.maxLength(100)]],
      status: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadInstitutionNames();
  }

  private loadInstitutionNames(): void {
    this._institutionService.getAllInstitutionNames().subscribe({
      next: (names) => {
        this.institutionNames = names;
      },
      error: (err) => {
        console.error('Error al obtener los nombres de las instituciones:', err);
      },
    });
  }

  onSubmit(): void {
    if (this.registerMemberships.valid) {
      const formValue = this.registerMemberships.value;

      // Ajustar las fechas al formato adecuado
      formValue.startDate = new Date(formValue.startDate).toISOString();
      formValue.endDate = new Date(formValue.endDate).toISOString();

      console.log('Datos del formulario siendo enviados:', formValue);

      this.loading = true;

      this._membershipsService
        .addMembership(formValue)
        .pipe(
          tap((response) => {
            console.log('Respuesta del servidor:', response);
            this.errorMessage = null;
            this._router.navigate(['/dashboard/memberships']);
          }),
          catchError((error) => {
            console.error('Registro fallido', error);
            this.errorMessage =
              error.error?.message || 'Error al registrar los datos, La fecha de finalización debe ser posterior a la fecha de inicio.';
            return of(null);
          }),
          finalize(() => {
            this.loading = false;
            console.log('Envío del formulario finalizado.');
          })
        )
        .subscribe();
    } else {
      this.markFormGroupTouched(this.registerMemberships);
      this.errorMessage = 'Por favor, complete todos los campos requeridos.';
      console.log(
        'El formulario no es válido. Marcando todos los controles como tocados.'
      );
    }
  }

  // Método auxiliar para marcar todos los controles como tocados
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      console.log('Marcando control como tocado:', control);

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}