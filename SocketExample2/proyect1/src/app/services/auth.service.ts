import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInStatus: boolean = false;
  private username: string = '';

  public login(username: string): void {
    this.isLoggedInStatus = true;
    this.username = username;
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('username', username);
    console.log('Login successful, username saved:', username); // Agrega un log para verificar
  }
  

  public logout(): void {
    this.isLoggedInStatus = false;
    this.username = '';
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
  }

  public isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  public getUsername(): string {
    return localStorage.getItem('username') || '';
  }
}
