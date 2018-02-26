import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';


import { AboutPage } from '../pages/about/about';
import { OptimizerPage } from '../pages/optimizer/optimizer';
import { HomePage} from "../pages/home/home";


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) navCtrl: Nav;
    rootPage:any = HomePage;

  constructor(platform: Platform) {
    platform.ready().then(() => {
    });
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
