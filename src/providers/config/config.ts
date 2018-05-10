import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import {environment} from "../../app/environment";


@Injectable()
export class ConfigProvider {

  constructor(public storage: Storage) {}

  async initConfig(){
    let config = await this.storage.get("CONFIG");
    if(config){
      return config;
    }else{
      return this.storage.set("CONFIG", environment.defaultConfig);
    }
  }


  getConfig(){
    return this.storage.get("CONFIG");
  }

  setConfig(config){
    this.storage.set("CONFIG", config);
  }

  mutateConfig(cb){
    let config = this.getConfig();
    cb(config);
    this.setConfig(config);

  }

  async getSelectedRestaurant(){
    let config = await this.getConfig();
    return config.selected;
  }

  changeRestaurant(restaurant){
    this.mutateConfig(config=>config.selected = restaurant);
  }

  async getInstalled(){
    let config = await this.getConfig();
    return config.installed;
  }

  setInstalled(){
    this.mutateConfig(config=>config.installed = true);
  }

}
