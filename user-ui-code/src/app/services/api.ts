import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Api {
  constructor(private http:HttpClient){}
  getvlogs(){
    return this.http.get("https://vv-api.securadev.com/vlogs")
  }
  
}
