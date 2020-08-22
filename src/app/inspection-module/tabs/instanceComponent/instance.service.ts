import {Injectable} from "@angular/core";

var Sqlite = require("nativescript-sqlite");


@Injectable({
    providedIn: 'root'
})
export class InstanceService {
    public database: any;

    constructor() {
        this.create_database();
    }

    public create_database() {

        (new Sqlite("sgd.db")).then(db => {
            db.execSQL("CREATE TABLE IF NOT EXISTS instacneTbl (id TEXT PRIMARY KEY," +
                " instanceValues TEXT,inspectionReportId number,checkListCategoryId number)").then(id => {
                this.database = db;
            }, error => {
                console.log("CREATE TABLE ERROR", error);
            });
        }, error => {
            console.log("OPEN DB ERROR", error);
        });
    }

    public All(query) {
        return this.database.all(query);
    }

    public excute(query) {
        return this.database.execSQL(query);
    }

    public excute2(query, value) {
        return this.database.execSQL(query, value);
    }

}
