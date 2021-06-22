import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Item } from './Item';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {

  private BASE_URL = environment.API_URL;
  private headers=new HttpHeaders().append('Content-Type','application/json');
  private _refreshNeeded = new Subject<void>();
  private itemId: string;

  constructor(private http: HttpClient) { }

  get refreshNeeded(){
    return this._refreshNeeded;
  }

  /*getItems(body:any): Observable<any>{
    console.log(this.http.post(this.BASE_URL,body,{headers:this.headers}));
    return this.http.post(this.BASE_URL,body,{headers:this.headers});
  }*/

  getItems(): Observable<Item[]> {
    //console.log(this.http.get<Item[]>(`${this.BASE_URL}`))
    return this.http.get<Item[]>(`${this.BASE_URL}`)
  }

  getItemById(id: string): Observable<Item> {
    //console.log(this.http.get<Item>(`${this.BASE_URL}/6076d8b25f5c2c1880d7f7f3`))
    return this.http.get<Item>(`${this.BASE_URL}/${id}`)
  }

  createItem(name: string, quantity: number, price: number, category: string): Observable<Item> {
    return this.http.post<Item>(`${this.BASE_URL}`,
    { name, quantity, price, category })
    .pipe(
      tap(() => {
        this._refreshNeeded.next();
      })
    );
  }

  deleteItem(id: string): Observable<any> {
    return this.http.delete(`${this.BASE_URL}/${id}`)
    .pipe(
      tap(() => {
        this._refreshNeeded.next();
      })
    );
  }

  updateItem(id: string,item: Item): Observable<any> {
    return this.http.patch(`${this.BASE_URL}/${id}`,item)
    .pipe(
      tap(() => {
        this._refreshNeeded.next();
      })
    );
  }

  getItemUpdate(): string{
    return this.itemId;
  }

  populateForm(itemupdate){

    this.itemId = itemupdate;
    console.log(itemupdate);
  }
}
