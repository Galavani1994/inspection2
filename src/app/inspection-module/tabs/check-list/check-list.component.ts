import {
    AfterContentChecked,
    AfterViewChecked,
    Component,
    DoCheck,
    ElementRef,
    OnChanges,
    OnInit,
    SimpleChanges,
    ViewChild,
    ViewContainerRef
} from '@angular/core';

import {DropDown} from "nativescript-drop-down";
import {error} from "tns-core-modules/trace";
import {ModalDialogOptions, ModalDialogService} from "nativescript-angular/directives/dialogs";

import * as Toast from 'nativescript-toast';
import * as dialogs from "tns-core-modules/ui/dialogs";

import * as appSettings from "tns-core-modules/application-settings";
import {AnswerQuestionService} from "~/app/inspection-module/tabs/services/answerQuestion/answerQuestion.service";
import {ItemsService} from "~/app/inspection-module/tabs/services/items/items.service";
import {CheckListService} from "~/app/inspection-module/tabs/services/checkList/checkList.service";
import {ItemModalComponent} from "~/app/inspection-module/tabs/modals/item-modal/item-modal.component";
import {CheckListModalComponent} from "~/app/inspection-module/tabs/modals/check-list-modal/check-list-modal.component";


@Component({
    selector: 'app-check-list',
    templateUrl: './check-list.component.html',
    styleUrls: ['./check-list.component.css'],
    moduleId: module.id,
})
export class CheckListComponent implements OnInit {


    @ViewChild('CBB1', {static: false}) ACheckBox: ElementRef;
    @ViewChild('CBB2', {static: false}) BCheckBox: ElementRef;
    @ViewChild('CBB3', {static: false}) CCheckBox: ElementRef;
    @ViewChild('CBB4', {static: false}) DCheckBox: ElementRef;

    checked = false;
    unchecked = true;
    productTitles = [];
    productIds = [];
    inspectionItem = [];
    indexItem: number;
    selectedItemName='';
    checkLists = [];
    checkListTitle = [];
    checkListIds = [];
    indexCheckList: number;
    itemId: number;


    checkListItemVaue = {
        itemId: null,
        itemTitle: '',
        identifyCharId: null,
        checkListTitle: '',
        checkListId: null,
        points: null
    };

    show = false;
    showCheckLsit = false;
    proTitle = '';
    proId = '';
    productId = '';
    public resultItemChsrschter: Array<any>;
    public resultCheckList: Array<any>;
    public itemCharacter = [];
    allow = false;

    constructor(public itemService: ItemsService, public checkListService: CheckListService,
                private modalService: ModalDialogService,
                private viewContainerRef: ViewContainerRef, private answerQuestionService: AnswerQuestionService) {
        console.log('checkListtttttttttttttt');
        this.itemService;
        this.checkListService;

    }

    ngOnInit() {

        this.inspectionItem = JSON.parse(appSettings.getString('sanjeshData')).inspectionOperationItems;
        for (let item of this.inspectionItem) {
            this.productTitles.push(item.productTitle);
            this.productIds.push(item.productId);
        }
        this.checkLists = JSON.parse(appSettings.getString('sanjeshData')).inspectionCheckLists;
        for (let ch of this.checkLists) {
            this.checkListTitle.push(ch.checkListTitle);
            this.checkListIds.push(ch.checkListId);
        }
        if (appSettings.getBoolean('isSelectdItemProduct')) {

            this.selectedItemName=this.inspectionItem[appSettings.getNumber('selectdItemIndex')].productTitle;
            this.proId=this.inspectionItem[appSettings.getNumber('selectdItemIndex')].productId;
            this.fetch();

        }


    }

    genCols(item) {
        let columns = "100,100,100";
        item.forEach((el) => {
            columns += ",100";
        })
        return columns
    }

    genRows(item) {
        let rows = "*";
        item.forEach((el) => {
            rows += ",*";
        })
        return rows;
    }

    genCheckListRows(item) {
        let rows = "*";
        if (typeof item != "undefined") {
            item.forEach((el) => {
                rows += ",*";
            })
        }

        return rows
    }

    dataBoundVariable = '';

    public checkedTbl(args) {
        // this.checkBoxx.nativeElement.checked=false;
        this.checkListItemVaue.identifyCharId = args;
    }

