import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {ToastController} from "ionic-angular";

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


  constructor(public http: HttpClient, public toastCtrl: ToastController) {
  }

  register(){
    window.addEventListener('load', ()=> {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('service-worker.js', {scope:"."})
          .then(reg => {
            this.registered = true;
            this.registration = reg;

            this.listenForWaitingServiceWorker(reg, ()=>{

              if(!this.toastShowing){
                let toast = this.toastCtrl.create({
                  message: 'New Update Available',
                  position: 'bottom',
                  showCloseButton: true,
                  closeButtonText: "Update"
                });
                this.toastShowing = true;
                toast.present();
                toast.onDidDismiss(()=>{
                  this.registration.postMessage('skipWaiting');
                  this.toastShowing = false;
                });
              }

            })
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

  getRegistration(){

    if(this.registration) return this.registration;
    console.error("No registration found");
    return undefined;

  }

  skipWaiting(){
    if(this.registration.installing !== undefined){
      console.log(this.registration.installing);
      // this.registration.installing.skipWaiting()
    }
  }

  clearCaches(){
    caches.keys().then(function(names) {
      for (let name of names)
        caches.delete(name);
    });
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


}
