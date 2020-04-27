import {Injectable} from "@angular/core";
import {GenericService} from "~/app/inspection-module/tabs/genricRepository/generic.service";

var Sqlite = require("nativescript-sqlite");


@Injectable({
    providedIn: 'root'
})
export class InstanceInfoService extends GenericService{

    constructor() {
        super("instacneInfoTbl");
    }

}
