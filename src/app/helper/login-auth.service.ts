import { Injectable } from '@angular/core';
import {UsersService} from '../services/sqlite/users/users.service';

@Injectable({
  providedIn: 'root'
})
export class LoginAuthService {
  data: any;
  constructor( private usersService: UsersService) { }
  async load() {
    this.data = await this.usersService.getAll();
    if (this.data.length === 1) {
      return this.data = {
        message: this.data,
        status: true
      };
    } else {
      return this.data = {
        message: this.data,
        status: false
      };
    }
  }
}
