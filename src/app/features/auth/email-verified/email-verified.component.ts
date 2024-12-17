import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-email-verified',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './email-verified.component.html'
})
export class EmailVerifiedComponent {
  status: string | null = null;
  message: string | null = null;

  private _activatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    this._activatedRoute.queryParams.subscribe(params => {
      this.status = params['status'];
      this.message = params['message'];
    });
  }
}