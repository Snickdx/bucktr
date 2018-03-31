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
import { KfcPage} from "../pages/results/kfc/kfc";
import {ExpandableComponent} from "../components/expandable/expandable";
import {ShareComponent} from "../components/share/share";


import { MizerProvider } from '../providers/mizer/mizer';
import { SworkerProvider } from '../providers/sworker/sworker';
import {KfcOpPage} from "../pages/optimizer/kfc-op/kfc-op";



enableProdMode();
@NgModule({
  declarations: [
    MyApp,
    OptimizerPage,
    AboutPage,
    ResultsPage,
    HomePage,
    KfcPage,
    KfcOpPage,
    ExpandableComponent,
    ShareComponent
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
          name:'Results'
        },
        {
          component: KfcPage,
          name:'KfcResults',
          segment:'results/kfc/:chicken_count/:side_count/:drink_count/:popcorn_count/:sandwich_count',
          defaultHistory: [OptimizerPage]
        },
        {
          component: KfcOpPage,
          name:'KfcOptimizer'
        },
        {
          component: OptimizerPage,
          name:'optimizer/',
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
    HomePage,
    KfcPage,
    KfcOpPage,
    ExpandableComponent,
    ShareComponent
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    MizerProvider,
    HttpClientModule,
    SworkerProvider
  ]
})
export class AppModule {}
