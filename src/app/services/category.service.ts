import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private http: HttpClient) { }

  url = '../assets/category.json';

  getAll() {
    return this.http.get(this.url);
  }
}
