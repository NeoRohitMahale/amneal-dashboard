import {NgModule} from '@angular/core';
import {Dashboard2Component} from './dashboard2/dashboard2.component';
import {Dashboard1Component} from './dashboard1/dashboard1.component';
import {RouterModule, Routes} from '@angular/router';


const routes: Routes = [
  {path: '', redirectTo: '/dashboard1', pathMatch: 'full'},
  {path: 'dashboard1', component: Dashboard1Component},
  {path: 'dashboard2', component: Dashboard2Component}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
