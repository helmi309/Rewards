import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';
import { LoginAuthService } from './helper/login-auth.service';

@Injectable()
export class AuthGuardFalse implements CanActivate {
 user: any;
    canActivate() {
        this.LoginCek.load().then(
            res => this.ceklogin(res),
            err => console.log('HTTP Error', err),
        );
        return true;
    }
    ceklogin(res) {
        if (res.status === false) {
            this.router.navigate(['auth/login']);
        }
    }
    constructor(private router: Router,  private LoginCek: LoginAuthService) { }
}
