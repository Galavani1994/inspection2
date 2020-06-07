import {Injectable} from "@angular/core";
import {GenericService} from "~/app/inspection-module/tabs/genricRepository/generic.service";

var Sqlite = require("nativescript-sqlite");


@Injectable({
    providedIn: 'root'
})
export class InstanceInfoService{
    protected database: any;
    constructor() {
        this.create_database();
    }

    public create_database() {
        (new Sqlite("my.db")).then(db => {
            db.execSQL("CREATE TABLE IF NOT EXISTS SGD_inspection_report_item (id TEXT PRIMARY KEY,identifycharacter TEXT,inspectionReportId Number,isChecked INTEGER) ").then(id => {
                this.database = db;
            }, error => {
                console.log("CREATE TABLE ERROR", error);
            });
        }, error => {
            console.log("OPEN DB ERRORR", error);
        });
    }
    save(id,identifycharacter,inspectionReportId,isChecked){
        return this.database.execSQL("insert into SGD_inspection_report_item(id,identifycharacter,inspectionReportId,isChecked) values (?,?,?,?)",
            [id,JSON.stringify(identifycharacter),inspectionReportId,isChecked]);
    }
    update(id, isChecked: boolean) {
        return this.database.execSQL("update SGD_inspection_report_item set isChecked=? where id=?",[isChecked,id]);
    }
    getBahrAndNemoune(productId){
        return this.database.all("select * from instacneInfoTbl t where t.productId=?",[productId]);
    }

    clearDB(inspectionReportId) {
        return this.database.execSQL("delete from SGD_inspection_report_item  where inspectionReportId=?",[inspectionReportId]);
    }


    get(inspectionReportId) {
        return this.database.all("select * from  SGD_inspection_report_item t where t.inspectionReportId=?",[inspectionReportId]);
    }
    public All(query) {
        return this.database.all(query);
    }
}
