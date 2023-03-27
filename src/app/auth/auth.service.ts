import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { AuthData } from "./auth-data.model";

@Injectable({ providedIn: "root" })
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}
  private token: string = null;
  private authStatus = false;
  private authStatusListener = new Subject<boolean>();
  tokenTimer = null;
  createUser(authData: AuthData) {
    this.http
      .post("http://localhost:3000/api/users/signup", authData)
      .subscribe((res: any) => {
        console.log(res);
        this.router.navigate(["/"]);
      });
  }
  getAuthStatus() {
    return this.authStatus;
  }
  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }
  getToken() {
    return this.token;
  }

  autoAuthUser() {
    const authInfo = this.getAuthData();
    console.log(authInfo);

    if (authInfo) {
      const expiresIn =
        authInfo.expirationDate.getTime() - new Date().getTime();
      if (expiresIn > 0) {
        this.token = authInfo.token;
        this.authStatus = true;
        this.authStatusListener.next(true);

        this.tokenTimer = setTimeout(() => {
          this.logout();
        }, expiresIn * 1000);
      }
    }
  }
  loginUser(authData: AuthData) {
    this.http
      .post<{ status: {}; data: { token: string; expiresIn: number } }>(
        "http://localhost:3000/api/users/login",
        authData
      )
      .subscribe((res: any) => {
        console.log(res);
        this.token = res.data.token;
        const expiresIn = res.data.expiresIn;
        if (this.token) {
          this.tokenTimer = setTimeout(() => {
            this.logout();
          }, expiresIn * 1000);
        }
        const now = new Date();
        const expirationDate = new Date(now.getTime() + expiresIn * 1000);
        this.saveAuthData(this.token, expirationDate);
        this.authStatus = true;
        this.authStatusListener.next(true);
        this.router.navigate(["/"]);
      });
  }
  logout() {
    this.token = null;
    this.authStatus = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();

    this.router.navigate(["/"]);
  }
  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
  }
  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
  }
  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    if (token) {
      return { token: token, expirationDate: new Date(expirationDate) };
    }
    return null;
  }
}
