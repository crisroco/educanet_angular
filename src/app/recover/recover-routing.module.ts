import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecoverComponent } from './recover.component';
import { PasswordComponent } from './pages/password/password.component';

const routes: Routes = [
	{ 
		path: '', 
		component: RecoverComponent,
		children: [
			{
				path: '', 
				redirectTo: '/recuperar/contrasena',
				pathMatch: 'full'
			},
			{
				path: 'contrasena',
				component: PasswordComponent
			},
			{
				path: '**',
				redirectTo: '/recuperar/contrasena',
				pathMatch: 'full'
			}
		],
	},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecoverRoutingModule { }
