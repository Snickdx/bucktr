import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';


import { AboutPage } from '../pages/about/about';
import { OptimizerPage } from '../pages/optimizer/optimizer';



@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) navCtrl: Nav;
    rootPage:any = OptimizerPage;

  constructor(platform: Platform) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      // statusBar.styleDefault();
      // splashScreen.hide();
    });
  }
  goToOptimizer(params){
    if (!params) params = {};
    this.navCtrl.setRoot(OptimizerPage);
  }goToAbout(params){
    if (!params) params = {};
    this.navCtrl.setRoot(AboutPage);
  }
}
