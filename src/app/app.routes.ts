import { Routes } from '@angular/router';
import { FacturaPendienteComponent } from './features/factura-pendiente/pages/factura-pendiente/factura-pendiente.component';

export const routes: Routes = [
  { path: 'factura-pendiente', component: FacturaPendienteComponent },
  { path: '', pathMatch: 'full', redirectTo: 'factura-pendiente' },
];
