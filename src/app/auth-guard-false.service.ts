import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';
import { LoginAuthService } from './helper/login-auth.service';
import {DatabaseService} from './services/config/database.service';

@Injectable()
export class AuthGuardFalse implements CanActivate {
    constructor(private router: Router,  private LoginCek: LoginAuthService, private db: DatabaseService) { }
    user: any;
    async canActivate() {
        this.LoginCek.load().then(
            res => this.ceklogin(res),
            err => this.reloaddata(),
        );
        return true;
    }
    async reloaddata() {
        await this.db.openDatabase();
        await this.canActivate();
    }
    async ceklogin(res) {
        if (res.status === false) {
            this.router.navigate(['auth/login']);
        }
    }
}
