import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { HomeComponent } from './home/home.component';
import { VolltankenComponent } from './volltanken/volltanken.component';
import { SaufbaumComponent } from './saufbaum/saufbaum.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BusfahrerComponent } from './busfahrer/busfahrer.component';
import { ActivityComponent } from './activity/activity.component';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    VolltankenComponent,
    SaufbaumComponent,
    BusfahrerComponent,
    ActivityComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatFormFieldModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
