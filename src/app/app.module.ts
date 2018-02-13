import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { HttpClientModule } from '@angular/common/http';

import { MyApp } from './app.component';
import { OptimizerPage } from '../pages/optimizer/optimizer';
import { AboutPage } from '../pages/about/about';
import { ResultsPage } from '../pages/results/results';


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { OptimizerProvider } from '../providers/optimizer/optimizer';

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
    ReactiveFormsModule,
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
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    OptimizerProvider,
    HttpClientModule
  ]
})
export class AppModule {}
