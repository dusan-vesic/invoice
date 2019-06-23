import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SettingsComponent } from './settings/settings.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { ClientsComponent } from './clients/clients.component';

const routes: Routes = [
  {
    path: '', component: HomeComponent,
  },
  {
    path: 'settings', component: SettingsComponent
  },
  {
    path: 'invoice', component: InvoiceComponent
  },
  {
    path: 'clients', component: ClientsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
