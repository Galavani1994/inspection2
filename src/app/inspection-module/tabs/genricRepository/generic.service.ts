import {Injectable} from "@angular/core";

var Sqlite = require("nativescript-sqlite");


@Injectable({
    providedIn: 'root'
})
export abstract class GenericService {
    protected database: any;
    protected tableName;

    constructor(tableName:string) {
        this.tableName=tableName;
        this.create_database();
    }

    public create_database() {

        (new Sqlite("my.db")).then(db => {
            db.execSQL("CREATE TABLE IF NOT EXISTS "+this.tableName+"  (id INTEGER PRIMARY KEY AUTOINCREMENT," +
                this.tableName+"Values TEXT,productId Number)").then(id => {
                this.database = db;
            }, error => {
                console.log("CREATE TABLE ERROR", error);
            });
        }, error => {
            console.log("OPEN DB ERRORR", error);
        });
    }

    public getAll(query) {
        return this.database.all("select * from "+this.tableName);
    }

    public save(values,productId) {
        return this.database.execSQL("insert into "+this.tableName+" ("+this.tableName+"Values,productId) VALUES (?,?) ",[JSON.stringify(values),productId]);
    }

    public excute2(query, value) {
        return this.database.execSQL(query, value);
    }
    public clearDB() {
        return this.database.execSQL("delete from "+this.tableName);
    }


}
