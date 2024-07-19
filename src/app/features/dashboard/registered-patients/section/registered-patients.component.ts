import { Component, OnInit, inject } from '@angular/core';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [NgFor],
  templateUrl: './registered-patients.component.html',
  styleUrls: ['./registered-patients.component.css']
})
export class RegisteredPatientsComponent {

  

}
