import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Users } from '../../models/users';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  base_path = 'http://bpkad.ambon.go.id/';

  constructor(private http: HttpClient) { }

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'MyClientCert': '',        // This is empty
      'MyToken': ''              // This is empty
    })
  }
  // Login
  Login(item): Observable<Users> {
    return this.http
        .post<Users>(this.base_path + 'api/login-mobile', JSON.stringify(item), this.httpOptions);
  }
  CreateDataMediaSosial(item): Observable<Users> {
    return this.http
        .post<Users>(this.base_path + 'api/create-media-sosial', JSON.stringify(item), this.httpOptions);
  }
  // Handle API errors
  handleError(error: HttpErrorResponse) {
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
    // return an observable with a user-facing error message
    return throwError(
        'Something bad happened; please try again later.');
  };
  // Get students data
  getSession(): Observable<Users> {
    return this.http
        .get<Users>(this.base_path + 'api/get-session-mobile')
        .pipe(
            retry(2),
            catchError(this.handleError)
        );
  }

  // Create a new item
  createItem(item): Observable<Users> {
    return this.http
        .post<Users>(this.base_path, JSON.stringify(item), this.httpOptions)
        .pipe(
            retry(2),
            catchError(this.handleError)
        );
  }


  // Get single student data by ID
  getItem(id): Observable<Users> {
    return this.http
        .get<Users>(this.base_path + '/' + id)
        .pipe(
            retry(2),
            catchError(this.handleError)
        );
  }

  // Get students data
  getList(): Observable<Users> {
    return this.http
        .get<Users>(this.base_path)
        .pipe(
            retry(2),
            catchError(this.handleError)
        );
  }

  // Update item by id
  updateItem(id, item): Observable<Users> {
    return this.http
        .put<Users>(this.base_path + '/' + id, JSON.stringify(item), this.httpOptions)
        .pipe(
            retry(2),
            catchError(this.handleError)
        )
  }

  // Delete item by id
  deleteItem(id) {
    return this.http
        .delete<Users>(this.base_path + '/' + id, this.httpOptions)
        .pipe(
            retry(2),
            catchError(this.handleError)
        )
  }
}

