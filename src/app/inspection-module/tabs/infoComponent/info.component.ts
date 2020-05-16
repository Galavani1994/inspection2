import {Component, Input, OnInit} from "@angular/core";
import * as appSettings from "tns-core-modules/application-settings";
import {Info} from "~/app/inspection-module/tabs/infoComponent/info.model";


@Component({
    selector: 'info-data',
    templateUrl: './info.component.html',
    styleUrls: ['./info.component.css'],
    moduleId: module.id,
})
export class InfoComponent implements OnInit {
    mainInfo: Info;
    sanjeshData = [];

    constructor() {
        this.sanjeshData = JSON.parse(appSettings.getString('sanjeshData'));
        this.mainInfo=new Info();
        this.loadInformatin();
    }

    ngOnInit(): void {

    }

    loadInformatin() {
        // @ts-ignore
        this.mainInfo.notificationsCode = this.sanjeshData.notificationsCode;
        // @ts-ignore
        this.mainInfo.updatedDateShamsi = this.sanjeshData.updatedDateShamsi;
        // @ts-ignore
        this.mainInfo.itpNum = this.sanjeshData.code;
        // @ts-ignore
        this.mainInfo.itpDate = this.sanjeshData.itpDate;
        // @ts-ignore
        this.mainInfo.planNum = this.sanjeshData.code;
        // @ts-ignore
        this.mainInfo.planDate = this.sanjeshData.code;
        // @ts-ignore
        this.mainInfo.timeFrom = this.sanjeshData.timeFrom;
        // @ts-ignore
        this.mainInfo.timeTo = this.sanjeshData.timeTo;
        // @ts-ignore
        this.mainInfo.product = this.sanjeshData.productTitle;
    }


}
