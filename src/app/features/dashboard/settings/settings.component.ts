import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
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
}
