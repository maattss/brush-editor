// Modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ChartsModule } from 'ng2-charts';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Components
import { AppComponent } from './app.component';
import { BrushTableComponent } from './brush-table/brush-table.component';
import { NavComponent } from './nav/nav.component';
import { BrushSettingsComponent } from './brush-settings/brush-settings.component';
import { BrushGraphComponent } from './brush-graph/brush-graph.component';
import { BrushInfoComponent } from './brush-info/brush-info.component';
import { InfoMsgComponent } from './info-msg/info-msg.component';

// Services
import { CookieService } from 'ngx-cookie-service';
import { PagerService } from './_services/index';
import { ChooseFileRobotComponent } from './choose-file-robot/choose-file-robot.component';
import { BrushMapFormulaComponent } from './brush-map-formula/brush-map-formula.component';

@NgModule({
    declarations: [
        AppComponent,
        BrushTableComponent,
        NavComponent,
        BrushSettingsComponent,
        BrushGraphComponent,
        BrushInfoComponent,
        InfoMsgComponent,
        ChooseFileRobotComponent,
        BrushMapFormulaComponent,
    ],
    imports: [
        BrowserModule,
        ChartsModule,
        FormsModule,
        MatTooltipModule,
        BrowserAnimationsModule,
    ],
    providers: [CookieService, PagerService],
    bootstrap: [AppComponent],
})
export class AppModule {}
