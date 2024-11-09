import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { GastosComponent } from './components/gastos/gastos.component';
import { ExtratoComponent } from './components/extrato/extrato.component';

export const routes: Routes = [
    { path: "", pathMatch:'full' ,component: HomeComponent },
    { path: "extrato", component: ExtratoComponent },
    { path: "gastos", component: GastosComponent  }
];
