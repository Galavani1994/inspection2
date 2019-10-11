import { Component, OnInit } from '@angular/core';
import {ModalDialogParams} from "nativescript-angular";

@Component({
  selector: 'app-item-modal',
  templateUrl: './item-modal.component.html',
  styleUrls: ['./item-modal.component.css'],
  moduleId: module.id,
})
export class ItemModalComponent implements OnInit {
 identifyCahrs={};
    constructor(private modalParams:ModalDialogParams) { }

    ngOnInit() {
        this.identifyCahrs=this.modalParams.context;
    }

}
