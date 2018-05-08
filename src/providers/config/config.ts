import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';

/*
  Generated class for the ConfigProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ConfigProvider {

  loaded = false;


  async changeRestaurant(restaurant){
    let config = await this.storage.get("CONFIG");
    config.selected = restaurant;
    this.storage.set("CONFIG", config);
  }

  initConfig(){
    this.storage.set("CONFIG", {selected : "kfc"});
  }

  async getSelectedRestaurant(){
    let config = await this.storage.get("CONFIG");
    if(config==null){
      this.initConfig();
      config = {selected:"kfc"};
    }
    return config;
  }


  constructor(public storage: Storage) {
    if(this.storage.get("CONFIG") == null)this.initConfig();
  }

}
