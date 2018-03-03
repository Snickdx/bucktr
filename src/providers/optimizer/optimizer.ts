import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {ErrorObservable} from "rxjs/observable/ErrorObservable";
import {catchError} from "rxjs/operators";
import {environment} from "../../app/environment";

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};


interface Order{
  chicken_amt: number;
  side_amt: number;
  drink_amt;
}


@Injectable()
export class OptimizerProvider {

  constructor(public http: HttpClient) { }

  private static handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an ErrorObservable with a user-facing error message
    return new ErrorObservable(
      'Something bad happened; please try again later.');
  };

  public sendOrder(order){
    return this.http.post<Order>(environment.backend, order, httpOptions)
      .pipe(
        catchError(OptimizerProvider.handleError)
      );

  }

}
