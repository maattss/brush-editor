import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrushTableComponent } from './brush-table/brush-table.component';
import { NavComponent } from './nav/nav.component';
import { BrushSettingsComponent } from './brush-settings/brush-settings.component';
import { BrushGraphComponent } from './brush-graph/brush-graph.component';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    AppComponent,
    BrushTableComponent,
    NavComponent,
    BrushSettingsComponent,
    BrushGraphComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
