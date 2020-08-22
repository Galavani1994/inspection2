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
import {DatePipe} from "@angular/common";
import {InspectionReportChecklistModel} from "~/app/inspection-module/tabs/check-list-component/inspection-report-checklist.model";

var plugin = require("nativescript-uuid");
declare var main: any;

@Component({
    selector: 'check-list',
    templateUrl: './check-list.component.html',
    styleUrls: ['./check-list.component.css'],
    moduleId: module.id,
})
export class CheckListComponent implements OnInit {

    public resultItemCharachter = [];

    @Input()
    productId: number;

    @Input()
    productTitle: string;

    @Input()
    show: Boolean;

    @Input()
    itemCharTitle = [];

    itemDescription = "";

    private processing = false;

    checked = false;
    checkLists = [];
    sanjeshData = [];
    checkListTitle = [];
    itemCharIds = [];
    checkListIds = [];
    inspectionCheckListId = [];
    indexCheckList: number;
    indexitemChar: number;
    itemId: number;
    showCheckLsit = false;

    inspectionReportId: number;

    public inspectionReportcheckListList: InspectionReportChecklistModel[];
    public inspectionReportcheckList: InspectionReportChecklistModel = new InspectionReportChecklistModel();
    @Input()
    product: string;

    constructor(public checkListService: CheckListService,
                private modalService: ModalDialogService,
                private viewContainerRef: ViewContainerRef,
                private itemService: ItemsService,
                private questionsService: AnswerQuestionService,
                private datePipe: DatePipe) {
        this.sanjeshData = JSON.parse(appSettings.getString('sanjeshData'));
        // @ts-ignore
        this.inspectionReportId = this.sanjeshData.inspectionReport.id;

    }

    ngOnInit(): void {
        this.checkListTitle = [];
        this.checkListIds = [];
        this.checkLists = JSON.parse(appSettings.getString('sanjeshData')).inspectionCheckLists;

        for (let ch of this.checkLists) {
            this.checkListTitle.push(ch.checkListTitle);
            this.checkListIds.push(ch.checkListId);
            this.inspectionCheckListId.push(ch.id);
        }
        this.fetchItems();
        this.fetchChecklist();


    }

    fetchItems() {
        this.itemService.All("SELECT * FROM itemTbl e where e.inspectionReportId=" + this.inspectionReportId).then(rows => {
            this.resultItemCharachter = [];
            for (var row in rows) {
                this.resultItemCharachter.push({
                        id: rows[row][0],
                        values: JSON.parse(main.java.org.inspection.AES.decrypt(rows[row][1], appSettings.getString('dbKey'))),
                        description: rows[row][2]
                    }
                );

            }
        }, error => {
            console.log("SELECT ERROR", error);
        }).then(then => {
            this.itemCharTitle = [];
            this.itemCharIds = [];
            for (let character of this.resultItemCharachter) {
                var caracters = '';
                for (let characterValue of character.values) {
                    caracters += characterValue.title + ":" + characterValue.value + ',';
                }
                var str = null;
                str = caracters.substring(0, caracters.lastIndexOf(','));
                str = str + ", " + "شرح:" + character.description;
                this.itemCharTitle.push(str);
                this.itemCharIds.push(character.id);
            }
        });
    }

    public selectedIndexChangedItemChar(args) {
        let picker = <DropDown>args.object;
        this.inspectionReportcheckList.inspectionReportProductId = this.itemCharIds[picker.selectedIndex];
    }

    public selectedIndexChangedCheckList(args) {
        let picker = <DropDown>args.object;
        let checkListName = picker.items[picker.selectedIndex];
        let checkListId = this.checkListIds[picker.selectedIndex];
        let inspectionCheckListId = this.inspectionCheckListId[picker.selectedIndex];
        this.inspectionReportcheckList.checkListTitle = checkListName;
        this.inspectionReportcheckList.checkListId = checkListId;
        this.inspectionReportcheckList.inspectionCheckListId = inspectionCheckListId;

    }

