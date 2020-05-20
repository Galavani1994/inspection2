import {Injectable} from "@angular/core";
import * as Toast from 'nativescript-toast';

var Sqlite = require("nativescript-sqlite");

@Injectable({
    providedIn: 'root'
})
export class AnswerQuestionService {
    public database: any;
    constructor(){
        this.create_database();
    }
    public create_database() {
        (new Sqlite("my.db")).then(db => {
            db.execSQL("CREATE TABLE IF NOT EXISTS SGD_answerQuestionTbl (id INTEGER PRIMARY KEY AUTOINCREMENT," +
                " answerQuestion TEXT,inspectionReportChecklistId TEXT,periorityMob number,inspectionReportId NUMBER)").then(id => {
                this.database= db;

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
