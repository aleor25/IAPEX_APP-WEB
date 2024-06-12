import { Component } from '@angular/core';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'general-view',
  standalone: true,
  imports: [SidebarComponent, NavbarComponent, RouterOutlet],
  templateUrl: './general-view.component.html',
  styleUrl: './general-view.component.css'
})
export class GeneralViewComponent {

}
