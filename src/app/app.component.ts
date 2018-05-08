import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';


import { AboutPage } from '../pages/about/about';
import { HomePage} from "../pages/home/home";
import { SworkerProvider} from "../providers/sworker/sworker";
import {environment} from "./environment";
import {RecentPage} from "../pages/recent/recent";
import {ConfigProvider} from "../providers/config/config";
import {KfcOpPage} from "../pages/optimizer/kfc/kfcOptimizer";


@Component({
  templateUrl: 'app.html',
  providers:[ConfigProvider]
})
export class MyApp {
  @ViewChild(Nav) navCtrl: Nav;
  rootPage:any = HomePage;
  version = environment.version;
  outlet=undefined;

  constructor(platform: Platform, public sw:SworkerProvider, public config:ConfigProvider) {
    platform.ready().then(() => {

    });

    config.getSelectedRestaurant().then(res=>{

      this.outlet = res.selected;
    });


    //sw.register();

    // sw.networkStateChanged(event=>{
    //   this.online = true;
    //   console.log("App is online");
    // }, event=>{
    //   this.online = false;
    //   console.log("App is offline");
    // });
  }

  change(){
    this.config.changeRestaurant(this.outlet);
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
    switch(this.outlet){
      case "kfc": this.navCtrl.setRoot(KfcOpPage);
      break;
    }
  }
  goToAbout(params){
    if (!params) params = {};
    this.navCtrl.setRoot(AboutPage);
  }
  goToRecent(params){
    if(!params)params =  {};
    this.navCtrl.setRoot(RecentPage);
  }
}
