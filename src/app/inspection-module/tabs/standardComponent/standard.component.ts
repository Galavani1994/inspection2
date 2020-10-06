import {Component, Input, OnInit, ViewContainerRef} from "@angular/core";
import * as appSettings from "tns-core-modules/application-settings";
import {ModalDialogService} from "nativescript-angular";
import {File} from "tns-core-modules/file-system";
import * as  base64 from "base-64";
import * as utf8 from "utf8";
import * as Toast from 'nativescript-toast';
import {CheckListAnswerPhotoComponent} from "~/app/inspection-module/tabs/modals/check-list-modal/check-list-answer-photo/check-list-answer-photo.component";

declare var main: any;



@Component({
    selector: 'standard',
    templateUrl: './standard.component.html',
    styleUrls: ['./standard.component.css'],
    moduleId: module.id,
})
export class StandardComponent implements OnInit {
    standards = [];
    @Input()
    product: string;

    constructor(private dialogService: ModalDialogService,
                private viewContainerRef: ViewContainerRef) {

    }

    ngOnInit(): void {
        this.standards = JSON.parse(appSettings.getString('sanjeshData')).inspectionStandards;
    }

    displayFile(srcFile, fileType,filename) {
        if (fileType.toLowerCase()=="pdf"){
            let filePath = '/storage/emulated/0/SGD/'+filename+'';
            main.java.org.inspection.Base64Util.getBytFromBase64(srcFile,filePath)
            Toast.makeText("فایل انتخابی در مسیر " + "/storage/emulated/0/SGD/" + "دانلود شد").show();
        }else {
            let option = {context: srcFile, viewContainerRef: this.viewContainerRef, fullscreen: false}
            this.dialogService.showModal(CheckListAnswerPhotoComponent, option);
        }



    }


}
