import {Component, ElementRef, Input, OnInit, ViewChild} from "@angular/core";
import {CSVRecord} from "~/app/inspection-module/tabs/instanceInfoComponent/CSVRecord .model";
import {IdentifyCharacter} from "~/app/inspection-module/tabs/instanceInfoComponent/identify-character.model";
import {Item} from "~/app/inspection-module/tabs/itemComponent/item.model";
import {InstanceInfoService} from "~/app/inspection-module/tabs/instanceInfoComponent/instanceInfo.service";
import {ItemsService} from "~/app/inspection-module/tabs/services/items/items.service";
import {InstanceService} from "~/app/inspection-module/tabs/instanceComponent/instance.service";
import {ModalDialogParams} from "nativescript-angular";
import * as appSettings from "tns-core-modules/application-settings";

@Component({
    selector: 'instance-edit',
    templateUrl: './citiation-references-grid.component.html',
    moduleId: module.id,
})
export class CitiationReferencesGridComponent implements OnInit {
    ngOnInit(): void {
    }









}
