import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private BASE_URL = environment.API_URL;

  constructor(private http: HttpClient) { }

  getUserDetails() {
    //return this.http.post()
  }
}
