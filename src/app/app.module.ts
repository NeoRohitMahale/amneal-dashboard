import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {TestComponent} from './test/test.component';
import {AppRoutingModule} from './/app-routing.module';
import {Dashboard1Component} from './dashboard1/dashboard1.component';
import {Dashboard2Component} from './dashboard2/dashboard2.component';
import {FacilityService} from './services/facility.service';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {PackageComponent} from './package/package.component';
import {AreaService} from './services/area.service';
import {PackagingService} from './services/packaging.service';
import {ScreenService} from './services/screen.service';

@NgModule({
  declarations: [
    AppComponent,
    TestComponent,
    Dashboard1Component,
    Dashboard2Component,
    PackageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [FacilityService, AreaService, PackagingService, ScreenService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
