import { Injectable } from '@angular/core';

var Sqlite = require("nativescript-sqlite");
@Injectable({
  providedIn: 'root'
})
export class QuestionfaulttableService {
    public database: any;
    constructor(){
        this.create_database();
    }
    public create_database() {
        (new Sqlite("my.db")).then(db => {
            db.execSQL("CREATE TABLE IF NOT EXISTS QuestionFaultTbl (id INTEGER PRIMARY KEY AUTOINCREMENT," +
                " faultTitle TEXT,faultId number,troubleShootingId number,troubleShooting TEXT,imgStr TEXT,questionId number)").then(id => {
                this.database= db;

            }, error => {
                console.log("CREATE TABLE ERROR", error);
            });
        }, error => {
            console.log("OPEN DB ERROR", error);
        });
    }
    public All(query):any {
        return this.database.all(query);
    }

    public excute(query) {
        return this.database.execSQL(query);
    }

    public excute2(query, value) {
        return this.database.execSQL(query, value);
    }
}
