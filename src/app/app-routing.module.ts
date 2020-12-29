import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ActivityComponent } from './activity/activity.component';
import { AuthGuardService } from './authguard/auth-guard.service';
import { BusfahrerComponent } from './busfahrer/busfahrer.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { SaufbaumComponent } from './saufbaum/saufbaum.component';
import { VolltankenComponent } from './volltanken/volltanken.component';

const routes: Routes = [
  {path: '', component: HomeComponent, canActivate:[AuthGuardService]},
  {path: '', component: LoginComponent},
  {path: 'login', component: LoginComponent},
  {path: 'logout', component: LogoutComponent, canActivate:[AuthGuardService]},
  {path: 'saufbaum', component: SaufbaumComponent, canActivate:[AuthGuardService]},
  {path: 'busfahrer', component: BusfahrerComponent, canActivate:[AuthGuardService]},
  {path: 'volltanken', component: VolltankenComponent, canActivate:[AuthGuardService]},
  {path: 'activity', component: ActivityComponent, canActivate:[AuthGuardService]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
