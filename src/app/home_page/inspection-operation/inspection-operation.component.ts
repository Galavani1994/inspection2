import {Component, OnInit} from '@angular/core';
import {FilePickerOptions, Mediafilepicker} from "nativescript-mediafilepicker";
import {File} from "tns-core-modules/file-system";
import * as appSettings from "tns-core-modules/application-settings";

import * as  base64 from "base-64";
import * as utf8 from "utf8";
import {AnswerQuestionService} from "~/app/inspection-module/tabs/services/answerQuestion/answerQuestion.service";
import {QuestionfaulttableService} from "~/app/inspection-module/tabs/services/faultTbl/questionfaulttable.service";
import {DatePipe} from "@angular/common";
import * as Toast from 'nativescript-toast';
import {ItemsService} from "~/app/inspection-module/tabs/services/items/items.service";
import {CheckListService} from "~/app/inspection-module/tabs/services/checkList/checkList.service";
import {RouterExtensions} from "nativescript-angular";
import {InstanceModel} from "~/app/inspection-module/tabs/instanceComponent/instance.model";
import {InstanceService} from "~/app/inspection-module/tabs/instanceComponent/instance.service";
import {InstanceInfoService} from "~/app/inspection-module/tabs/instanceInfoComponent/instanceInfo.service";
import {CSVRecord} from "~/app/inspection-module/tabs/instanceInfoComponent/CSVRecord .model";
import {Router} from "@angular/router";

declare var org: any;

@Component({
    selector: 'app-inspection-operation',
    templateUrl: './inspection-operation.component.html',
    styleUrls: ['./inspection-operation.component.css'],
    moduleId: module.id,
})

export class InspectionOperationComponent implements OnInit {

    text: string;
    data = [];
    questionFualtTable = [];
    questionIds = [];
    mainFile = [];


    fileTitle = '';
    itemList = [];
    instanceList = [];
    public inspectionReportItem: CSVRecord[] = [];
    resultCheckList = [];
    inspectionReportId: number;
    sanjeshData: any;

    constructor(private answerQuService: AnswerQuestionService,
                private itemService: ItemsService,
                private instanceService: InstanceService,
                private instanceInfoService: InstanceInfoService,
                public checkListService: CheckListService,
                private faultTableService: QuestionfaulttableService,
                private datePipe: DatePipe,
                private routerExtensions: RouterExtensions,
                private router: Router) {
    }

    ngOnInit() {

    }

    exite(){
        appSettings.clear();
        this.router.navigateByUrl('/home');
    }
    getInspectorInfo() {
        let inspectorObjIndex = this.sanjeshData.inspectorReports.findIndex(obj =>
            obj.controllerNationalCode == appSettings.getString('nationalCode') && obj.controllerCode==appSettings.getString('inspectorCode') &&
            obj.manDayTypeTitle==appSettings.getString('manDayType')
        );
        if (inspectorObjIndex > -1) {
            let inspector = this.sanjeshData.inspectorReports[inspectorObjIndex];
            appSettings.setNumber("inspectorId", inspector.id);
            appSettings.setNumber("inspectorControllerId", inspector.controllerId);
            appSettings.setString("inspectorFulName", inspector.controllerFullName);
            Toast.makeText("سلام  " + inspector.controllerFullName).show();
            this.inspectionReportId = this.sanjeshData.inspectionReport.id;
        } else {
            Toast.makeText("بازرس مجاز نیست").show();
            this.sanjeshData = null;
            appSettings.setString('sanjeshData', null);
            return;
        }
    }

    get_data() {
        this.get_datas().then(result => {
            this.sanjeshData = JSON.parse(appSettings.getString('sanjeshData'));
        }).then(a => {
            this.getInspectorInfo();
        });
    }

    get_datas(): Promise<boolean> {
        let extensions = ['sgd'];
        let options: FilePickerOptions = {
            android: {
                extensions: extensions,
                maxNumberFiles: 1
            },
            ios: {
                extensions: extensions,
                multipleSelection: true
            }
        };
        let mediafilepicker = new Mediafilepicker();
        mediafilepicker.openFilePicker(options);

        return new Promise<boolean>((resolve, reject) => {
            mediafilepicker.on("getFiles", (res) => {
                let file = File.fromPath(res.object.get('results')[0].file);
                let thats = this;
                file.readText()
                    .then((result) => {

                        /* var decoded = base64.decode(result);
                         var decodeToUtf8 = utf8.decode(decoded)*/
                        appSettings.setString('sanjeshData', result);
                        resolve(true);
                    });


            });
            mediafilepicker.on("error", function (res) {
                let msg = res.object.get('msg');
                reject(false);
                console.log(msg);
            });

            mediafilepicker.on("cancel", function (res) {
                let msg = res.object.get('msg');
                console.log(msg);
                reject(false);
            });


        })
    }

