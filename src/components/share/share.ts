import {Component, Input} from '@angular/core';

/**
 * Generated class for the ShareComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'share-btn',
  templateUrl: 'share.html'
})
export class ShareComponent {


  @Input('order') order;
  @Input('price') price;

  _window:any       = window.navigator;
  isShareable = this._window && this._window.share;

  constructor() {}


  share()
  {
    let options = this.order["outlet"]+"/";

    for(let key in this.order){
      options+= key=="outlet" || key=="price"? "" : this.order[key]+"/";
    }

    const text = `Take a look at my Mizer for ${this.order["outlet"]} I pay only $${this["price"]}`;
    const url = `https://app.menumizer.com/results/${options}`;
    console.log(text, url);


    this._window.share({
        title: 'Menumizer',
        text: text,
        url: url
      })
      .then(() => console.log('Successful share'))
      .catch((error) => console.log('Error sharing', error));
  }

}
