import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {ToastController} from "ionic-angular";
import {environment} from "../../app/environment";

/*
  Generated class for the SworkerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SworkerProvider {

  refreshing;
  registration = null;
  registered = false;
  toastShowing = false;
  reopen  = localStorage.getItem("menumizer-started");
  online = true;


  constructor(public http: HttpClient, public toastCtrl: ToastController) {

  }


  register(){
    window.addEventListener('load', ()=> {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('service-worker.js', {scope:"/"})
          .then(reg => {
            this.registered = true;
            this.registration = reg;

            this.listenForWaitingServiceWorker(reg, reg=>{
              if(!this.toastShowing && reg.waiting && this.reopen){
                let toast = this.toastCtrl.create({
                  message: `New Update Available`,
                  position: 'bottom',
                  showCloseButton: true,
                  closeButtonText: "Update"
                });
                this.toastShowing = true;
                toast.present();
                toast.onDidDismiss(()=>{
                  if(reg.waiting)
                    reg.waiting.postMessage('skipWaiting');
                  this.toastShowing = false;
                });
              }
            });
            localStorage.setItem("menumizer-started", 'true')

          })
          .catch(err => console.log('Error', err));

        navigator.serviceWorker.addEventListener('controllerchange',
          () => {
            if (this.refreshing) return;
            this.refreshing = true;
            window.location.reload();
          }
        );


      }
    });
  }

  static getRegistration(){
    if('serviceWorker' in navigator)
      return navigator.serviceWorker.getRegistration();

  }

  async skipWaiting(){
    this.registration = await SworkerProvider.getRegistration();
    if(this.registration.installing){
      this.registration.skipWaiting();
    }
  }

  clearCaches(){
    caches.keys().then(function(names) {
      for (let name of names)
        caches.delete(name);
    });
  }

  reload(){
    this.toastShowing = true;
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

  getNetworkState(){
    return this.online;
  }

  monitorNetworkState(onlineHandler, offlineHandler){
    window.addEventListener('load', ()=>{
      console.log("state monitoring");
      window.addEventListener('online', event =>{
        console.log(navigator.onLine);
        if(navigator.onLine){
          this.online = true;
          onlineHandler(event);
        }
      });
      window.addEventListener('offline', event => {
        console.log(navigator.onLine);
        if(!navigator.onLine){
          this.online = false;
          offlineHandler(event)
        }
      });
    });
  }

}
