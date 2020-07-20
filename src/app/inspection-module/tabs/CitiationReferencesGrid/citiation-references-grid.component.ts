import {Component, OnInit} from "@angular/core";
import * as appSettings from "tns-core-modules/application-settings";
import {CitiationModel} from "~/app/inspection-module/tabs/CitiationReferencesGrid/citiation.model";
import {ModalDialogParams, ModalDialogService} from "nativescript-angular";

@Component({
    selector: 'instance-edit',
    templateUrl: './citiation-references-grid.component.html',
    moduleId: module.id,
})
export class CitiationReferencesGridComponent implements OnInit {

    citiationReferencesLists_: CitiationModel[] = [];
    citiationReferencesLists: CitiationModel[] = [];
    lists: CitiationModel[] = [];

    constructor(private dialogParams: ModalDialogParams,
                private dialogService: ModalDialogService) {
        this.addToModel();
    }

    ngOnInit(): void {
        this.citiationReferencesLists_ = this.citiationReferencesLists;
    }

    addToModel() {
        for (let item of JSON.parse(appSettings.getString('sanjeshData')).citiationReferencesLists) {
            this.citiationReferencesLists.push({content: item, isChecked: false})
        }
    }

    searchCitiation(args): any {
        this.autocomplete(args).then(a => {
            if (args.value.length == 0) {
                this.citiationReferencesLists_ = this.citiationReferencesLists;
            }
            if (args.value.length > 0) {
                this.citiationReferencesLists_ = this.lists
            }

        });
    }

    autocomplete(args): Promise<boolean> {
        this.lists = [];
        return new Promise<boolean>((resolve, error) => {
            for (let item of this.citiationReferencesLists) {
                if (item.content.topic.includes(args.value)) {
                    this.lists.push(item);
                }
            }
            resolve(true);
        })
    }

    selectedCitiation() {
        let selectedRecords=[];
        for (let item of this.citiationReferencesLists_){
            if (item.isChecked==true){
                selectedRecords.push(item);
            }
        }
       this.dialogParams.closeCallback(selectedRecords);
    }


}
