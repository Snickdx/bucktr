import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {ToastController} from "ionic-angular";
import {ConfigProvider} from "../config/config";
import {environment} from "../../app/environment";

@Injectable()
export class SworkerProvider {

  refreshing;
  registration = null;
  registered = false;
  toastShowing = false;
  reopen  = undefined;
  online = true;
  deferredPrompt;

  //hadda refactor to remove dependencies some time
  constructor(public http: HttpClient, public toastCtrl: ToastController, public config:ConfigProvider)
  {
    config.initConfig().then(config=>{
      this.reopen = !config.firstLaunch;
    });
  }

  public messageSW(message)
  {
    return new Promise(function(resolve, reject) {
      let messageChannel = new MessageChannel();
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

  public showToast({onDismiss, ...options}, cb){
    let toast = this.toastCtrl.create(options);
    let promise = toast.present();
    if(onDismiss)toast.onDidDismiss(onDismiss);
    if(cb) promise.then(cb);
  }


  handleInstall(){
    window.addEventListener('appinstalled', (evt) => {
      //log when installed
      this.showToast({
        message: 'Thanks!',
        duration: 1000,
        position: 'bottom',
        onDismiss: undefined
      }, undefined);
      this.config.setInstalled();

    });
  }

  register(cb)
  {

    this.handleInstall();

    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      console.log("Prompt Deferred");
      this.deferredPrompt = e;
      cb(e);
    });

    window.addEventListener('load', ()=> {
      if ('serviceWorker' in navigator) {

        navigator.serviceWorker.register('service-worker.js', {scope:"./"})
          .then(reg => {

            this.registered = true;

            this.registration = reg;

            this.listenForWaitingServiceWorker(reg, reg=>{
              if(!this.toastShowing && reg.waiting && this.reopen){
                this.toastShowing = true;
                this.showToast(
                  {
                    message: `New Update Available v${environment.version}`,
                    position: 'bottom',
                    showCloseButton: true,
                    closeButtonText: "Update",
                    onDismiss: ()=>{
                      if(reg.waiting)reg.waiting.postMessage('skipWaiting');
                      this.toastShowing = false;
                    }
                  },undefined
                  );
              }
            });

            if(reg.installing){
              this.showToast({
                message: 'Menumizer is now available offline!',
                duration: 3000,
                position: 'bottom',
                onDismiss: undefined
              }, undefined);
            }

            localStorage.setItem("menumizer-started", 'true');

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

  //parses a url returns order object
  //array destructing and object prop value shorthand
  static kfcUrlSerialzer([chicken_count, side_count, drink_count, popcorn_count, sandwich_count]){
    return {chicken_count, side_count, drink_count, popcorn_count, sandwich_count};
  }

  static getOrderFromUrl(url){
    let str = url.split("/");
    switch (str[4]){
      case "kfc": return this.kfcUrlSerialzer(str.slice(5));
    }
  }

  static async  getCachedData(name){

    if('caches' in self){

      const result = [];

      const cache = await caches.open(name);

      // Get a list of entries. Each item is a Request object
      for (const request of await cache.keys()) {

        let res = await cache.match(request);
        let mizer = await res.json();
        mizer.order = SworkerProvider.getOrderFromUrl(res.url);
        result.push(mizer);
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
