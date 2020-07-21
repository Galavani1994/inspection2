import {Component, Input, OnInit} from "@angular/core";
import * as appSettings from "tns-core-modules/application-settings";


@Component({
    selector: 'standard',
    templateUrl: './standard.component.html',
    styleUrls:['./standard.component.css'],
    moduleId: module.id,
})
export class StandardComponent implements OnInit {
    standards = [];
    @Input()
    product:string;
    constructor() {

    }

    ngOnInit(): void {
        this.standards = JSON.parse(appSettings.getString('sanjeshData')).inspectionStandards;
    }





}
