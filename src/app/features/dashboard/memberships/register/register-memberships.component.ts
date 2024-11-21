import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { tap, catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MembershipService } from '../../../../core/services/membership.service';
import { InstitutionService } from '../../../../core/services/institution.service';
import { dateRangeValidator } from '../../../../shared/validators/date-range.validator';
import { ToastService } from '../../../../core/services/util/toast.service';

@Component({
  selector: 'app-register-memberships',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule],
  templateUrl: './register-memberships.component.html'
})
export class RegisterMembershipsComponent {

  membershipForm: FormGroup;
  errorMessage: string = "";
  institutionNames: string[] = [];
  loading = false;

  private _institutionService = inject(InstitutionService);
  private _membershipsService = inject(MembershipService);
  private _toastService = inject(ToastService);
  private _router = inject(Router);
  private _fb = inject(FormBuilder);

  constructor() {
    this.membershipForm = this._fb.group({
      institutionName: ['', [Validators.required]],
      status: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', [Validators.required, dateRangeValidator()]],
    });

    // Añadir validación de rango de fechas cuando cambia startDate
    this.membershipForm.get('startDate')?.valueChanges.subscribe(() => {
      const endDateControl = this.membershipForm.get('endDate');
      if (endDateControl) {
        endDateControl.updateValueAndValidity();
      }
    });
  }

  ngOnInit(): void {
    this.loadInstitutionNames();
  }

  //Carga los nombres de todas las instituciones.
  private loadInstitutionNames(): void {
    this._institutionService.getAllInstitutionNames().subscribe({
      next: (names) => {
        this.institutionNames = names;
      },
      error: (err) => {
        console.error(
          'Error al obtener los nombres de las instituciones:',
          err
        );
      },
    });
  }

  addMembership() {
    this.errorMessage = '';

    // Marcar todos los controles como tocados
    Object.values(this.membershipForm.controls).forEach(control => {
      control.markAsTouched();
    });

    if (this.membershipForm.valid) {
      const formValue = this.membershipForm.value;

      // Ajustar las fechas al formato adecuado
      formValue.startDate = new Date(formValue.startDate).toISOString();
      formValue.endDate = new Date(formValue.endDate).toISOString();

      this.loading = true;

      this._membershipsService
        .addMembership(formValue)
        .pipe(
          tap(() => {
            this._toastService.showToast('Membresía registrada', 'Los datos de la membresía se han registrado correctamente.', 'success');
            this._router.navigate(['/dashboard/memberships']);
            this.errorMessage = "";
          }),
          catchError((error) => {
            console.error('Registro fallido', error);
            this._toastService.showToast('Error al registrar la membresía', 'Ha ocurrido un error al registrar los datos de la membresía.', 'error');
            this.errorMessage = "Error al registrar la membresía.";
            return of(null);
          }),
          finalize(() => {
            this.loading = false;
            console.log('Envío del formulario finalizado.');
          })
        )
        .subscribe();
    } else {
      this.errorMessage = 'Por favor, complete todos los campos correctamente.';
    }
  }
}