import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './user.model';
import { map } from "rxjs/operators";
import { Subject } from "rxjs";
import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private query: string;
  private p: string;
  public myArray = [];
  public postData: User[]= [];
  public myPost: {postData: User[], count: number};
  appUrl=environment.url;
  
  
  //appUrl = 'https://vast-shore-74260.herokuapp.com/banks?bank_name=';
  private postsUpdated = new Subject<{ posts: User[]; postCount: number }>();
  constructor(private _http: HttpClient) { }

  
  getPosts(postsPerPage: number, currentPage: number,query, p) {
    var array: User[] = [];
    let post: any;
    let i=0,m=0;
    this._http
      .get<{ posts: any }>(
        this.appUrl + query.toUpperCase() + '&&city=' + p
      ).pipe(
        map(postsData =>{
          while(postsData[i]){
            i++;
          }
        
          for(let k=(postsPerPage*(currentPage-1));k<=((postsPerPage*(currentPage-1) + postsPerPage) -1);k++){
            if(k>=i){
              break;
            }
            array[m] = postsData[k];
              m++;
          }
            return{
              array, i
            }
        }
      )
      )
      .subscribe(transformedPostData => {
        const temp = transformedPostData;
        this.postsUpdated.next({
          posts: temp.array,
          postCount: temp.i
        });
      });
  }
   getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }
  getUsers(query, p) {
    return this._http.get<User[]>(this.appUrl + query.toUpperCase() + '&&city=' + p);
  }

}
