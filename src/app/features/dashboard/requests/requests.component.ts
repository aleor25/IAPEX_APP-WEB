import { NgFor } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RequestService } from '../../../core/services/requests/request.service';

@Component({
  selector: 'app-requests',
  standalone: true,
  imports: [NgFor],
  templateUrl: './requests.component.html',
  styleUrl: './requests.component.css'
})
export class RequestsComponent implements OnInit {

  requestsData: Request[] = []
  displayedRequests: Request[] = []

  private _router = inject(Router);
  private _requestService = inject(RequestService);

  constructor(private requestService: RequestService) { }

  ngOnInit(): void {
    this.requestsData = this.simulateGetRequests();
    this.displayedRequests = this.requestsData; // Asignar los datos simulados a displayedRequests
  }


  simulateGetRequests(): Request[] {
    return [
     
    ];
  }


}
