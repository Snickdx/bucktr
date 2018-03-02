import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';


import { AboutPage } from '../pages/about/about';
import { OptimizerPage } from '../pages/optimizer/optimizer';
import { HomePage} from "../pages/home/home";

interface custWindow extends Window{

}


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) navCtrl: Nav;
    rootPage:any = HomePage;
    refreshing;

  constructor(platform: Platform) {
    platform.ready().then(() => {
    });


    navigator.serviceWorker.addEventListener('controllerchange',
      ()=> {
        if (this.refreshing) return;
        this.refreshing = true;
        window.location.reload();
      }
    );

    navigator.serviceWorker.getRegistration().then(reg=>{
      this.listenForWaitingServiceWorker(reg, MyApp.promptUserToRefresh);
    });
  }



  static promptUserToRefresh(reg) {
    // this is just an example
    // don't use window.confirm in real life; it's terrible
    if (window.confirm("New version available! OK to refresh?")) {
      reg.waiting.postMessage('skipWaiting');
    }
  }


  doRefresh() {

    if('serviceWorker' in navigator){
      navigator.serviceWorker.getRegistration().then( function(reg){
        if(reg.installing !== undefined)
          reg.installing.skipWaiting().then(event=>console.log("Skipped Waiting", event));

        caches.keys().then(function(names) {
          for (let name of names)
            caches.delete(name);
        })
      })
    }
    location.reload(true);
  }

  listenForWaitingServiceWorker(reg, callback) {
    function awaitStateChange() {
      reg.installing.addEventListener('statechange', function() {
        if (this.state === 'installed') callback(reg);
      });
    }
    if (!reg) return;
    if (reg.waiting) return callback(reg);
    if (reg.installing) awaitStateChange();
    reg.addEventListener('updatefound', awaitStateChange);
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
