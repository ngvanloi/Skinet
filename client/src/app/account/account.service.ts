import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IUser } from '../shared/models/user';
import { Observable, ReplaySubject, catchError, map, of } from 'rxjs';
import { Router } from '@angular/router';
import { IAddress } from '../shared/models/address';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl: string = environment.apiUrl;

  private currentUserSource = new ReplaySubject<IUser | null>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private readonly http: HttpClient, private readonly router: Router) { }

  getCurrentUser(token: string | null): Observable<IUser | null> {
    if (!token) {
      this.currentUserSource.next(null);
      return of(null);
    }
    let headers = new HttpHeaders();
    headers = headers.set("Authorization", `Bearer ${token}`);

    return this.http.get<IUser | null>(this.baseUrl + "account", { headers })
      .pipe(
        map((user: IUser | null) => {
          if (user) {
            localStorage.setItem("token", user.token);
            this.currentUserSource.next(user);
          }
          return user;
        })
      )
  }

  login(values: any):Observable<IUser> {
    return this.http.post<IUser>(this.baseUrl + 'account/login', values)
      .pipe(
        map((user: IUser) => {
          if (user) {
            localStorage.setItem('token', user.token);
            this.currentUserSource.next(user);
          }
          return user;
        }),
        catchError((error) => {
          console.error('Failed to retrieve products from server:', error);
          return of();
        })
      )
  }

  register(values: any):Observable<IUser> {
    return this.http.post<IUser>(this.baseUrl + 'account/register', values)
      .pipe(
        map((user: IUser) => {
          if (user) {
            localStorage.setItem('token', user.token);
            this.currentUserSource.next(user);
          }
          return user;
        }),
        catchError((error) => {
          console.error('Failed to register:', error);
          return of();
        })
      )
  }

  logout() :void{
    localStorage.removeItem('token');
    this.currentUserSource.next(null);
    this.router.navigateByUrl("/");
  }

  checkEmailExists(email: string): Observable<IUser> {
    return this.http.get<IUser>(this.baseUrl + 'account/emailexists?email=' + email)
      .pipe(
        catchError((error) => {
          console.error('Failed to check mail exist from server:', error);
          return of();
        })
      );
  }

  getUserAddress(): Observable<IAddress | null> {
    return this.http.get<IAddress | null>(this.baseUrl + 'account/address')
      .pipe(
        catchError((error) => {
          console.error('Failed to retrieve user address from server:', error);
          return of(null);
        })
      );
  }

  updateUserAddress(address: IAddress): Observable<IAddress | null> {
    return this.http.post<IAddress | null>(this.baseUrl + "account/address", address)
      .pipe(
        catchError((error) => {
          console.error('Failed to update user address from server:', error);
          return of(null);
        })
      );
  }
}
