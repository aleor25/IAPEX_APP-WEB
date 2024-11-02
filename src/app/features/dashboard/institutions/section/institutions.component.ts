import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InstitutionsTableComponent } from '../../../../shared/tables/institutions-table/institutions-table.component';

@Component({
  selector: 'app-institutions',
  standalone: true,
  imports: [FormsModule, CommonModule, InstitutionsTableComponent, RouterLink],
  templateUrl: './institutions.component.html',
})
export class InstitutionsComponent {
  error: string | null = null;

  constructor(private router: Router) {}

  table: string[] = [];
}
