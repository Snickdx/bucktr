import { NgModule, ErrorHandler, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import { HttpClientModule } from '@angular/common/http';




import { MyApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { ResultsPage } from '../pages/results/results';
import { HomePage } from '../pages/home/home';
import { KfcPage} from "../pages/results/kfc/kfcResults";
import {ExpandableComponent} from "../components/expandable/expandable";
import {ShareComponent} from "../components/share/share";


import { MizerProvider } from '../providers/mizer/mizer';
import { SworkerProvider } from '../providers/sworker/sworker';
import {KfcOpPage} from "../pages/optimizer/kfc/kfcOptimizer";
import {RecentPage} from "../pages/recent/recent";
import {IonicStorageModule} from "@ionic/storage";
import { ConfigProvider } from '../providers/config/config';

enableProdMode();
@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ResultsPage,
    HomePage,
    KfcPage,
    KfcOpPage,
    RecentPage,
    ExpandableComponent,
    ShareComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    CommonModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(MyApp,
      {
        mode:'md'
      },
      {
        links:[
          {
            component: ResultsPage,
            name:'Results'
          },
          {
            component: KfcPage,
            name:'KfcResults',
            segment:'results/kfc/:chicken_count/:side_count/:drink_count/:popcorn_count/:sandwich_count',
            defaultHistory: [KfcOpPage]
          },
          {
            component: KfcOpPage,
            name:'KfcOptimizer',
            segment:'kfcOptimizer'
          },
          {
            component: RecentPage,
            name:'RecentMizers',
            segment:'recent'
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
      }
    )
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ResultsPage,
    RecentPage,
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
    SworkerProvider,
    ConfigProvider
  ]
})
export class AppModule {}
