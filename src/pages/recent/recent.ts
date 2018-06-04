import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {SworkerProvider} from "../../providers/sworker/sworker";
import {environment} from "../../app/environment";
import {ConfigProvider} from "../../providers/config/config";
import {KfcOpPage} from "../optimizer/kfc/kfcOptimizer";

/**
 * Generated class for the RecentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-recent',
  templateUrl: 'recent.html',
})
export class RecentPage {

  mizers=[];
  selected;
  server = environment.debug ? "http://localhost:8100" : "https://app.menumizer.com";

  constructor(public navCtrl: NavController, public navParams: NavParams, public sw: SworkerProvider, public config:ConfigProvider) {
   this.config.getConfig().then(configObj=>{
     this.selected = configObj.selected;
   });
    this.loadMizers();
  }

  async loadMizers() {
    this.mizers = (await SworkerProvider.getCachedData("mizer-cache"));
  }

  goToOptimizer(){
    let pages={
      "kfc":KfcOpPage
    };
    this.navCtrl.setRoot(pages[this.selected]);
  }


}


