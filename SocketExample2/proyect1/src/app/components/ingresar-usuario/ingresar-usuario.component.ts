import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ingresar-usuario',
  templateUrl: './ingresar-usuario.component.html',
  styleUrls: ['./ingresar-usuario.component.css'] // Ajuste menor: styleUrls en lugar de styleUrl
})
export class IngresarUsuarioComponent {
  public username: string = '';
  
  public constructor(private authService: AuthService, private router: Router) {}

  public login() {
    if (this.username.trim()) {
      this.authService.login(this.username);
      console.log('Username saved:', this.username); // Log para verificar
      this.router.navigate(['/chatvirtual']);
    }
  }
}
