import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Route, Router } from '@angular/router';
import { Observable, pipe, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private LOGIN_URL = 'http://localhost:3000/api/v1/auth/login';
  private tokenkEY = 'authToken';
  
  constructor(private httpClient: HttpClient,private router: Router){ }

  login(email: String, password: String): Observable<any>{
    return this.httpClient.post<any>(this.LOGIN_URL,{ email, password}).pipe(
      tap(response => {
        if(response.token){
          console.log(response.token);
          this.setToken(response.token);
        }
      })
    )
  }
  

  private setToken(token: string): void{
    localStorage.setItem(this.tokenkEY, token);
  }
  private getToken(): string | null {
    if(typeof window !== 'undefined'){
      return localStorage.getItem(this.tokenkEY);
    }else{
      return null;
    }
  }
  
  isAuthenticated(): boolean {
    const token = this.getToken();
    if(!token){
      return false;
    }

    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000;
    return Date.now() < exp;
  }

  logout(): void{
    localStorage.removeItem(this.tokenkEY);
    this.router.navigate(['/login']);
  }
}