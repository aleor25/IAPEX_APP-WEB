import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MembershipsTableComponent } from '../../../shared/tables/memberships-table/memberships-table.component';

@Component({
  selector: 'app-memberships',
  standalone: true,
  imports: [FormsModule, CommonModule, MembershipsTableComponent, RouterLink],
  templateUrl: './memberships.component.html'

})
export class MembershipsComponent {
  error: string | null = null;
  table: string[] = [];
}
