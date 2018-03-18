import { Component } from '@angular/core';
import {LoadingController, NavParams} from 'ionic-angular';
import {OptimizerProvider} from "../../providers/optimizer/optimizer";


@Component({
  selector: 'page-results',
  templateUrl: 'results.html',
  providers: [OptimizerProvider]
})
export class ResultsPage {
  shareable  = false;
  mizer = {};
  menu=[];
  price;
  //service should return this obj in future, cause its specific to kfc
  order={
    chicken_count: parseInt(this.navParams.get('chicken_count')),
    side_count: parseInt(this.navParams.get('side_count')),
    drink_count: parseInt(this.navParams.get('drink_count')),
    popcorn_count: parseInt(this.navParams.get('popcorn_count')),
    sandwich_count: parseInt(this.navParams.get('sandwich_count'))
  };
  //service should return this too
  totals={
    chicken_count: 0,
    side_count: 0,
    drink_count: 0,
    popcorn_count: 0,
    sandwich_count: 0
  };
  newVariable: any;
  loadingFinished = false;

  constructor(public navParams: NavParams, private optimizer:OptimizerProvider, loadingCtrl:LoadingController) {
    this.items = [
      {expanded: false},
      {expanded: false},
      {expanded: false},
      {expanded: false},
      {expanded: false},
      {expanded: false},
      {expanded: false},
      {expanded: false},
      {expanded: false}
    ];

    this.newVariable = window.navigator;

    if (this.newVariable && this.newVariable.share) {
      this.shareable = true;
    }

    let loading = loadingCtrl.create({
      spinner: 'crescent',
      content: 'Optimizing...'
    });

    loading.present();

    this.optimizer.sendOrder(this.order, this.navParams.get("outlet"))
      .subscribe(res=>{
        this.menu = Object.keys(res.optimal_deal);
        this.mizer = res.optimal_deal;
        this.price = res.trans_info.price;

        for(let combo in this.mizer){
          for(let item in this.totals){
            this.totals[item]+=this.mizer[combo].count * this.mizer[combo][item];
          }
          this.mizer[combo].expanded=false;
        }

        this.loadingFinished = true;
        loading.dismiss();
      }, error=>{
        this.loadingFinished = true;
        loading.dismiss();
      });
  }

  share(){

    this.newVariable.share({
      title: 'Menumizer',
      text: `Take a look at my Mizer for ${this.navParams.get("outlet")} I pay only $${this.price}`,
      url: `https://app.menumizer.com/#/results/${this.navParams.get("outlet")}/${this.order.chicken_count}/${this.order.side_count}/${this.order.drink_count}/${this.order.popcorn_count}/${this.order.sandwich_count}`,
    })
      .then(() => console.log('Successful share'))
      .catch((error) => console.log('Error sharing', error));
  }

  items: any = [];


  expandItem(item){
    // console.log('expanded');
    for(let combo in this.mizer){
      if(combo == item)this.mizer[combo].expanded= !this.mizer[combo].expanded;
      else this.mizer[combo].expanded= false;
    }
  }

}
