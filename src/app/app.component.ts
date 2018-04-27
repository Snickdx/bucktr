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
  online = true;


  constructor(platform: Platform, public sw:SworkerProvider) {
    platform.ready().then(() => {

    });

    sw.register();

    sw.networkStateChanged(event=>{
      this.online = true;
      console.log("App is online");
    }, event=>{
      this.online = false;
      console.log("App is offline");
    });
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
