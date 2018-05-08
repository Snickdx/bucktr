import { Component } from '@angular/core';
import {NavParams} from 'ionic-angular';
import {MizerProvider} from "../../providers/mizer/mizer";
import {KfcPage} from "./kfc/kfcResults";


@Component({
  selector: 'page-results',
  templateUrl: 'results.html',
  providers: [MizerProvider]
})
export class ResultsPage {

  curPage;

  constructor(
    private navParams: NavParams,
  ) {
    switch(this.navParams.data['outlet']){
      case "kfc":this.curPage = KfcPage;
    }
  }


}
