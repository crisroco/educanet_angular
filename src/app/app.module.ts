import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { NgxSmartModalModule } from 'ngx-smart-modal';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { NgxLoadingModule } from 'ngx-loading';
import { ToastrModule } from 'ngx-toastr';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { SessionService } from './services/session.service';
import { LoginService } from './services/login.service';
import { HttpConfigInterceptor } from './services/httpconfig.interceptor';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
// import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { GtagModule } from 'angular-gtag';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    GtagModule.forRoot({ trackingId: 'UA-212281910-1', trackPageviews: false }),
    BrowserAnimationsModule,
    NgxLoadingModule.forRoot({}),
    ToastrModule.forRoot(),
    DeviceDetectorModule.forRoot(),
    NgxSmartModalModule.forRoot(),
    HttpClientModule,
    AppRoutingModule,
    MatMenuModule,
    MatRadioModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatRippleModule,
    // NgbModule
  ],
  providers: [
    SessionService,
    LoginService,
    { provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
