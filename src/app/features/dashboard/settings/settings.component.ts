import { Component } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider'; 
import { MatSlideToggleModule } from '@angular/material/slide-toggle';



@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [MatSliderModule, MatSlideToggleModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {

}
