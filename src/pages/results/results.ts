import { Component } from '@angular/core';
import {NavParams} from 'ionic-angular';
import {OptimizerProvider} from "../../providers/optimizer/optimizer";

// interface Order{
//   chicken_amt: number;
//   side_amt: number;
//   drink_amt;
// }


@Component({
  selector: 'page-results',
  templateUrl: 'results.html',
  providers: [OptimizerProvider]
})
export class ResultsPage {


  result={};


  constructor(public navParams: NavParams, private optimizer:OptimizerProvider) {
    console.log("in results");

    this.optimizer.sendOrder({
      chicken_amount: this.navParams.get('chicken_amount'),
      side_amount: this.navParams.get('chicken_amount'),
      drink_amount: this.navParams.get('chicken_amount')
    })
      .subscribe(res=>{
        this.result = res;
        console.log(res);
      });

  }

}
