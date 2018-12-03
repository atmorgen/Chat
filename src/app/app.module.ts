import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

//for firebase database
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { ChatWindowComponent } from './chat-window/chat-window.component';
import { LoginComponent } from './login/login.component';
import { GlobalJSONLibraryComponent } from './global-jsonlibrary/global-jsonlibrary.component';
import { UsersWindowComponent } from './chat-window/users-window/users-window.component';
import { IgnoreThisComponent } from './ignore-this/ignore-this.component';

@NgModule({
  declarations: [
    AppComponent,
    ChatWindowComponent,
    LoginComponent,
    GlobalJSONLibraryComponent,
    UsersWindowComponent,
    IgnoreThisComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