    public sendData() {
        let that = this;

        if (this.inspectionReportId > 0) {
            this.inspectionReportId = this.sanjeshData.inspectionReport.id;
            this.fetchAnswerQu().then((id) => {

                let date = Date.now();
                this.fileTitle = this.datePipe.transform(date, 'yyyy-MM-dd hh:mm:ss');

                this.getFaultTbl(this.questionIds);
                this.getItem();
                this.getCheckList();
                this.getInstance();
                this.getInstanceInfo();

            }).then(function () {
                that.mainFile = [];
                that.mainFile.push({
                    checkListAnswers: {checkListAnswer: that.data, faults: that.questionFualtTable},
                    inspectionReportProduct: that.itemList,
                    inspectionReportCheckList: that.resultCheckList,
                    inspectionReportItem: that.inspectionReportItem,
                    instanceList: that.instanceList
                })
                let file = File.fromPath("/storage/emulated/0/SGD/export/" + that.fileTitle + "/content.esgd");
                file.writeText(JSON.stringify(that.mainFile)).then(() => {
                    Toast.makeText("فایل محتوا در مسیر " + "/storage/emulated/0/SGD/export/" + "ذخیره شده است").show();
                });

            });
        } else {
            Toast.makeText('گزارشی انتخاب نشده است!!!').show();
        }

    }

    public fetchAnswerQu(): Promise<boolean> {
        let username = appSettings.getString('username');
        let password = appSettings.getString('password');
        return new Promise<boolean>((resolve, reject) => {
            this.answerQuService.All("SELECT * FROM SGD_answerQuestionTbl where inspectionReportId=" + this.sanjeshData.inspectionReport.id).then((rows) => {
                this.data = [];
                for (let row of rows) {
                    this.questionIds.push(row[0]);
                    this.data.push({
                        mobId: row[0],
                        checkListAnswerQuestion: JSON.parse(row[1]),
                        inspectionReportChecklistMobId: row[2]
                    });
                }

                resolve(true);
            });
        })

    }

    getItem() {
        this.itemService.All("SELECT * FROM itemTbl e where e.inspectionReportId=" + this.inspectionReportId).then(rows => {
            this.itemList = [];
            for (var row in rows) {
                this.itemList.push({
                        mobId: rows[row][0],
                        productCharacteristic: JSON.parse(rows[row][1]),
                        description: rows[row][2],
                        inspectionReportId: rows[row][3]
                    }
                );

            }
        }, error => {
            console.log("SELECT ERROR", error);
        });
    }

    getInstance() {
        this.instanceService.All("SELECT * FROM instacneTbl ins where ins.inspectionReportId=" + this.inspectionReportId).then(rows => {
            this.instanceList = [];
            let instance_: InstanceModel;
            for (var row of rows) {
                instance_ = JSON.parse(row[1]);
                instance_.id = row[0];
                this.instanceList.push(
                    instance_
                );
            }

        }, error => {
            console.log("SELECT ERROR", error);
        });
    }

    getInstanceInfo() {
        this.instanceInfoService.All("SELECT * FROM SGD_inspection_report_item ch  where ch.inspectionReportId=" + this.inspectionReportId).then(rows => {
            this.inspectionReportItem = [];
            for (var row in rows) {
                this.inspectionReportItem.push({
                        id: rows[row][0],
                        contentValue: JSON.parse(rows[row][1]),
                        isChecked: rows[row][3]
                    }
                );

            }
        }, error => {
            console.log("SELECT ERROR", error);
        });
    }

    goInspectionOperation() {
        if (this.sanjeshData != null) {
            this.routerExtensions.navigate(['/tabs']);
        } else {
            Toast.makeText("فایلی انتخاب نشده است.").show();
        }
    }

    public getCheckList() {
        this.checkListService.All("SELECT * FROM SGD_inspectionReportCheckList where inspectionReportId=" + this.inspectionReportId).then(rows => {
            this.resultCheckList = [];
            for (var row in rows) {
                this.resultCheckList.push({
                        mobId: rows[row][0],
                        inspectionReportProductMobId: rows[row][3],
                        inspectionReportId: rows[row][4],
                        controllerId: rows[row][5],
                        inspectionDate: rows[row][6],
                        inspectionCheckListId: rows[row][7],
                        controllerFullName: rows[row][8],
                    }
                );
            }

        }, error => {
            console.log("SELECT ERROR", error);
        });

    }

    public getFaultTbl(questionId) {
        /* this.faultTableService.All("select * from QuestionFaultTbl f where f.questionId in(" + questionId + ") ").then(items => {
             if (items.length > 0) {
                 this.questionFualtTable = [];
                 for (let item of items) {
                     this.questionFualtTable.push({
                         id: item[0],
                         defect: item[1],
                         defectId: item[2],
                         defectResolveIndex: item[3],
                         defectResolve: item[4],
                         answerQuestionFualtPhoto: item[5],
                         checkListAnswerMobId: item[6]
                     });
                 }
             }

         }, error => {
             console.log("error is:" + error);
         });*/
        // @ts-ignore
        this.faultTableService.All("select * from QuestionFaultTbl f where f.questionId in(" + questionId + ") ").then(rows => {

            this.questionFualtTable = [];
            for (let row of rows) {
                this.questionFualtTable.push({
                    id: row[0],
                    faultInfo: JSON.parse(row[1]),
                    answerQuestionFualtPhoto: row[2],
                    checklsitAnswerMobId: row[3]
                });

            }

        }, error => {
            console.log("error is:" + error);
        });
    }


}
