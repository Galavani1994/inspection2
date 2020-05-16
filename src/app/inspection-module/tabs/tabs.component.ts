import {Component, OnInit, ViewContainerRef} from '@angular/core';
import * as appSettings from "tns-core-modules/application-settings";
import {DropDown} from "nativescript-drop-down";
import {ItemsService} from "~/app/inspection-module/tabs/services/items/items.service";
import * as Toast from "nativescript-toast";
import * as dialogs from "tns-core-modules/ui/dialogs";
import {CheckListService} from "~/app/inspection-module/tabs/services/checkList/checkList.service";
import {ModalDialogOptions, ModalDialogService} from "nativescript-angular";
import {AnswerQuestionService} from "~/app/inspection-module/tabs/services/answerQuestion/answerQuestion.service";
import {error} from "tns-core-modules/trace";
import {ItemModalComponent} from "~/app/inspection-module/tabs/modals/item-modal/item-modal.component";
import {QuestionsModalComponent} from "~/app/inspection-module/tabs/modals/check-list-modal/questions-modal.component";


@Component({
    selector: 'app-tabs',
    templateUrl: './tabs.component.html',
    styleUrls: ['./tabs.component.css'],
    moduleId: module.id,
})
export class TabsComponent implements OnInit {

    productTitle: string;
    productId: number;
///////////////////TAB_NAME//////////////////
    isSampling = false;
    info = true;
    item = false;
    instanceInfo = false;
    instance = false;
    checklist = false;
    standard = false;
    equipment = false;
    checked = false;

    sanjeshData = [];

    constructor(
        private itemService: ItemsService,
        public checkListService: CheckListService,
        private modalService: ModalDialogService,
        private viewContainerRef: ViewContainerRef,
        private questionsService: AnswerQuestionService) {

        this.sanjeshData = JSON.parse(appSettings.getString('sanjeshData'));
        // @ts-ignore
        this.productId = this.sanjeshData.productId;
        // @ts-ignore
        this.productTitle = this.sanjeshData.productTitle;

    }

    ngOnInit() {
        // @ts-ignore
        if (this.sanjeshData.notificationInspectionType == 0) {
            this.isSampling = false
        } else {
            this.isSampling = true;
        }
    }


    changeStatus(event) {
        if (event == 'info') {
            this.info = true;
            this.item = false;
            this.instanceInfo = false
            this.instance = false;
            this.checklist = false;
            this.standard = false;
            this.equipment = false;
        }
        if (event == 'item') {
            this.info = false;
            this.item = true;
            this.instanceInfo = false
            this.instance = false;
            this.checklist = false;
            this.standard = false;
            this.equipment = false;

        }
        if (event == 'instanceInfo') {
            this.info = false;
            this.item = false;
            this.instanceInfo = true;
            this.instance = false;
            this.checklist = false;
            this.standard = false;
            this.equipment = false;
        }
        if (event == 'instance') {
            this.info = false;
            this.item = false;
            this.instanceInfo = false
            this.instance = true;
            this.checklist = false;
            this.standard = false;
            this.equipment = false;
        }
        if (event == 'checkList') {
            this.info = false;
            this.item = false;
            this.instanceInfo = false
            this.instance = false;
            this.checklist = true;
            this.standard = false;
            this.equipment = false;

        }
        if (event == 'standard') {
            this.info = false;
            this.item = false;
            this.instanceInfo = false
            this.instance = false;
            this.checklist = false;
            this.standard = true;
            this.equipment = false;

        }
        if (event == 'equipment') {
            this.info = false;
            this.item = false;
            this.instanceInfo = false
            this.instance = false;
            this.checklist = false;
            this.standard = false;
            this.equipment = true;

        }
    }
}
