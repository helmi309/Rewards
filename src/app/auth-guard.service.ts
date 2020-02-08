import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';
import { LoginAuthService } from './helper/login-auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
 user: any;
    canActivate() {
        this.LoginCek.load().then(
            res => this.ceklogin(res),
            err => console.log('HTTP Error', err),
        );
        return true;
    }
    ceklogin(res) {
        if (res.status === true) {
            this.router.navigate(['app/categories']);
        }
    }
    constructor(private router: Router,  private LoginCek: LoginAuthService) { }
}
