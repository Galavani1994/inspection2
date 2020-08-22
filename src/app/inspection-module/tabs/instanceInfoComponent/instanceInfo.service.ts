import {Injectable} from "@angular/core";
import {GenericService} from "~/app/inspection-module/tabs/genricRepository/generic.service";
import * as appSettings from "tns-core-modules/application-settings";

var Sqlite = require("nativescript-sqlite");
declare var main: any;

@Injectable({
    providedIn: 'root'
})
export class InstanceInfoService {
    protected database: any;

    constructor() {
        this.create_database();
    }

    public create_database() {

        (new Sqlite("sgd.db")).then(db => {
            db.execSQL("CREATE TABLE IF NOT EXISTS SGD_inspection_report_item (id TEXT PRIMARY KEY,identifycharacter TEXT,inspectionReportId Number,isChecked INTEGER) ").then(id => {
                this.database = db;
            }, error => {
                console.log("CREATE TABLE ERROR", error);
            });
        }, error => {
            console.log("OPEN DB ERRORR", error);
        });
    }

    save(id, identifycharacter, inspectionReportId, isChecked) {
        return this.database.execSQL("insert into SGD_inspection_report_item(id,identifycharacter,inspectionReportId,isChecked) values (?,?,?,?)",
            [id, main.java.org.inspection.AES.encrypt(JSON.stringify(identifycharacter), appSettings.getString('dbKey')), inspectionReportId, isChecked]);
    }

    update(id, isChecked: boolean) {
        return this.database.execSQL("update SGD_inspection_report_item set isChecked=? where id=?", [isChecked, id]);
    }

    getBahrAndNemoune(inspectionReportId) {
        return this.database.all("select * from SGD_inspection_report_item t where t.inspectionReportId=?", [inspectionReportId]);
    }

    clearDB(inspectionReportId) {
        return this.database.execSQL("delete from SGD_inspection_report_item  where inspectionReportId=?", [inspectionReportId]);
    }


    get(inspectionReportId) {
        return this.database.all("select * from  SGD_inspection_report_item t where t.inspectionReportId=?", [inspectionReportId]);
    }

    public All(query) {
        return this.database.all(query);
    }
}
