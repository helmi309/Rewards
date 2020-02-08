import { Users } from './users';
import { DatabaseService } from '../../config/database.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private db: DatabaseService) { }

 insert(users: Users) {
    const sql = 'insert into users (name, email,userId,role,image,isCode) values (?,?,?,?,?,?)';
    const data = [users.name, users.email, users.userId, users.role, users.image, users.isCode];

    return this.db.executeSQL(sql, data);
  }
  update(users: Users) {
    const sql = 'update users set name = ? where id = ?';
    const data = [users.name, users.id];
    return this.db.executeSQL(sql, data);
  }

  delete(id: number) {
    const sql = 'delete from users where id = ?';
    const data = [id];

    return this.db.executeSQL(sql, data);
  }
 deleteAll() {
    const sql = 'delete from users';

    return this.db.executeSQL(sql);
  }

  async getById(id: number) {
    const sql = 'select * from users where id = ?';
    const data = [id];
    const result = await this.db.executeSQL(sql, data);
    const rows = result.rows;
    const users = new Users();
    if (rows && rows.length > 0) {
      const item = rows.item(0);
      users.id = item.id;
      users.name = item.name;
      // users.telp = item.telp;
    }
    return users;
  }
  async getByUserId(id: number) {
    const sql = 'select * from users where userId = ?';
    const data = [id];
    const result = await this.db.executeSQL(sql, data);
    const rows = result.rows;
    const users = new Users();
    if (rows && rows.length > 0) {
      const item = rows.item(0);
      users.id = item.id;
      users.name = item.name;
      users.email = item.email;
    }
    return users;
  }

  async getAll() {
    const sql = 'select * from users';
    const result = await this.db.executeSQL(sql);
    const userss = this.fillContacts(result.rows);
    return userss;
  }

  async filter(text: string) {
    const sql = 'select * from users where name like ? or telp like ?';
    const data = [`%${text}%`, `%${text}%`];
    const result = await this.db.executeSQL(sql, data);
    const users = this.fillContacts(result.rows);
    return users;
  }

  private fillContacts(rows: any) {
    const users: Users[] = [];

    for (let i = 0; i < rows.length; i++) {
      const item = rows.item(i);
      const pengguna = new Users();
        pengguna.id =    item.id;
        pengguna.name =  item.name;
        pengguna.email = item.email;
        pengguna.userId =item.userId;
        pengguna.image = item.image;
        pengguna.role =  item.role;
        pengguna.isCode =item.isCode;
        users.push(pengguna);
    }
    return users;
  }
}
