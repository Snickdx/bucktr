import { Injectable } from '@angular/core';

@Injectable()
export class SworkerProvider {

  registration = undefined;
  online = true;

  constructor()
  {}

  public addInstallingListener(cb)
  {

  }

  public addInstalledListener(reg, cb)
  {

  }

  public addActivatingListener(cb)
  {

  }

  public addActivatedListener(cb)
  {

  }

  public addRedundantListener(cb)
  {

  }

  public addStateChangeListener(cb)
  {
  }

  public async addUpdateFoundListener(cb)
  {
  }

  public addAppInstalledListener(cb)
  {
    window.addEventListener('appinstalled', cb);
  }

  public addBeforeInstallPromptListener(cb)
  {
    window.addEventListener('beforeinstallprompt', e=>{
      e.preventDefault();
      cb(e);
    });
  }

  // See https://html.spec.whatwg.org/multipage/workers.html#dom-worker-postmessage
  public message(message)
  {
    return new Promise(function(resolve, reject) {
      let messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = event => {
        event.data.error ? reject(event.data.error) : resolve(event.data);
      };
      navigator.serviceWorker.controller.postMessage(message, [messageChannel.port2]);
    });
  }

  public register(cb)
  {

    if ('serviceWorker' in navigator){

      navigator.serviceWorker.register('service-worker.js', {scope:"./"})
        .then(reg => {
          this.registration = reg;
          this.listenForWaitingServiceWorker(reg, cb);
        })
        .catch(err => console.log('Error', err));
    }

  }

  //ugly google boiler plate code to ensure the registration is in the proper updated state
  listenForWaitingServiceWorker(reg, callback) {
    function awaitStateChange() {
      reg.installing.addEventListener('statechange', function() {
        if (this.state === 'installed') {
          callback(reg);
        }
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
        if(navigator.onLine){
          this.online = true;
          onlineHandler(event);
        }
      });
      window.addEventListener('offline', event => {
        if(!navigator.onLine){
          this.online = false;
          offlineHandler(event)
        }
      });
    });
  }

  requestNotificationPermission(){
    if('Notification in window' && (<any>Notification).permission !== "granted"){
      Notification.requestPermission().then(res=>{
        console.log("Permission: ",res);
      })
    }
  }

  //parses a url returns order object
  //array destructing and object prop value shorthand
  static kfcUrlSerializer([chicken_count, side_count, drink_count, popcorn_count, sandwich_count])
  {
    return {chicken_count, side_count, drink_count, popcorn_count, sandwich_count};
  }

  static getOrderFromUrl(url)
  {
    let str = url.split("/");
    switch (str[4]){
      case "kfc": return this.kfcUrlSerializer(str.slice(5));
    }
  }

  static async  getCachedData(name)
  {

    if('caches' in self){

      const result = [];

      const cache = await caches.open(name);
      // Get a list of entries. Each item is a Request object
      for (const request of await cache.keys()) {
        let res = await cache.match(request);
        let mizer = await res.json();
        mizer.order = SworkerProvider.getOrderFromUrl(res.url);
        result.unshift(mizer);
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
