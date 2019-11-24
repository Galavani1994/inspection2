import {
    Component,
    DoCheck,
    ElementRef,
    OnChanges,
    OnInit,
    SimpleChanges,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import * as appSettings from "tns-core-modules/application-settings";
import {DropDown} from "nativescript-drop-down";
import {ItemsService} from "~/app/inspection-module/tabs/services/items/items.service";
import * as Toast from "nativescript-toast";
import * as dialogs from "tns-core-modules/ui/dialogs";
import {CheckListService} from "~/app/inspection-module/tabs/services/checkList/checkList.service";
import {ModalDialogOptions, ModalDialogParams, ModalDialogService} from "nativescript-angular";
import {AnswerQuestionService} from "~/app/inspection-module/tabs/services/answerQuestion/answerQuestion.service";
import {error} from "tns-core-modules/trace";
import {ItemModalComponent} from "~/app/inspection-module/tabs/modals/item-modal/item-modal.component";
import {QuestionsModalComponent} from "~/app/inspection-module/tabs/modals/check-list-modal/questions-modal.component";
import {bindCallback} from "rxjs";


@Component({
    selector: 'app-tabs',
    templateUrl: './tabs.component.html',
    styleUrls: ['./tabs.component.css'],
    moduleId: module.id,
})
export class TabsComponent implements OnInit {

///////////////////TAB_NAME//////////////////
    isSampling = false;
    info = true;
    item = false;
    instanceInfo = false;
    instance = false;
    checklist = false;
    standard = false;
    equipment = false;
    /////////////////////////////////////////////
    ///////////////////////////infoPart////////////////
    notificationNum: any;
    notificationDate: any;
    itpNum: any;
    itpDate: any;
    programNum: any;
    programDate: any;
    fromHour: any;
    toHour: any;
    product: any;
    ///////////////////////////////////////////////////
    //////////////////////////////itemPart/////////////
    public resultItemChsrschter: Array<any>;
    id: number = 0;
    newId: number;
    update = false;
    inspectionItem = [];
    productTitles = [];
    identifyCharacters = [];
    public itemCharacter = [];
    public selectedIndex = 0;
    public index: number;
    allow = false;
    show = false;
    proTitle = '';
    proId = '';
    productId = '';
    public mainId: number;
    columns: string = "auto,auto,auto,auto";
    ///////////////////////////////////////////////////
    ////////////////////////checkListPart///////////////
    checked = false;
    unchecked = true;
    productIds = [];
    indexItem: number;
    selectedItemName = '';
    checkLists = [];
    checkListTitle = [];
    itemCharTitle = [];
    itemCharIds = [];
    checkListIds = [];
    indexCheckList: number;
    indexitemChar: number;
    itemId: number;
    showCheckLsit = false;
    public resultCheckList: Array<any>;
    checkListItemValue = {
        itemId: null,
        itemTitle: '',
        identifyCharId: null,
        checkListTitle: '',
        checkListId: null,
        points: null
    };
    ///////////////////////////////////////////////////
    /////////////////////STANDARD/////////////////////

    standards = [];

    /////////////////////////////////////////////////////
    //////////////////////////EQUIPMENT/////////////////

    equipmentTabValue = [];

    ////////////////////////////////////////////////////

    constructor(
        private itemService: ItemsService,
        public checkListService: CheckListService,
        private modalService: ModalDialogService,
        private viewContainerRef: ViewContainerRef,
        private questionsService: AnswerQuestionService) {

        this.itemService;
        this.checkListService;
        this.questionsService;
    }

    ngOnInit() {
        let sanjeshData = JSON.parse(appSettings.getString('sanjeshData'));
        this.notificationNum = sanjeshData.notificationsCode;
        this.notificationDate = sanjeshData.updatedDateShamsi;
        this.itpNum = sanjeshData.code;
        this.itpDate = sanjeshData.itpDate;
        this.programNum = sanjeshData.code;
        this.programDate = sanjeshData.code;
        this.fromHour = sanjeshData.timeFrom;
        this.toHour = sanjeshData.timeTo;
        this.product = sanjeshData.productTitle;
        if (sanjeshData.notificationInspectionType == 0) {
            this.isSampling = false
        } else {
            this.isSampling = true;
        }

        this.ngOnInitItem();
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
            this.ngOnInitCheckList();
        }
        if (event == 'standard') {
            this.info = false;
            this.item = false;
            this.instanceInfo = false
            this.instance = false;
            this.checklist = false;
            this.standard = true;
            this.equipment = false;
            this.ngOnInitStandard();
        }
        if (event == 'equipment') {
            this.info = false;
            this.item = false;
            this.instanceInfo = false
            this.instance = false;
            this.checklist = false;
            this.standard = false;
            this.equipment = true;
            this.ngOnInitEQUIPMENT();
        }
    }

    ngOnInitItem() {
        this.productTitles = [];
        this.inspectionItem = JSON.parse(appSettings.getString('sanjeshData')).inspectionOperationItems;
        for (let item of this.inspectionItem) {
            this.productTitles.push(item.productTitle);
        }
    }

    ngOnInitCheckList() {
        this.checkListTitle = [];
        this.checkListIds = [];
        this.checkLists = JSON.parse(appSettings.getString('sanjeshData')).inspectionCheckLists;
        for (let ch of this.checkLists) {
            this.checkListTitle.push(ch.checkListTitle);
            this.checkListIds.push(ch.checkListId);
        }
        this.fetchChecklist();
        console.log(this.resultItemChsrschter);
        this.itemCharTitle=[];
        for(let character of this.resultItemChsrschter){
            var caracters='';
            for(let characterValue of character.values){
                caracters+=characterValue.title+":"+characterValue.value+',';
            }
            this.itemCharTitle.push(caracters);
            this.itemCharIds.push(character.id);
        }

    }

    ngOnInitStandard() {
        this.standards = JSON.parse(appSettings.getString('sanjeshData')).inspectionStandards;
    }

    ngOnInitEQUIPMENT() {
        this.equipment = JSON.parse(appSettings.getString('sanjeshData')).inspectionEquipments;
    }

    genCols(item) {
        let columns = "100 ,100 ";
        item.forEach((el) => {
            columns += ",100 ";
        })
        return columns
    }

    genRows(item) {
        let rows = "*";
        item.forEach((el) => {
            rows += ",*";
        })
        return rows
    }


    public clearData() {
        for (let i of this.itemCharacter) {
            i.value = '';
        }
    }


    public selectedIndexChanged(args) {
        let picker = <DropDown>args.object;
        let itemName = picker.items[picker.selectedIndex];
        let itemId = null;
        if (itemName != 0) {
            this.itemCharacter = [];
            let titleIndex = this.inspectionItem.findIndex(obj => obj.productTitle == itemName);
            for (let it of this.inspectionItem[titleIndex].identifyCharacters) {
                this.proId = it.productId;
                itemId = it.productId;
                this.proTitle = it.productTitle;
                this.itemCharacter.push(
                    {title: it.title, value: "", productName: it.productTitle, productId: it.productId}
                );
            }
            this.allow = true;
            this.fetch();
            this.proId = itemId;
            this.proTitle = itemName;
        } else {
            this.allow = false;
        }
    }

    public fetch() {
        this.itemService.All("SELECT * FROM itemTbl e where e.productId=" + this.proId).then(rows => {
            this.resultItemChsrschter = [];
            for (var row in rows) {
                this.resultItemChsrschter.push({
                        id: rows[row][0],
                        values: JSON.parse(rows[row][1])
                    }
                );

            }
        }, error => {
            console.log("SELECT ERROR", error);
        });

        this.show = true;
    }

    public insert() {
        if(this.itemCharacter.find(x=>x.value=="")!=undefined){
            Toast.makeText("همه فیلدها باید مقدار دهی شوند").show();
            return false;
        }
        if (this.update == false && this.newId == null) {
            this.itemService.excute2("INSERT INTO itemTbl (productCharacter,productName,productId) VALUES (?,?,?)", [JSON.stringify(this.itemCharacter), this.proTitle, this.proId]).then(id => {
                Toast.makeText('ثبت شد').show();
                console.log("INSERT RESULT", id);
            }, error => {
                console.log("INSERT ERROR", error);
            });
        } else {
            this.itemService.excute2("update itemTbl set productCharacter= ? WHERE id=?", [JSON.stringify(this.itemCharacter), this.newId]).then(id => {
                Toast.makeText('ویرایش  شد').show();
                console.log("updateed RESULT", id);
            }, error => {
                console.log("update ERROR", error);
            });
        }
        this.fetch();
        this.clearData();
        this.update = false;
        this.newId = null;
    }

    delete(id) {
        dialogs.confirm({
            title: "پیغام حذف",
            message: "از حذف این آیتم مطمئن هستید؟",
            okButtonText: "بلی",
            cancelButtonText: "خیر"
        }).then(res => {
            if (res) {
                if (this.update) {
                    alert('ابتدا عملیات ویرایش را تمام کنید');
                } else {
                    this.checkListService.All("select count(*) from checkListTbl t where t.identifyCharId="+id).then(result=>{
                        if(result[0][0]==0){
                            this.itemService.excute("DELETE FROM  itemTbl WHERE id=" + id).then(de => {
                                Toast.makeText("رکورد موردنظر باموفقیت حذف شد").show();
                            }, error => {
                                console.log('errore is....', error);
                            });
                            this.fetch();
                        }else {
                            Toast.makeText("برای این مشخصه در چک لیست مقدار ثبت شده است").show();
                        }
                    },error=>{
                        console.log("message error is..."+error);
                    });

                }

            }
        })

    }

    edit(id) {
        this.newId = id;
        this.update = true;
        this.itemService.All("select * FROM  itemTbl WHERE id=" + id).then(de => {
            this.itemCharacter = JSON.parse(de[0][1]);
        }, error => {
            console.log('errore is...', error);
        });
    }

    public selectedIndexChangedCheckList(args) {
        let picker = <DropDown>args.object;
        let checkListName = picker.items[picker.selectedIndex];
        let checkListId = this.checkListIds[picker.selectedIndex];
        this.checkListItemValue.checkListTitle = checkListName;
        this.checkListItemValue.checkListId = checkListId;
        this.checkListItemValue.itemId = this.proId;
        this.checkListItemValue.itemTitle = this.proTitle;

    }
    public selectedIndexChangedItemChar(args){
        let picker = <DropDown>args.object;
        this.checkListItemValue.identifyCharId=this.itemCharIds[picker.selectedIndex];
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

    private processing=false;
    public answerToCheckList(res) {
        this.processing=true;
        let options: ModalDialogOptions = {
            context: res,
            viewContainerRef: this.viewContainerRef,
            fullscreen: true
        };
        this.modalService.showModal(QuestionsModalComponent, options).then((data)=>{

            this.processing=false;
        });
    }

    public checkListSave(el) {

        if (this.checkListItemValue.checkListId == null) {
            Toast.makeText(" چک لیست انتخاب نشده است.").show();
            return;
        }
        if (this.checkListItemValue.identifyCharId == null) {
            Toast.makeText("مشخصه ای انتخاب نشده است.").show();
            return;
        }
        this.fetchChecklist();
        let isExisist = this.resultCheckList.findIndex(a => a.checkListId == this.checkListItemValue.checkListId && a.itemId == this.checkListItemValue.itemId && a.identifyCahrId == this.checkListItemValue.identifyCharId)
        if(isExisist>=0){
            Toast.makeText("چنین رکرودی ثبت شده است").show();
            return;
        }
        this.checkListService.excute2("insert into checkListTbl(checkList,checkListId,itemId,identifyCharId) VALUES (?,?,?,?) ",
            [JSON.stringify(this.checkListItemValue), this.checkListItemValue.checkListId, this.checkListItemValue.itemId, this.checkListItemValue.identifyCharId]
        ).then(id => {
            Toast.makeText('ثبت شد').show();
            this.fetchChecklist();
        }, error => {
            console.log("INSERT ERROR", error);
        });
    }

    public fetchChecklist() {
        this.checkListService.All("SELECT * FROM checkListTbl ch  where ch.itemId="+this.proId).then(rows => {
            this.resultCheckList = [];
            for (var row in rows) {
                this.resultCheckList.push({
                        id: rows[row][0],
                        values: JSON.parse(rows[row][1]),
                        checkListId: rows[row][2],
                        itemId: rows[row][3],
                        identifyCahrId: rows[row][4]
                    }
                );
            }
            this.showCheckLsit = true;

        }, error => {
            console.log("SEeLECT ERROR", error);
        });

    }

    public checkedTbl(args) {
        this.checkListItemValue.identifyCharId = args;
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

    public deleteCheklist(ch) {

       dialogs.confirm({
            title: "پیغام حذف",
            message: "از حذف این آیتم مطمئن هستید؟",
            okButtonText: "بلی",
            cancelButtonText: "خیر"
        }).then(res => {
            if (res) {
                this.questionsService.excute("delete from  answerQuestionTbl  where checkListId="+ ch.checkListId+" and itemId="+ch.itemId+" and identifyCharId="+ch.identifyCahrId).then(total=>{
                    console.log("deleteedQuestions");
                },error=>{
                    console.log("deleted ERROR", error);
                });
                this.checkListService.excute("delete from checkListTbl where id=" + ch.id).then(de => {
                    Toast.makeText("رکورد موردنظر حذف شد").show();
                }, error => {
                    console.log('errore is...', error);
                });

                this.fetchChecklist();
            }
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
}
