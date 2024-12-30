import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, ModalComponent],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {
  currentSection: string = '';
  isRegisterPage: boolean = false;
  isDetailsPage: boolean = false;
  @ViewChild(ModalComponent) backModal!: ModalComponent;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.updateCurrentSection(this.router.url);
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateCurrentSection(this.router.url);
      });
  }

  private updateCurrentSection(url: string): void {
    this.isRegisterPage = url.endsWith('/register'); // Detecta cualquier URL que termine en "/register"
    this.isDetailsPage = url.includes('/details'); // Detecta cualquier URL que contenga "/details"
    const path = url.split('/').slice(2)[0]; // Obtiene la sección antes de "register"

    // console.log('path:', path);

    if (this.isRegisterPage) {
      // Cambia el título en la página de registro según la sección
      switch (path) {
        case 'patients':
          this.currentSection = 'Registrar un paciente';
          break;
        case 'institutions':
          this.currentSection = 'Registrar una institución';
          break;
        case 'memberships':
          this.currentSection = 'Registrar una membresía';
          break;
        default:
          this.currentSection = 'Datos estadisticos';
      }
    } else if (this.isDetailsPage) {
      // Cambia el título en la página de detalles según la sección
      switch (path) {
        case 'patients':
          this.currentSection = 'Detalles del paciente';
          break;
        case 'institutions':
          this.currentSection = 'Detalles de la institución';
          break;
        case 'contact-requests':
          this.currentSection = 'Detalles de la solicitud de contacto';
          break;
        case 'memberships':
          this.currentSection = 'Detalles de la membresía';
          break;
        default:
          this.currentSection = 'Datos estadisticos';
      }
    } else {
      // Cambia el título en las páginas principales
      switch (path) {
        case 'general-view':
          this.currentSection = 'Vista general';
          break;
        case 'patients':
          this.currentSection = 'Pacientes registrados';
          break;
        case 'institutions':
          this.currentSection = 'Instituciones registradas';
          break;
        case 'memberships':
          this.currentSection = 'Membresías activas';
          break;
        case 'contact-requests':
          this.currentSection = 'Solicitudes de contacto registradas';
          break;
        case 'notifications':
          this.currentSection = 'Notificaciones recibidas';
          break;
        default:
          this.currentSection = 'Datos estadisticos';
      }
    }
  }

  // Método para obtener el path de la sección según `currentSection`
  getRoutePath(): string {
    switch (this.currentSection) {
      case 'Pacientes registrados':
      case 'Registrar un paciente':
      case 'Detalles del paciente':
        return 'patients';
      case 'Instituciones registradas':
      case 'Registrar una institución':
      case 'Detalles de la institución':
        return 'institutions';
      case 'Membresías activas':
      case 'Registrar una membresía':
      case 'Detalles de la membresía':
        return 'memberships';
      case 'Solicitudes de contacto registradas':
      case 'Detalles de la solicitud de contacto':
        return 'contact-requests';
      default:
        return 'null';
    }
  }

  // Método para definir el texto del botón
  getButtonLabel(): string | null {
    if (this.isRegisterPage) {
      return ''; // Cambia el texto del botón a "Volver" en la página de registro
    }
    switch (this.currentSection) {
      case 'Pacientes registrados':
        return 'Registrar paciente';
      case 'Instituciones registradas':
        return 'Registrar institución';
      case 'Membresías activas':
        return 'Registrar membresía';
      default:
        return 'Datos estadisticos';
    }
  }

  openBackModal(): void {
    this.backModal.open();
  }

  handleConfirmation(): void {
    this.router.navigate([`/dashboard/${this.getRoutePath()}`]);
  }
}
