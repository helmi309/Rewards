import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';
import { LoginAuthService } from './helper/login-auth.service';
import {DatabaseService} from './services/config/database.service';

@Injectable()
export class AuthGuard implements CanActivate {
 user: any;
    constructor(private router: Router, private LoginCek: LoginAuthService, private db: DatabaseService) {}
    async canActivate() {
            await this.LoginCek.load().then(
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
        if (res.status === true) {
            this.router.navigate(['app/categories']);
        }
    }
}
