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
  registration;
  registered = false;


  constructor(public http: HttpClient, public toastCtrl: ToastController) {

    navigator.serviceWorker.addEventListener('controllerchange',
      ()=> {
        if (this.refreshing) return;
        this.refreshing = true;
        window.location.reload();
      }
    );

  }

  register(){
    window.addEventListener('load', ()=> {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('service-worker.js', {scope:"."})
          .then(reg => {
            this.registered = true;
            this.registration = reg;

            this.listenForWaitingServiceWorker(reg, ()=>{
              let toast = this.toastCtrl.create({
                message: 'New Update Available',
                position: 'bottom',
                showCloseButton: true,
                closeButtonText: "Update"
              });

              toast.present();

              toast.onDidDismiss(()=>{
                reg.waiting.postMessage('skipWaiting');
              });

            })
          })
          .catch(err => console.log('Error', err));

        navigator.serviceWorker.addEventListener('controllerchange', () => {
          if (this.refreshing) return;
          this.refreshing = true;
          window.location.reload();
          // this.toastCtrl.create({
          //   message: `App is updating`,
          //   duration: 3000
          // }).present().then(()=>{
          //
          // });

        });
      }
    });
  }


  doRefresh() {

    // if('serviceWorker' in navigator){
    //   navigator.serviceWorker.getRegistration().then( function(reg){
    //     if(reg.installing !== undefined)
    //       reg.installing.skipWaiting().then(event=>console.log("Skipped Waiting", event));
    //
    //     caches.keys().then(function(names) {
    //       for (let name of names)
    //         caches.delete(name);
    //     })
    //   })
    // }
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


}
