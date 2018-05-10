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
  rootPage:any  = HomePage;
  version       = environment.version;
  online        = true;
  outlet        = undefined;
  installed     = undefined;
  firstLaunch   = undefined;
  prompt        = undefined;


  constructor(platform: Platform, public sw:SworkerProvider, public config:ConfigProvider) {
    platform.ready().then(() => {

      config.initConfig().then(config=>{
        this.outlet = config.selected;
        this.installed = config.installed;
        this.firstLaunch = config.firstLaunch;
      });

      sw.register(prompt=>{
        this.prompt = prompt;
        this.installed = false;
      });

      sw.networkStateChanged(
        _=>{this.online = true;},
        _=>{this.online = false;}
      );

    });
  }

  change(){
    this.config.changeRestaurant(this.outlet);
  }

  doRefresh() {
    this.sw.reload();
  }

  install(){
    try{
      this.prompt.prompt();
      this.prompt.userChoice.then(choice=>{
        console.log(choice.outcome);
        this.installed = true;//hides button regardless of outcome because prompt can only be called once until page reload
      })
    }catch(e){
      console.log(e);
    }

  }

  navTo(selectedPage){
    let pages = {
      "home":HomePage,
      "recent": RecentPage,
      "about":AboutPage,
      "optimizer":{
        "kfc":KfcOpPage
      }
    };
    if(selectedPage == "optimizer"){
      this.navCtrl.setRoot(pages["optimizer"][this.outlet])
    }else{
      this.navCtrl.setRoot(pages[selectedPage])
    }
  }


}
