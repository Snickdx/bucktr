import { NgModule, ErrorHandler, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { HttpClientModule } from '@angular/common/http';

import { MyApp } from './app.component';
import { OptimizerPage } from '../pages/optimizer/optimizer';
import { AboutPage } from '../pages/about/about';
import { ResultsPage } from '../pages/results/results';

import { OptimizerProvider } from '../providers/optimizer/optimizer';


enableProdMode();
@NgModule({
  declarations: [
    MyApp,
    OptimizerPage,
    AboutPage,
    ResultsPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    CommonModule,
    IonicModule.forRoot(MyApp, {}, {
      links:[
        {
          component: ResultsPage,
          name:'Results',
          segment:'results/:chicken_amount/:side_amount/:drink_amount',
          defaultHistory: [OptimizerPage]
        }
      ]
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    OptimizerPage,
    AboutPage,
    ResultsPage
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    OptimizerProvider,
    HttpClientModule
  ]
})
export class AppModule {}
