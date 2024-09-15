import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Patient } from '../../../../core/models/patients/patient.model';
import { HttpEventType } from '@angular/common/http';
import { PatientService } from '../../../../core/services/dashboard/patients/patient.service';

@Component({
  selector: 'app-update-patient-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './update-patient-detail.component.html',
  styleUrl: './update-patient-detail.component.css'
})
export class UpdatePatientDetailComponent implements OnInit {
  selectedPatient: Patient | null = null;
  patientForm: FormGroup;
  selectedFiles: File[] = [];

  genderOptions = ['Masculino', 'Femenino', 'Otro'];
  skinColorOptions = ['Clara', 'Media', 'Oscura'];
  eyeColorOptions = ['Negro', 'Café', 'Verde', 'Azul', 'Gris'];
  hairOptions = ['Liso', 'Ondulado', 'Rizado', 'Crespo', 'Calvo'];
  hairColorOptions = ['Negro', 'Castaño', 'Rubio', 'Rojo', 'Gris', 'Blanco'];
  hairLengthOptions = ['Corto', 'Medio', 'Largo'];
  complexionOptions = ['Delgada', 'Media', 'Atlética', 'Robusta'];
  statusOptions = [
    { value: true, label: 'Activo' },
    { value: false, label: 'Inactivo' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private patientService: PatientService,
    private formBuilder: FormBuilder
  ) {
    this.patientForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      secondLastName: ['', [Validators.required, Validators.maxLength(50)]],
      gender: ['', Validators.required],
      approximateAge: ['', [Validators.required, Validators.pattern(/^[0-9]*$/), Validators.min(0), Validators.max(150)]],
      approximateHeight: ['', [Validators.required, Validators.min(50), Validators.max(300)]],
      eyeColor: ['', Validators.required],
      skinColor: ['', Validators.required],
      hair: ['', Validators.required],
      complexion: ['', Validators.required],
      medicalConditions: ['', Validators.maxLength(255)],
      distinctiveFeatures: ['', Validators.maxLength(255)],
      additionalNotes: ['', Validators.maxLength(255)],
      active: [true]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadPatient(+id);
    }
  }

  loadPatient(id: number): void {
    this.patientService.getPatient(id).subscribe(
      (patient: Patient) => {
        this.selectedPatient = patient;
        this.patientForm.patchValue(patient);
      },
      (error) => {
        console.error('Error loading patient:', error);
      }
    );
  }

  /**
   * Metodo que se encarga de manejar el evento de seleccionar imagenes en el formulario de update de paciente.
   * Primero, se obtienen las imagenes seleccionadas y se convierten en un array de Files.
   * Luego, se verifica que el paciente tenga entre 8 y 12 imagenes en total (las imagenes actuales + las seleccionadas).
   * Si no cumple con las condiciones, se muestra un mensaje de error y no se actualiza la informacion.
   */
  onFileSelected(event: any): void {
    const files = event.target.files as FileList;
    this.selectedFiles = Array.from(files);
    
    const totalImages = (this.selectedPatient?.images?.length || 0) + this.selectedFiles.length;
    if (totalImages < 8 || totalImages > 12) {
      alert(`Debe proporcionar entre 8 y 12 imágenes en total. Actualmente tiene ${totalImages} imágenes.`);
    }
  }

  /**
   * Actualiza la informacion del paciente.
   * Primero verifica que haya un paciente seleccionado.
   * Segundo, verifica que el paciente tenga entre 8 y 12 imagenes.
   * Si no cumple con las condiciones, muestra un mensaje de error y no actualiza la informacion.
   * Si cumple con las condiciones, crea un objeto FormData con la informacion del paciente y sus imagenes.
   * Luego, llama al metodo updatePatient del servicio de pacientes y pasa el objeto FormData como parametro.
   * Si el servidor devuelve un error, muestra un mensaje de error y no actualiza la informacion.
   * Si el servidor devuelve una respuesta exitosa, muestra un mensaje de exito y redirige al usuario a la pagina de pacientes.
   */
  async onSubmit(): Promise<void> {
    if (!this.selectedPatient) {
      console.log('No hay paciente seleccionado');
      return;
    }
    const totalImages = (this.selectedPatient.images.length || 0) + this.selectedFiles.length;
    if (totalImages < 8 || totalImages > 12) {
      alert(`Debe proporcionar entre 8 y 12 imágenes en total. Actualmente tiene ${totalImages} imágenes.`);
      return;
    }
    const formData = await this.createFormDataAsync();
    this.patientService.updatePatient(this.selectedPatient.id, formData).subscribe(
      (event) => {
        // Si el servidor devuelve un evento de progreso, muestra un mensaje con el progreso.
        if (event.type === HttpEventType.UploadProgress) {
          console.log(`Progreso: ${event.loaded} / ${event.total}`);
        } else if (event.type === HttpEventType.Response) {
          // Si el servidor devuelve una respuesta exitosa, muestra un mensaje de exito y redirige al usuario a la pagina de pacientes.
          console.log('Paciente actualizado con éxito', event.body);
          this.router.navigate(['/dashboard/patients']);
        }
      },
      (error) => {
        // Si el servidor devuelve un error, muestra un mensaje de error y no actualiza la informacion.
        console.error('Error actualizando paciente', error);
        this.handleUpdateError(error);
      }
    );
  }
  
  /**
   * Primero se crea un objeto FormData con la informacion del paciente y sus imagenes.
   * Segundo, se agrega los campos del formulario.
   * Tercero, se agrega las imagenes existentes del paciente como archivos en el objeto FormData.
   * Luegp, agrega las imagenes seleccionadas por el usuario como archivos en el objeto FormData.
   * Retorna Un objeto FormData con la informacion del paciente y sus imagenes.
   */
  async createFormDataAsync(): Promise<FormData> {
    const formData = new FormData();
  
    // Agrega los campos del formulario como clave-valor en el objeto FormData.
    Object.keys(this.patientForm.controls).forEach((key) => {
      const value = this.patientForm.get(key)!.value;
      if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });
  
    // Agrega las imagenes existentes del paciente como archivos en el objeto FormData.
    const existingImagePromises = this.selectedPatient?.images.map(async (image, index) => {
      if (image.imageUrl) {
        const response = await fetch(image.imageUrl);
        const blob = await response.blob();
        const file = new File([blob], image.image, { type: 'image/jpeg' });
        formData.append('imageFile', file);
      }
    }) || [];
  
    // Espera a que todas las promesas se completen.
    await Promise.all(existingImagePromises);
  
    // Agrega las imagenes seleccionadas por el usuario como archivos en el objeto FormData.
    this.selectedFiles.forEach((file) => {
      formData.append('imageFile', file);
    });
  
    return formData;
  }

  cancelEdit(): void {
    this.router.navigate(['/dashboard/patients']);
  }
  
  /*Maneja el error que se produce al intentar actualizar un paciente.*/
  private handleUpdateError(error: { error: { [key: string]: string } }): void {
    // Si el error tiene un objeto con la informacion del error,
    // muestra cada uno de los errores en una alerta.
    if (error.error && typeof error.error === 'object') {
      Object.keys(error.error).forEach(key => {
        alert(`Error: ${error.error[key]}`);
      });
    } else {
      // Si no hay informacion adicional, muestra un mensaje genérico.
      alert('Ocurrió un error al actualizar el paciente. Por favor, inténtelo de nuevo.');
    }
  }
}

