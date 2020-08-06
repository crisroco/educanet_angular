import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecoverRoutingModule } from './recover-routing.module';
import { RecoverComponent } from './recover.component';
import { PasswordComponent } from './pages/password/password.component';

@NgModule({
  declarations: [RecoverComponent, PasswordComponent],
  imports: [
    CommonModule,
    RecoverRoutingModule
  ]
})
export class RecoverModule { }
