import { Component, OnInit } from '@angular/core';

var data=require("~/app/product_file/703.json");
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
    this.equipment=data.inspectionEquipments;
  }

}
