import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {SworkerProvider} from "../../providers/sworker/sworker";
import {environment} from "../../app/environment";

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

  mizers;
  server = environment.debug ? "http://localhost:8100" : "https://app.menumizer.com";

  constructor(public navCtrl: NavController, public navParams: NavParams, public sw:SworkerProvider) {
    this.loadMizers();
  }

  async loadMizers(){
    this.mizers = await SworkerProvider.getCachedData("mizer-cache");
  }

  ionViewDidLoad() {

  }

}
