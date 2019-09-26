import {Component, OnInit} from '@angular/core';
import * as appSettings from "tns-core-modules/application-settings";


@Component({
    selector: 'app-standards',
    templateUrl: './standards.component.html',
    styleUrls: ['./standards.component.css'],
    moduleId: module.id,
})
export class StandardsComponent implements OnInit {

    standards = [];
    productTitle = JSON.parse(appSettings.getString('sanjeshData')).productTitle;

    constructor() {

    }

    ngOnInit() {
        this.standards = JSON.parse(appSettings.getString('sanjeshData')).inspectionStandards;
    }

}
