import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import {environment} from "../../app/environment";


@Injectable()
export class ConfigProvider {

  constructor(public storage: Storage) {}

  async initConfig(){
    await this.storage.ready();
    let config = await this.storage.get("CONFIG");
    if(config){
      return config;
    }else{
      await this.storage.set("CONFIG", environment.defaultConfig);
      this.initConfig();
    }
  }

  async getConfig(){
    await this.storage.ready();
    return this.storage.get("CONFIG");
  }

  setConfig(config){
    this.storage.set("CONFIG", config);
  }


  async mutateConfig(key, value){
    let config = await this.getConfig();
    console.log("before:",config);
    config[key]=value;
    console.log("after:",config);
    this.setConfig(config);
  }

  changeRestaurant(restaurant){
    this.mutateConfig("selected" ,restaurant);
  }

  setInstalled(){
    this.mutateConfig("installed", true);
  }

}
