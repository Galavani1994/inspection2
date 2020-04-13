import {Component, EventEmitter, OnInit, Output} from "@angular/core";
import {InstanceModel} from "~/app/inspection-module/tabs/instanceComponent/instance.model";
import * as appSettings from "tns-core-modules/application-settings";
import {DropDown, SelectedIndexChangedEventData} from "nativescript-drop-down";

@Component({
    selector: 'instance-edit',
    templateUrl: './instance-edit.component.html',
    styleUrls: ['./instance-edit.component.css'],
    moduleId: module.id,
})
export class InstanceEditComponent implements OnInit {
    @Output()
    public toggleComponent = new EventEmitter<boolean>();
    public instanceList: InstanceModel[];
    public instance: InstanceModel;
    public sanjeshData = {};
    public examType = [];
    public examTypeId = [];

    public citiationReferencesLists = [];//مرجع استناد
    public citiationReferencesListsId = [];//مرجع استناد
    public inspectionLevelLists = [];//سطح بازرسی
    public inspectionLevelListsId = [];//سطح بازرسی
    constructor() {
        this.instance = new InstanceModel();
    }

    ngOnInit(): void {
        this.sanjeshData = JSON.parse(appSettings.getString('sanjeshData'));
        this.examType = [];
        this.citiationReferencesLists = [];
        this.inspectionLevelLists = [];
        // @ts-ignore
        for (let item_0 of this.sanjeshData.inspectionCheckLists) {
            for (let item_1 of item_0.checkList.checkListCategorys) {
                this.examType.push(item_1.checkListTitle + '-' + item_1.title);
                this.examTypeId.push(item_1.checkListId );
            }
        }
        // @ts-ignore
        for (let item_1 of this.sanjeshData.citiationReferencesLists) {
            this.citiationReferencesLists.push(item_1.topic);
            this.citiationReferencesListsId.push(item_1.id);
        }
        // @ts-ignore
        for (let item_2 of this.sanjeshData.inspectionLevelLists) {
            this.inspectionLevelLists.push(item_2.topic);
            this.inspectionLevelListsId.push(item_2.id);
        }
    }


    back() {
        this.toggleComponent.emit(false);
    }
    save(){
        console.log(this.instance);
    }
    selectedIndexInspectionLevel(args){
        let picker = <DropDown>args.object;
        this.instance.inspectionLevelId=this.inspectionLevelListsId[picker.selectedIndex];
        this.instance.inspectionLevel=this.inspectionLevelLists[picker.selectedIndex];
    }
    selectedIndexCitiationReferences(args){
        let picker = <DropDown>args.object;
        this.instance.citiationReferencesId=this.citiationReferencesListsId[picker.selectedIndex];
        this.instance.citiationReferences=this.citiationReferencesLists[picker.selectedIndex];
    }
    selectedIndexExamType(args){
        console.log('1',this.instance.examType);
        let picker = <DropDown>args.object;
        this.instance.examTypeId=this.examTypeId[picker.selectedIndex];
        this.instance.examType=this.examType[picker.selectedIndex];
        console.log('2',this.instance.examType);
    }


}
