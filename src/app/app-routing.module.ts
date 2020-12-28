import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ActivityComponent } from './activity/activity.component';
import { BusfahrerComponent } from './busfahrer/busfahrer.component';
import { HomeComponent } from './home/home.component';
import { SaufbaumComponent } from './saufbaum/saufbaum.component';
import { VolltankenComponent } from './volltanken/volltanken.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'saufbaum', component: SaufbaumComponent},
  {path: 'busfahrer', component: BusfahrerComponent},
  {path: 'volltanken', component: VolltankenComponent},
  {path: 'activity', component: ActivityComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
