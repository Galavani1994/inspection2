import {Component, Input, OnInit} from "@angular/core";
import * as appSettings from "tns-core-modules/application-settings";


@Component({
    selector: 'equipment',
    templateUrl: './equipment.component.html',
    styleUrls:['./equipment.component.css'],
    moduleId: module.id,
})
export class EquipmentComponent implements OnInit {
    equipments = [];
    @Input()
    product:string;
    constructor() {

    }

    ngOnInit(): void {
        this.equipments = JSON.parse(appSettings.getString('sanjeshData')).inspectionEquipments;
    }





}
