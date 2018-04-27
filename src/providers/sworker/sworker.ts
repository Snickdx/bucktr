import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {ToastController} from "ionic-angular";

@Injectable()
export class SworkerProvider {

  refreshing;
  registration = null;
  registered = false;
  toastShowing = false;
  reopen  = localStorage.getItem("menumizer-started");
  online = true;

  constructor(public http: HttpClient, public toastCtrl: ToastController)
  {

  }

  public messageSW(message){
    return new Promise(function(resolve, reject) {
      var messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = function(event) {
        if (event.data.error) {
          reject(event.data.error);
        } else {
          resolve(event.data);
        }
      };
      // See https://html.spec.whatwg.org/multipage/workers.html#dom-worker-postmessage
      navigator.serviceWorker.controller.postMessage(message,
        [messageChannel.port2]);
    });
  }


  register()
  {
    window.addEventListener('load', ()=> {
      if ('serviceWorker' in navigator) {

        navigator.serviceWorker.register('service-worker.js', {scope:"./"})
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

                  if(reg.waiting)reg.waiting.postMessage('skipWaiting');
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

  static getRegistration()
  {
    if('serviceWorker' in navigator)
      return navigator.serviceWorker.getRegistration();

  }

  async skipWaiting()
  {
    this.registration = await SworkerProvider.getRegistration();
    if(this.registration.installing){
      this.registration.skipWaiting().then(e=>console.log("Waiting Skipped!"));
    }
  }

  reload()
  {
    this.toastShowing = true;
    location.reload(true);
  }

  listenForWaitingServiceWorker(reg, callback)
  {
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

  isOnline()
  {
    return this.online;
  }

  networkStateChanged(onlineHandler, offlineHandler)
  {
    window.addEventListener('load', ()=>{
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

  static async  getCachedData(name){
    if('caches' in self){

      const result = [];

      const cache = await caches.open(name);

      // Get a list of entries. Each item is a Request object
      for (const request of await cache.keys()) {
          result.push(await cache.match(request));
      }
      return result;
    }else{
      console.log("Caches not available");
      return [];
    }
  }

  static async isCached(url, cacheName)
  {
    if('caches' in self){
      let cache = await caches.open(cacheName);
      for (const request of await cache.keys()) {
        if(request.url === url)return true;
      }
    }else{
      console.log("Caches not available");
    }
    return false;
  }

}
