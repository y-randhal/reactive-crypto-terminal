import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { Home } from './pages/home/home';

export const routes: Routes = [
    {path:'', redirectTo: 'home', pathMatch: 'full'},
    {path:'home', component: Home},
    {path:'dashboard', component: Dashboard}
];
