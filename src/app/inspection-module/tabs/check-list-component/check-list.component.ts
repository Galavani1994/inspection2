import {Component, Input, OnInit, ViewContainerRef} from "@angular/core";
import * as appSettings from "tns-core-modules/application-settings";
import {CheckListService} from "~/app/inspection-module/tabs/services/checkList/checkList.service";
import {ModalDialogOptions, ModalDialogService} from "nativescript-angular";
import {QuestionsModalComponent} from "~/app/inspection-module/tabs/modals/check-list-modal/questions-modal.component";
import {error} from "tns-core-modules/trace";
import {ItemModalComponent} from "~/app/inspection-module/tabs/modals/item-modal/item-modal.component";
import {ItemsService} from "~/app/inspection-module/tabs/services/items/items.service";
import * as dialogs from "tns-core-modules/ui/dialogs";
import {AnswerQuestionService} from "~/app/inspection-module/tabs/services/answerQuestion/answerQuestion.service";
import * as Toast from "nativescript-toast";
import {DropDown} from "nativescript-drop-down";


@Component({
    selector: 'check-list',
    templateUrl: './check-list.component.html',
    styleUrls:['./check-list.component.css'],
    moduleId: module.id,
})
export class CheckListComponent implements OnInit {

    public resultItemCharachter=[];

    @Input()
    productId:number;

    @Input()
    productTitle:string;

    @Input()
    show:Boolean;

    @Input()
    itemCharTitle = [];

    itemDescription="";

    private processing=false;

    checked = false;
    checkLists = [];
    sanjeshData=[];
    checkListTitle = [];
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
    @Input()
    product:string;
    constructor(public checkListService: CheckListService,
                private modalService: ModalDialogService,
                private viewContainerRef: ViewContainerRef,
                private itemService: ItemsService,
                private questionsService: AnswerQuestionService) {

    }

    ngOnInit(): void {
        this.checkListTitle = [];
        this.checkListIds = [];
        this.checkLists = JSON.parse(appSettings.getString('sanjeshData')).inspectionCheckLists;

        for (let ch of this.checkLists) {
            this.checkListTitle.push(ch.checkListTitle);
            this.checkListIds.push(ch.checkListId);
        }
        this.fetchItems();
        this.fetchChecklist();



    }
    fetchItems(){
        this.itemService.All("SELECT * FROM itemTbl e where e.productId=" + this.productId).then(rows => {
            this.resultItemCharachter = [];
            for (var row in rows) {
                this.resultItemCharachter.push({
                        id: rows[row][0],
                        values: JSON.parse(rows[row][1]),
                        description:rows[row][2]
                    }
                );

            }
        }, error => {
            console.log("SELECT ERROR", error);
        }).then(then=>{
            this.itemCharTitle=[];
            this.itemCharIds=[];
            for(let character of this.resultItemCharachter){
                var caracters='';
                for(let characterValue of character.values){
                    caracters+=characterValue.title+":"+characterValue.value+',';
                }
                var str=null;
                str=caracters.substring(0,caracters.lastIndexOf(','));
                str=str+", "+"شرح:"+character.description;
                this.itemCharTitle.push(str);
                this.itemCharIds.push(character.id);
            }
        });
    }
    public selectedIndexChangedItemChar(args){
        let picker = <DropDown>args.object;
        this.checkListItemValue.identifyCharId=this.itemCharIds[picker.selectedIndex];
    }
    public selectedIndexChangedCheckList(args) {
        let picker = <DropDown>args.object;
        let checkListName = picker.items[picker.selectedIndex];
        let checkListId = this.checkListIds[picker.selectedIndex];
        this.checkListItemValue.checkListTitle = checkListName;
        this.checkListItemValue.checkListId = checkListId;
        this.checkListItemValue.itemId = this.productId;
        this.checkListItemValue.itemTitle = this.productTitle;

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
    genCheckListRows(item) {
        let rows = "*";
        if (typeof item != "undefined") {
            item.forEach((el) => {
                rows += ",*";
            })
        }

        return rows
    }
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
    public checkListSave() {

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
        this.checkListService.excute2("insert into checkListTbl(checkList,checkListId,itemId,identifyCharId,inspectorId) VALUES (?,?,?,?,?) ",
            [JSON.stringify(this.checkListItemValue), this.checkListItemValue.checkListId, this.checkListItemValue.itemId, this.checkListItemValue.identifyCharId,54]
        ).then(id => {
            Toast.makeText('ثبت شد').show();
            this.fetchChecklist();
        }, error => {
            console.log("INSERT ERROR", error);
        });
    }
    public fetchChecklist() {
        this.checkListService.All("SELECT * FROM checkListTbl ch  where ch.itemId="+this.productId).then(rows => {
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
            console.log("SELECT ERROR", error);
        });

    }





}