    checkExistCheckListProduct():Promise<number>{
        return new Promise((resolve, reject)=>{
            this.answerQuestionService.All("SELECT COUNT(*) FROM checkListTbl e where e.checkList="+ JSON.stringify(this.checkListItemVaue)).then(total=>{

                resolve(total[0][0])
            },error=>{
                console.log("count ERROR", error);
                reject(-1);
            });
        });

    }
    public checkListSave(el) {

        if (this.checkListItemVaue.itemId == null || this.checkListItemVaue.checkListId == null) {
            Toast.makeText("محصول / چک لیست انتخاب نشده است.").show();
            return;
        }
        if (this.checkListItemVaue.identifyCharId == null ) {
            Toast.makeText("مشخصه ای انتخاب نشده است.").show();
            return;
        }
        //this.checkExistCheckListProduct();
        this.checkListService.excute2("insert into checkListTbl(checkList) VALUES (?) ", [JSON.stringify(this.checkListItemVaue)]).then(id => {
            Toast.makeText('ثبت شد').show();
            this.fetchChecklist();
        }, error => {
            console.log("INSERT ERROR", error);
        });
    }

    public deleteTable() {
        this.checkListService.excute("DROP TABLE checkListTbl").then(de => {
            Toast.makeText("جدول مورد نظر حذف شد").show();
        }, error => {
            console.log('errore is...', error);
        });
    }

    public createTable() {
        this.checkListService;
    }

    public fetch() {
        this.itemService.All("SELECT * FROM itemTbl e where e.productId=" + this.proId).then(rows => {
            this.resultItemChsrschter = [];
            for (var row in rows) {
                this.resultItemChsrschter.push({
                        id: rows[row][0],
                        values: JSON.parse(rows[row][1]),
                        productId: rows[row][3]
                    }
                );

            }
            console.log('it is ok', this.resultItemChsrschter);
        }, error => {
            console.log("SELECT ERROR", error);
        });

        this.show = true;

    }

    public fetchChecklist() {
        this.checkListService.All("SELECT * FROM checkListTbl").then(rows => {
            this.resultCheckList = [];
            for (var row in rows) {
                this.resultCheckList.push({
                        id: rows[row][0],
                        values: JSON.parse(rows[row][1])
                    }
                );
            }
            this.showCheckLsit = true;

        }, error => {
            console.log("SEeLECT ERROR", error);
        });

    }

    public deleteCheklist(id) {
        dialogs.confirm({
            title: "پیغام حذف",
            message: "از حذف این آیتم مطمئن هستید؟",
            okButtonText: "بلی",
            cancelButtonText: "خیر"
        }).then(res => {
            if (res) {
                this.checkListService.excute("delete from checkListTbl where id=" + id).then(de => {
                    Toast.makeText("deleted succesfully....").show();
                }, error => {
                    console.log('errore is...', error);
                });
                this.fetchChecklist();
            }
        })


    }

    public selectedIndexChanged(args) {
        let picker = <DropDown>args.object;
        let itemName = picker.items[picker.selectedIndex];
        let itemId = this.productIds[picker.selectedIndex];
        this.checkListItemVaue.itemTitle = itemName;
        this.checkListItemVaue.itemId = itemId;

        this.itemCharacter = [];
        let titleIndex = this.inspectionItem.findIndex(obj => obj.productTitle == itemName);
        for (let it of this.inspectionItem[titleIndex].identifyCharacters) {
            this.proId = it.productId;
            this.proTitle = it.productTitle;
            this.itemCharacter.push(
                {title: it.title, value: "", productName: it.productTitle, productId: it.productId}
            );
        }
        //this.allow = true;
        this.fetch();
    }

    public selectedIndexChangedCheckList(args) {
        let picker = <DropDown>args.object;
        let checkListName = picker.items[picker.selectedIndex];
        let checkListId = this.checkListIds[picker.selectedIndex];
        this.checkListItemVaue.checkListTitle = checkListName;
        this.checkListItemVaue.checkListId = checkListId;

    }

    public displayIdentifyChars(id) {
        let options: ModalDialogOptions = {
            context: {},
            viewContainerRef: this.viewContainerRef,
        };
        this.itemService.All("select * from itemTbl where id=" + id).then(res => {
            options.context = JSON.parse(res[0][1])
        }, eerror => {
            console.log(error);
        });
        this.modalService.showModal(ItemModalComponent, options);
    }

    public checklListQuestion(res) {
        let options: ModalDialogOptions = {
            context: res,
            viewContainerRef: this.viewContainerRef,
            fullscreen: true
        };
        this.modalService.showModal(CheckListModalComponent, options);

    }

    public toggleCheck() {
        this.ACheckBox.nativeElement.toggle();
        this.BCheckBox.nativeElement.toggle();
        this.CCheckBox.nativeElement.toggle();
        this.DCheckBox.nativeElement.toggle();
    }

    public getCheckProp() {
        console.log(
            'checked prop value = ' + this.ACheckBox.nativeElement
        );
        console.log(
            'checked prop value = ' + this.BCheckBox.nativeElement
        );
        console.log(
            'checked prop value = ' + this.CCheckBox.nativeElement
        );
        console.log(
            'checked prop value = ' + this.DCheckBox.nativeElement
        );
        this.DCheckBox.nativeElement.checked = false;
    }


}
