import { NgModule, ErrorHandler, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { HttpClientModule } from '@angular/common/http';

import { MyApp } from './app.component';
import { OptimizerPage } from '../pages/optimizer/optimizer';
import { AboutPage } from '../pages/about/about';
import { ResultsPage } from '../pages/results/results';
import { HomePage } from '../pages/home/home';

import { OptimizerProvider } from '../providers/optimizer/optimizer';
import { SworkerProvider } from '../providers/sworker/sworker';


enableProdMode();
@NgModule({
  declarations: [
    MyApp,
    OptimizerPage,
    AboutPage,
    ResultsPage,
    HomePage
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
          segment:'results/:outlet/:chicken_amount/:side_amount/:drink_amount/:popcorn_amount/:sandwich_amount',
          defaultHistory: [OptimizerPage]
        },
        {
          component: OptimizerPage,
          name:'Optimizer',
          segment:'optimize/:outlet'
        },
        {
          component: AboutPage,
          name:'About',
          segment:'about'
        },
        {
          component: HomePage,
          name:'Home',
          segment:''
        },
      ]
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    OptimizerPage,
    AboutPage,
    ResultsPage,
    HomePage
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    OptimizerProvider,
    HttpClientModule,
    SworkerProvider
  ]
})
export class AppModule {}
