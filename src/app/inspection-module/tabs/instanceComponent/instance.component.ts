import {Component, EventEmitter, OnInit, Output, ViewChild} from "@angular/core";
import {InstanceModel} from "~/app/inspection-module/tabs/instanceComponent/instance.model";
import * as appSettings from "tns-core-modules/application-settings";
import {DropDown, SelectedIndexChangedEventData} from "nativescript-drop-down";
import {InstanceService} from "~/app/inspection-module/tabs/instanceComponent/instance.service";
import * as Toast from "nativescript-toast";
import {clear} from "tns-core-modules/application-settings";
import {GestureEventData} from "tns-core-modules/ui/gestures";
import * as dialogs from "tns-core-modules/ui/dialogs";


@Component({
    selector: 'instance',
    templateUrl: './instance.component.html',
    styleUrls: ['./instance-edit.component.css'],
    moduleId: module.id,
})
export class InstanceComponent implements OnInit {
    @ViewChild("examTypeDropDown", {static: false}) examTypeDropDown;
    @ViewChild("citiationReferencesDropDown", {static: false}) citiationReferencesDropDown;
    @ViewChild("inspectionLevelDropDown", {static: false}) inspectionLevelDropDown;

    public instanceList: InstanceModel[];
    public instance: InstanceModel;
    public selectedInstance: InstanceModel;
    displayInstanceEdit = false;

    public citiationReferencesLists = [];//مرجع استناد
    public citiationReferencesListsId = [];//مرجع استناد
    public inspectionLevelLists = [];//سطح بازرسی
    public inspectionLevelListsId = [];//سطح بازرسی
    constructor(private instanceService: InstanceService) {
        this.instance = new InstanceModel();
        this.selectAll();
    }

    ngOnInit(): void {

    }

    instanceEdit(instance) {
        if(instance==null){
            this.selectedInstance=new InstanceModel();
        }else {
            this.selectedInstance=instance;
        }
        this.displayInstanceEdit = true;
    }


    reload() {
        this.selectAll();
    }

    goInstanceGrid(state: boolean) {
        this.displayInstanceEdit = state;
        this.selectAll();
    }

    onLongPress(args:  GestureEventData) {
        console.log(args);
        console.log(args);
    }
    genRows(item) {
        let rows = "*";
        if (typeof item != "undefined") {
            item.forEach((el) => {
                rows += ",*";
            })
        }

        return rows
    }

    delete(id){
        dialogs.confirm({
            title: "پیغام حذف",
            message: "از حذف این آیتم مطمئن هستید؟",
            okButtonText: "بلی",
            cancelButtonText: "خیر"
        }).then(res=>{
            if(res){
                this.instanceService.excute("delete from instacneTbl  where id="+id).then(id => {
                    Toast.makeText("رکورد موردنظر حذف شد").show();
                }, error => {
                    console.log('errore is...', error);
                });
                this.selectAll();
            }
        });

    }
    selectAll() {
        this.instanceService.All("SELECT * FROM instacneTbl ins ").then(rows => {
            this.instanceList = [];
            let instance_:InstanceModel;
            for (var row of rows) {
                instance_=JSON.parse(row[1]);
                instance_.id=row[0];
                this.instanceList.push(
                    instance_
                );
            }

        }, error => {
            console.log("SELECT ERROR", error);
        });
    }

    selectedIndexInspectionLevel(args) {
        let picker = <DropDown>args.object;
        this.instance.inspectionLevelId = this.inspectionLevelListsId[picker.selectedIndex];
        this.instance.inspectionLevel = this.inspectionLevelLists[picker.selectedIndex];
    }

    selectedIndexCitiationReferences(args) {
        let picker = <DropDown>args.object;
        this.instance.citiationReferencesId = this.citiationReferencesListsId[picker.selectedIndex];
        this.instance.citiationReferences = this.citiationReferencesLists[picker.selectedIndex];
    }

    clearForm() {
        this.instance = new InstanceModel();
        this.examTypeDropDown.nativeElement.selectedIndex = null;
        this.citiationReferencesDropDown.nativeElement.selectedIndex = null;
        this.inspectionLevelDropDown.nativeElement.selectedIndex = null;
    }


}
