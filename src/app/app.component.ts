import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';


import { AboutPage } from '../pages/about/about';
import { OptimizerPage } from '../pages/optimizer/optimizer';
import { HomePage} from "../pages/home/home";
import { SworkerProvider} from "../providers/sworker/sworker";
import {environment} from "./environment";


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) navCtrl: Nav;
  rootPage:any = HomePage;
  version = environment.version;



  constructor(platform: Platform, public sw:SworkerProvider) {
    platform.ready().then(() => {

    });
    console.log(environment, environment.version);
    sw.register();

  }


  doRefresh() {
    this.sw.reload();
  }


  goToHome(params){
    if (!params) params = {};
    this.navCtrl.setRoot(HomePage);
  }
  goToOptimizer(params){
    if (!params) params = {};
    this.navCtrl.setRoot(OptimizerPage);
  }goToAbout(params){
    if (!params) params = {};
    this.navCtrl.setRoot(AboutPage);
  }
}
