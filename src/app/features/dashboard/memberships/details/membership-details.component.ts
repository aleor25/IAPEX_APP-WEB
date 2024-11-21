import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule, ValidatorFn, AbstractControl, } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { MembershipService } from '../../../../core/services/membership.service';
import { Membership } from '../../../../core/models/membership.model';
import { InstitutionService } from '../../../../core/services/institution.service';
import { ToastService } from '../../../../core/services/util/toast.service';
import { dateRangeValidator } from '../../../../shared/validators/date-range.validator';

@Component({
  selector: 'app-membership-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './membership-details.component.html',
})
export class MembershipDetailsComponent {

  membership!: Membership;
  membershipForm: FormGroup;
  isFormModified = false;
  errorMessage: string = '';
  institutionNames: string[] = [];
  loading = false;

  private _router = inject(Router);
  private _activatedRoute = inject(ActivatedRoute);
  private _membershipsService = inject(MembershipService);
  private _institutionService = inject(InstitutionService);
  private _toastService = inject(ToastService);
  private _fb = inject(FormBuilder);

  constructor() {
    this.membershipForm = this._fb.group({
      institutionName: [{ value: '', disabled: true }, [Validators.required]],
      status: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', [Validators.required, dateRangeValidator()]],
    });

    this.membershipForm.valueChanges.subscribe(() => {
      this.isFormModified = this.membershipForm.dirty;
    });

    // Añadir validación de rango de fechas cuando cambia startDate
    this.membershipForm.get('startDate')?.valueChanges.subscribe(() => {
      const endDateControl = this.membershipForm.get('endDate');
      if (endDateControl) {
        endDateControl.updateValueAndValidity();
      }
    });
  }

  //Carga los detalles de la membresía y los nombres de las instituciones.
  ngOnInit(): void {
    const id = this._activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.loadMembership(+id);
    }
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

  //Carga los detalles de una membresía por su ID.
  loadMembership(id: number): void {
    this._membershipsService
      .getMembership(id)
      .pipe(
        catchError((error) => {
          console.error('Error al cargar los detalles de la membresía:', error);
          this.errorMessage = 'Error al cargar los detalles de la membresía';
          return of(null);
        })
      )
      .subscribe((membership: Membership | null) => {
        if (membership) {
          this.membership = membership;
          this.membershipForm.patchValue({
            institutionName: membership.institutionName,
            status: membership.status,
            startDate: new Date(membership.startDate).toISOString().split('T')[0],
            endDate: new Date(membership.endDate).toISOString().split('T')[0],
          });
        }
      });
  }

  updateMembership() {
    this.errorMessage = '';

    // Marcar todos los controles como tocados
    Object.values(this.membershipForm.controls).forEach(control => {
      control.markAsTouched();
    });

    if (this.membershipForm.valid) {
      const membership: Membership = {
        ...this.membership,
        ...this.membershipForm.value,
        startDate: new Date(this.membershipForm.value.startDate).toISOString(),
        endDate: new Date(this.membershipForm.value.endDate).toISOString(),
      };

      // Verificamos si existe un ID de membresía para la actualización
      if (this.membership.id) {
        this._membershipsService.updateMembership(this.membership.id, membership).subscribe({
          next: () => {
            this._toastService.showToast('Membresía actualizada', 'Los datos de la membresía se han actualizado correctamente.', 'success');
            this.isFormModified = false;
            this.errorMessage = "";
          },
          error: (error) => {
            console.error('Error al actualizar membresía:', error);
            this._toastService.showToast('Error al actualizar membresía', 'Ha ocurrido un error al actualizar los datos de la membresía.', 'error');
            this.errorMessage = 'Error al actualizar los datos de la membresía.';
          }
        });
      } else {
        this._toastService.showToast('Error', 'No se encontró la membresía para actualizar.', 'error');
        this.errorMessage = 'No se encontró la membresía para actualizar.';
      }
    } else {
      this.errorMessage = 'Por favor, complete todos los campos correctamente.';
    }
  }

  deleteMembership(id: number) {
    this._membershipsService.deleteMembership(id).subscribe(
      () => {
        console.log('Membresía desactivada con éxito');
        this._toastService.showToast('Membresía desactivada',
          'La membresía ha sido desactivada correctamente.',
          'success');
        this._router.navigate(['/dashboard/memberships']);
      },
      error => {
        console.error('Error al desactivada la membresía:', error);
        this._toastService.showToast('Error al desactivada la membresía',
          'Ha ocurrido un error al desactivada la membresía.',
          'error');
      }
    );
  }
}