import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  db: SQLiteObject;
  databaseName = 'rewards.db';

  constructor(private sqlite: SQLite, private sqlitePorter: SQLitePorter) { }
  async openDatabase() {
    try {
      this.db = await this.sqlite.create({ name: this.databaseName, location: 'default' });
      await this.createDatabase();
    } catch (error) {
      console.error('Terjadi kesalahan saat membuat database', error);
    }
  }

  async createDatabase() {
    const sqlCreateDatabase = await this.getCreateTable();
    const result = await this.sqlitePorter.importSqlToDb(this.db, sqlCreateDatabase);
    // await this.CekSession.load();
    return result ? true : false;
  }

  async getCreateTable() {
    const sqls = [];
    sqls.push('CREATE TABLE IF NOT EXISTS users (id integer primary key AUTOINCREMENT, name varchar(100), email varchar(100), userId varchar(100), image varchar(300), role varchar(100), isCode varchar(300));');
    return sqls.join('\n');
  }

  async executeSQL(sql: string, params?: any[]) {
    return this.db.executeSql(sql, params);
  }
}
