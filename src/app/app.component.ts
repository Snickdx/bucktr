import { Component, ViewChild } from '@angular/core';
import {Platform, Nav, ToastController} from 'ionic-angular';


import { AboutPage } from '../pages/about/about';
import { HomePage} from "../pages/home/home";
import { SworkerProvider} from "../providers/sworker/sworker";
import {environment} from "./environment";
import {RecentPage} from "../pages/recent/recent";
import {ConfigProvider} from "../providers/config/config";
import {KfcOpPage} from "../pages/optimizer/kfc/kfcOptimizer";
// import {GoogleAnalytics} from "@ionic-native/google-analytics";


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
  firstLaunch   = true;
  installed     = true;
  prompt        = undefined;


  constructor(platform: Platform, public sw:SworkerProvider, public config:ConfigProvider, public toastCtrl:ToastController) {
    platform.ready().then(() => {
      this.bootstrapSW()

    });
  }

  //service worker bootstrapping and configuring done here via registering events
  async bootstrapSW(){
    this.config.initConfig().then(config=>{
      this.outlet = config.selected;
      this.installed = config.installed;
      this.firstLaunch = config.firstLaunch;
      if(this.firstLaunch)this.config.mutateConfig("firstLaunch", false);
    });

    // this.sw.addAppInstalledListener(()=>{
    //   this.toastCtrl.create({
    //     message:"Thanks!",
    //     duration: 1000,
    //     position: 'bottom',
    //   }).present();
    //   this.config.setInstalled();
    // });
    //
    // this.sw.addAppInstalledListener(()=>{
    //   this.toastCtrl.create({
    //     message:'Menumizer is now available offline!',
    //     duration: 3000,
    //     position: 'bottom'
    //   }).present();
    // });

    this.sw.addBeforeInstallPromptListener(prompt=>{
      console.log("Prompt Deferred");
      this.prompt = prompt;
      this.installed = false;

    });

    this.sw.networkStateChanged(()=>{this.online = true}, ()=>{this.online = false});

    this.sw.register(
      reg=>{

        if(!this.firstLaunch){
          let toast = this.toastCtrl.create(
            {
              message: `New Version Available!`,
              position: 'bottom',
              showCloseButton: true,
              closeButtonText: "Update",
            }
          );

          toast.onDidDismiss(()=>{
            if(reg.waiting)reg.waiting.postMessage('skipWaiting');
            location.reload();
          });

          if(reg.waiting)toast.present();
        }
      }
    );
  }

  change(){
    this.config.changeRestaurant(this.outlet);
  }


  doRefresh() {
    location.reload(true);
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
