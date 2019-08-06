import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from './user.model';
import { City } from './select.model';
import { DataService } from './data.service';
import { Subscription } from "rxjs";
import { PageEvent } from "@angular/material";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent implements OnInit, OnDestroy {

  color = "warn";
  title = 'nyapp2';
  users: User[];
  isActive:boolean=false;
  datafound: boolean = false;
   private postsSub: Subscription;
  isLoading = false;
  public totalPosts = 0;
  public postsPerPage = 5;
  public currentPage = 1;
  pageSizeOptions = [5, 10,20];
  query: string;
  p: string;


  onClick() {
    this.isActive = !this.isActive;
  }
  displayedColumns: string[] = ['BRANCH','ADDRESS','STATE','IFSC','BANK_NAME',];
  cities: City[] = [
    { value: 'DELHI', viewValue: 'DELHI' },
    { value: 'PUNE', viewValue: 'PUNE' },
    { value: 'PATNA', viewValue: 'PATNA' },
    { value: 'MUMBAI', viewValue: 'MUMBAI' },
    { value: 'BANGALORE', viewValue: 'BANGLORE' },
  ];
  
  handleSuccess(data) {
    this.datafound = true;
    this.isLoading = false;
    this.users = data;
  }
  constructor(private _dataService: DataService) { }

  ngOnInit() {
    
  }

  searchbankdata(query: string, p: string) {
    
     this.isActive = !this.isActive;
    this.isLoading = true;
    this.query = query;
    this.p = p;
    this._dataService.getPosts(this.postsPerPage, this.currentPage, this.query, this.p);
    this.postsSub = this._dataService
      .getPostUpdateListener()
      .subscribe((postData: { posts: User[]; postCount: number }) => {
        this.totalPosts = postData.postCount;
        this.users = postData.posts;
        this.handleSuccess(this.users);
        
      });
  }

onChangedPage(pageData: PageEvent) {

    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this._dataService.getPosts(this.postsPerPage, this.currentPage, this.query, this.p);
    this.postsSub = this._dataService
      .getPostUpdateListener()
      .subscribe((postData: { posts: User[]; postCount: number }) => {
        this.totalPosts = postData.postCount;
        this.users = postData.posts;
        this.handleSuccess(this.users);
       
      });
  }  
  ngOnDestroy(){
    
    this.postsSub.unsubscribe();
  }
}
