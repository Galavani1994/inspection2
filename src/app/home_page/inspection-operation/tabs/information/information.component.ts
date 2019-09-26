import { Component, OnInit } from '@angular/core';
import * as appSettings from "tns-core-modules/application-settings";



@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.css'],
  moduleId: module.id,
})
export class InformationComponent implements OnInit {
  notificationNum:any;
  notificationDate:any;
  itpNum:any;
  itpDate:any;
  programNum:any;
  programDate:any;
  fromHour:any;
  toHour:any;
  product:any;

  constructor() { }

  ngOnInit() {
      let sanjeshData = JSON.parse(appSettings.getString('sanjeshData'));
          this.notificationNum=sanjeshData.notificationsCode;
          this.notificationDate=sanjeshData.updatedDateShamsi;
          this.itpNum=sanjeshData.code;
          this.itpDate=sanjeshData.itpDate;
          this.programNum=sanjeshData.code;
          this.programDate=sanjeshData.code;
          this.fromHour=sanjeshData.timeFrom;
          this.toHour=sanjeshData.timeTo;
          this.product=sanjeshData.productTitle;;
  }

}
