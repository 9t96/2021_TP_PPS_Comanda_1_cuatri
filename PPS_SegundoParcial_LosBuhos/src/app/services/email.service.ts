import { Injectable } from '@angular/core';
import { Email } from '../interfaces/email';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  private dominio:string = "https://smtp-losbuhos.herokuapp.com/";
  private metodo:string = "api/sendEmail";

  constructor(private http: HttpClient) { 
  }

  public sendEmail(email:Email){
    const options = {
      headers: {
       'Content-Type': 'application/json'
     }
    };

    const url = this.getUrl();

    return this.http.post(url, JSON.stringify(email), options);
  }

  private getUrl(){
    return this.dominio + this.metodo;
  }
}
