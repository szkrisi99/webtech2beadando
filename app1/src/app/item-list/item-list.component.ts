import { Component, OnInit, ViewChild } from '@angular/core';
import { ItemsService } from '../items.service';
import { Item } from '../Item';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { mergeMap } from 'rxjs/operators';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ItemAddComponent } from '../item-add/item-add.component';
import { ItemUpdateComponent } from '../item-update/item-update.component';



/*export interface Proba {
  name: string;
  quantity: number;
  price: number;
  category: string;
}*/

/*const DATA: Proba[] = [
  {name: 'Kenyér', quantity: 2, price: 10, category: 'Pékárú'},
  {name: 'Zsömle', quantity: 5, price: 11, category: 'Pékárú'},
  {name: 'Tej', quantity: 4, price: 22, category: 'Tejtermék'},
  {name: 'Csoki', quantity: 3, price: 101, category: 'Édesség'},
  {name: 'Cola', quantity: 10, price: 3, category: 'Üdítő'},
  {name: 'Tej', quantity: 4, price: 22, category: 'Tejtermék'},
  {name: 'Csoki', quantity: 3, price: 101, category: 'Édesség'},
  {name: 'Cola', quantity: 10, price: 3, category: 'Üdítő'},
  {name: 'Tej', quantity: 4, price: 22, category: 'Tejtermék'},
  {name: 'Csoki', quantity: 3, price: 101, category: 'Édesség'},
  {name: 'Cola', quantity: 10, price: 3, category: 'Üdítő'},
]*/

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit {

  public loading = true;
  public errorMsg: string;
  public successMsg: string;
  public items: Item[];
  public oneItem: Item;
  public columns =['name','quantity','price','category','update','delete'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  //listData = new MatTableDataSource<Proba>(DATA);
  listData2 = new MatTableDataSource<any>([]);
  updateItemId: string;

  constructor(private itemService: ItemsService, private dialog: MatDialog) { }

  filter(event: string){
    this.listData2.filter = event.trim().toLowerCase();
  }

  ngOnInit(): void{

    this.itemService.refreshNeeded
      .subscribe(() => {
        this.getAllItems();
      });

    this.getAllItems();
    //this.listData.sort = this.sort;
    //this.listData.paginator = this.paginator;
    /*this.sort.sortChange.subscribe((res:any) =>{
      this.page=0;
      this.SortByField=res.active;
      this.SortByOrder=res.directon;
      if(res.direction==='asc'){
        this.SortByOrder=1;
      } else {
        this.SortByOrder=-1;
      }
    });*/
    /*this.getAllItems();
    this.listData.sort = this.sort;
    this.itemService.refreshNeeded
      .subscribe(() => {
        this.getAllItems();
      });
    this.getAllItems();
    this.itemService.getItems()
      .subscribe((items: Item[]) => {
        this.items = items;
        this.listData = new MatTableDataSource<Item>(this.items);
        this.listData.sort = this.sort;
        this.loading = false;
    });*/
  }

  private getAllItems(){
    this.itemService.getItems().subscribe((res:any) => {
      this.listData2=new MatTableDataSource(res);
      this.listData2.sort = this.sort;
      this.listData2.paginator = this.paginator;
    })
  }

  deleteItem(id: string) {
    this.itemService.deleteItem(id)
      .pipe(
        mergeMap(() => this.itemService.getItems())
      )
      .subscribe((items: Item[]) => {
        this.items = items;
        this.successMsg = 'Item succesfully deleted'
      }),
      (error: ErrorEvent) => {
        this.errorMsg = error.error.message;
      }
  }

  onCreate(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "40%";
    this.dialog.open(ItemAddComponent,dialogConfig);
  }

  getOneItem(id: string){
    this.itemService.getItemById(id)
    .subscribe((res:any) => {
      this.oneItem = res;
      //console.log(res);
    });
    //return this.itemService.getItemById(id);
  }

  onEdit(id: string){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "40%";
    this.getOneItem(id);
    this.dialog.open(ItemUpdateComponent,dialogConfig);
    this.itemService.populateForm(id);
  }
}
