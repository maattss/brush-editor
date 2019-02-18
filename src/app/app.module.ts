// Modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ChartsModule } from 'ng2-charts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Components
import { AppComponent } from './app.component';
import { BrushTableComponent } from './brush-table/brush-table.component';
import { NavComponent } from './nav/nav.component';
import { BrushSettingsComponent } from './brush-settings/brush-settings.component';
import { BrushGraphComponent } from './brush-graph/brush-graph.component';
import { BrushInfoComponent } from './brush-info/brush-info.component';

// Services
import { CookieService } from 'ngx-cookie-service';
import { PagerService } from './_services/index';

@NgModule({
  declarations: [
    AppComponent,
    BrushTableComponent,
    NavComponent,
    BrushSettingsComponent,
    BrushGraphComponent,
    BrushInfoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ChartsModule,
    FormsModule,
    ReactiveFormsModule,
    MatTooltipModule,
    BrowserAnimationsModule
  ],
  providers: [
    CookieService,
    PagerService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
