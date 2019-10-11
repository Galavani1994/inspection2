import {Component, OnInit} from '@angular/core';
import * as appSettings from "tns-core-modules/application-settings";
import {DropDown} from "nativescript-drop-down";


@Component({
    selector: 'app-information',
    templateUrl: './information.component.html',
    styleUrls: ['./information.component.css'],
    moduleId: module.id,
})
export class InformationComponent implements OnInit {
    notificationNum: any;
    notificationDate: any;
    itpNum: any;
    itpDate: any;
    programNum: any;
    programDate: any;
    fromHour: any;
    toHour: any;
    product: any;
    private inspectionItem=[];
    private productTitles=[];

    constructor() {
        console.log('infooooooooooo')
    }

    ngOnInit() {
        let sanjeshData = JSON.parse(appSettings.getString('sanjeshData'));
        this.notificationNum = sanjeshData.notificationsCode;
        this.notificationDate = sanjeshData.updatedDateShamsi;
        this.itpNum = sanjeshData.code;
        this.itpDate = sanjeshData.itpDate;
        this.programNum = sanjeshData.code;
        this.programDate = sanjeshData.code;
        this.fromHour = sanjeshData.timeFrom;
        this.toHour = sanjeshData.timeTo;
        this.product = sanjeshData.productTitle;

        this.inspectionItem = sanjeshData.inspectionOperationItems;
        for (let item of this.inspectionItem) {
            this.productTitles.push(item.productTitle);
        }
        appSettings.setBoolean('isSelectdItemProduct',false);
    }
    public selectedIndexChanged(args){
        let picker = <DropDown>args.object;
        let itemName = picker.items[picker.selectedIndex];
        let titleIndex = this.inspectionItem.findIndex(obj => obj.productTitle == itemName);
        appSettings.setBoolean('isSelectdItemProduct',true);
        appSettings.setNumber('selectdItemIndex',titleIndex);

    }

}
