import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IngresarUsuarioComponent } from './components/ingresar-usuario/ingresar-usuario.component';
import { VirtualChatComponent } from './components/virtual-chat/virtual-chat.component';
import { StartChatComponent } from './components/start-chat/start-chat.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    IngresarUsuarioComponent,
    VirtualChatComponent,
    StartChatComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