    public displayIdentifyChars(id) {
        let options: ModalDialogOptions = {
            context: {},
            viewContainerRef: this.viewContainerRef,
        };
        this.itemService.All("select * from itemTbl where id=" + id).then(res => {
            options.context = JSON.parse(main.java.org.inspection.AES.decrypt(res[0][1], appSettings.getString('dbKey')))
        }, eerror => {
            console.log(error);
        });
        this.modalService.showModal(ItemModalComponent, options);
    }

    public delete(id) {

        dialogs.confirm({
            title: "پیغام حذف",
            message: "از حذف این آیتم مطمئن هستید؟",
            okButtonText: "بلی",
            cancelButtonText: "خیر"
        }).then(res => {
            if (res) {
                this.questionsService.excute("delete from  SGD_answerQuestionTbl  where inspectionReportChecklistId=" + id).then(total => {
                    console.log("deleteedQuestions");
                }, error => {
                    console.log("deleted ERROR", error);
                });
                this.checkListService.excute("delete from SGD_inspectionReportCheckList where id=" + id).then(de => {
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

    public answerToCheckList(inspectionChecklistId, inspectionReportCheckListId, inspectionReportId) {
        this.processing = true;
        let options: ModalDialogOptions = {
            context: {
                inspectionChecklistId: inspectionChecklistId,
                inspectionReportCheckListId: inspectionReportCheckListId,
                inspectionReportId: inspectionReportId
            },
            viewContainerRef: this.viewContainerRef,
            fullscreen: true
        };
        this.modalService.showModal(QuestionsModalComponent, options).then((data) => {

            this.processing = false;
        });
    }

    public save() {

        let date = Date.now();
        let currentDate = this.datePipe.transform(date, 'yyyy-MM-dd hh:mm:ss');
        let uuId = plugin.getUUID();

        if (this.inspectionReportcheckList.checkListId == null) {
            Toast.makeText(" چک لیست انتخاب نشده است.").show();
            return;
        }
        if (this.inspectionReportcheckList.inspectionReportProductId == null) {
            Toast.makeText("مشخصه ای انتخاب نشده است.").show();
            return;
        }
        this.fetchChecklist();
        this.checkListService.excute2("insert into SGD_inspectionReportCheckList(id ,checkListTitle,checkListId,inspectionReportProductId,inspectionReportId,inspectorId,inspectionDate,inspectionCheckListId,controllerFullName,manDayType) VALUES (?,?,?,?,?,?,?,?,?,?) ",
            [date.toString(), main.java.org.inspection.AES.encrypt(this.inspectionReportcheckList.checkListTitle, appSettings.getString('dbKey')), this.inspectionReportcheckList.checkListId, this.inspectionReportcheckList.inspectionReportProductId, this.inspectionReportId, appSettings.getNumber("inspectorControllerId"), currentDate.toString(), this.inspectionReportcheckList.inspectionCheckListId, main.java.org.inspection.AES.encrypt(appSettings.getString("inspectorFulName"), appSettings.getString('dbKey')), appSettings.getNumber("manDayType")]
        ).then(id => {
            Toast.makeText('ثبت شد').show();
            this.fetchChecklist();
        }, error => {
            console.log("INSERT ERROR", error);
        });
    }

    public fetchChecklist() {
        this.checkListService.All("SELECT * FROM SGD_inspectionReportCheckList ch  where ch.inspectionReportId=" + this.inspectionReportId).then(rows => {
            this.inspectionReportcheckListList = [];
            for (var row in rows) {
                this.inspectionReportcheckListList.push({
                        id: rows[row][0],
                        checkListTitle: main.java.org.inspection.AES.decrypt(rows[row][1], appSettings.getString('dbKey')),
                        checkListId: rows[row][2],
                        inspectionReportProductId: rows[row][3],
                        inspectionReportId: rows[row][4],
                        inspectorId: rows[row][5],
                        inspectionDate: rows[row][6],
                        inspectionCheckListId: rows[row][7],

                    }
                );
            }
            this.showCheckLsit = true;

        }, error => {
            console.log("SELECT ERROR", error);
        });

    }


}
