import {Component, OnInit} from '@angular/core';
import {ModalDialogParams} from "nativescript-angular";

@Component({
    selector: 'app-check-list-answer-photo',
    templateUrl: './check-list-answer-photo.component.html',
    styleUrls: ['./check-list-answer-photo.component.css'],
    moduleId: module.id,
})
export class CheckListAnswerPhotoComponent implements OnInit {


    constructor(private dialogParam: ModalDialogParams) {

    }
    transform(){
        return 'data:image/png;;base64,'+this.dialogParam.context;
    }

    ngOnInit() {
    }

}
