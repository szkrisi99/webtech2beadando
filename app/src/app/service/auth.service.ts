import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authToken: any;
  user: any;

  constructor(private http: HttpClient) { }

  /*authenticateUser(user){
    let headers = new HttpHeaders();
    headers.append('Content-Type','application/json');
    return this.http.post('http://localhost:3000/items/authenticate', user,{headers: headers})
    .pipe(map((res:any) => res.json));
  }*/

  authenticateUser(user) {
    let headers = new HttpHeaders();
    headers.append('Contet-Type', 'application/json');
    console.log(headers);
    return this.http.post('http://localhost:3000/items/authenticate', user, {
      headers: headers,
      //observe: 'response'
    }).pipe(map((res: any) => res));
  }

  storeUserData(token, user){
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }
}
