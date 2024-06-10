import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StartChatComponent } from './components/start-chat/start-chat.component';
import { IngresarUsuarioComponent } from './components/ingresar-usuario/ingresar-usuario.component';
import { VirtualChatComponent } from './components/virtual-chat/virtual-chat.component';

const routes: Routes = [
  { path: '', redirectTo: 'Inicio', pathMatch: 'full' },
  { path: "Inicio", component: StartChatComponent },
  { path: "IngresarUsuario", component: IngresarUsuarioComponent },
  {path: "chatvirtual", component: VirtualChatComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
