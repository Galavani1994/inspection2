import { Component, OnInit } from '@angular/core';
import * as appSettings from "tns-core-modules/application-settings";

@Component({
  selector: 'app-equipments',
  templateUrl: './equipments.component.html',
  styleUrls: ['./equipments.component.css'],
  moduleId: module.id,
})
export class EquipmentsComponent implements OnInit {

  equipment=[];
  constructor() { }

  ngOnInit() {
    this.equipment=JSON.parse(appSettings.getString('sanjeshData')).inspectionEquipments;
  }

}
