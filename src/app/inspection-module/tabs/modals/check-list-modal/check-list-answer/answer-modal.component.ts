import {Component, ElementRef, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {ModalDialogParams, ModalDialogService} from "nativescript-angular";
import {DropDown, ValueList} from "nativescript-drop-down";
import * as camera from "nativescript-camera";

import * as Toast from 'nativescript-toast';


import {ImageSource} from "tns-core-modules/image-source";

import * as dialogs from "tns-core-modules/ui/dialogs";
import {AnswerQuestionService} from "~/app/inspection-module/tabs/services/answerQuestion/answerQuestion.service";
import {CheckListAnswerPhotoComponent} from "~/app/inspection-module/tabs/modals/check-list-modal/check-list-answer-photo/check-list-answer-photo.component";
import {QuestionfaulttableService} from "~/app/inspection-module/tabs/services/faultTbl/questionfaulttable.service";
import * as appSettings from "tns-core-modules/application-settings";
import {DefectiveSamplesComponent} from "~/app/inspection-module/tabs/modals/check-list-modal/defectiveSamples/defective-samples.component";
import {InstanceInfoGridComponent} from "~/app/inspection-module/tabs/instanceInfoComponent/instance-info-grid.component";

@Component({
    selector: 'app-check-list-answer',
    templateUrl: './answer-modal.component.html',
    styleUrls: ['./answer-modal.component.css'],
    moduleId: module.id,
})
export class AnswerModalComponent implements OnInit {

    picName = 'نام فایل';
    isSample = false;

    ////////////////////////////MAIN_INFO_QUESTION///////////
    checkListIdOnload = -1;
    itemIdOnload = -1;
    identifyCharIdOnload = -1;
    perirityMobOnload = -1;
    ////////////////////////////////////////////////////////
    describtion = "";
    scoreFrom = null;
    scoreTo = null;
    textAnswer = "";
    scoreNum = null;
    itemShow = false;
    scoreShow = false;
    textShow = false;
    choiceOfanswerForItemStatus = [];
    choiceOfanswerForItemStatusId = [];
    answerchoiceStatus = ['.....', 'انطباق', 'عدم انطباق', 'عدم قضاوت', 'عدم کاربرد', 'بازرسی مجدد'];
    answerchoiceFault = ['....'];/*آیتم های عیب*/
    questionFaultIds = ['....',];/*آی دی آیتم های عیب(checklist>checkListCategorys>questions>questionFaults>id)*/
    answerchoiceTroubleshooting = ['....'];/*آیتم های رفع عیب*/
    answerchoiceTroubleshootingId = ['....'];/*آی دی آیتم های رفع عیب*/
    answerIndex = 0;
    statusIndex = 0;
    faultIndex = 0;
    troubleshootingIndex = 0;
    displayNonCompliance = false;
    questionWithAnswer = {};/*زمانی که پاسخ دهی را میزند سوال و جواب ها اگر پرشده یاشند دراین قرار می گیرد*/
    questionFualtTable = [];
    insReportChecklistId = null;

    groupingTopic = [];
    groupingIds = [];
    groupingIndex = 0;

    assortTopic = [];
    assortIds = [];
    assortIndex = 0;

    defectResolveTopic = [];
    defectResolveIds = [];
    defectResolveIndex = 0;


    presencePlace = "";/*محل وقوع*/
    repeatCount = "";

    defectiveSamples=[];

    assort = null;/*طبقه بندی*/
    assortId = null;/*آی دی طبقه بندی*/

    grouping = null;/*گروه بندی*/
    groupingId = null;/*آی دی گروه بندی*/


    ///////////////////////AnswerQuestionFault////////
    fault = null;/*عیب*/
    questionFaultId = null;/*آی دی عیب*/
    faultId = -1;

    defectResolve = null;/*رفع عیب*/
    defectResolveIndexNum = null;/*آی دی رفع عیب*/


    answerQuestionFualtPhoto = null;/*تصویر خطا*/

    ////////////////////////////////////////////////

    sanjeshData = [];
    defectiveSampleNameBtn='انتخاب نمونه های معیوب(لمس کنید)';

    constructor(private dialogParams: ModalDialogParams, private dialogService: ModalDialogService, private viewContainerRef: ViewContainerRef,
                private answerQuestionService: AnswerQuestionService,
                private faultTableService: QuestionfaulttableService) {

        this.loadData(this.dialogParams.context);
        this.loadGroupAndSortAndDefectResolveLists();
        this.sanjeshData = JSON.parse(appSettings.getString('sanjeshData'));
        // @ts-ignore
        if (this.sanjeshData.notificationInspectionType == 1) {
            this.isSample = true;
        }

    }

    ngOnInit() {


    }

    loadGroupAndSortAndDefectResolveLists() {
        let groupList = [];
        let assortList = [];
        let ResolveList = [];
        groupList = JSON.parse(appSettings.getString('sanjeshData')).groupingLists;
        assortList = JSON.parse(appSettings.getString('sanjeshData')).assortLists;
        ResolveList = JSON.parse(appSettings.getString('sanjeshData')).defectResolveLists;

        this.groupingTopic = ['...'];
        this.groupingIds = ['...'];

        this.assortTopic = ['...'];
        this.assortIds = ['...'];

        this.defectResolveTopic = ['...'];
        this.defectResolveIds = ['...'];

        groupList.forEach(item => {
            this.groupingTopic.push(item.topic);
            this.groupingIds.push(item.id);
        });
        assortList.forEach(item => {
            this.assortTopic.push(item.topic);
            this.assortIds.push(item.id);
        });
        ResolveList.forEach(item => {
            this.defectResolveTopic.push(item.persianTitle);
            this.defectResolveIds.push(item.index);
        });

    }

    public loadData(data) {
        this.questionWithAnswer = data;
        this.checkListIdOnload = data.checkListId;
        this.itemIdOnload = data.itemId;
        this.identifyCharIdOnload = data.identifyCharId;
        this.perirityMobOnload = data.periorityMob;
        this.insReportChecklistId = data.inspectionReportChecklistId;
        // @ts-ignore
        for (let fault of this.questionWithAnswer.content.questionFaults) {
            this.answerchoiceFault.push(fault.faultTitle);
            this.questionFaultIds.push(fault.id);
        }
        // @ts-ignore
        switch (this.questionWithAnswer.content.structur) {
            case 0:/*چندگزینه ای*/
                this.itemShow = true;
                this.scoreShow = false;
                this.textShow = false;

                this.choiceOfanswerForItemStatus = ['....'];
                this.choiceOfanswerForItemStatusId = ['....'];
                // @ts-ignore
                for (let choice of this.questionWithAnswer.content.choices) {
                    this.choiceOfanswerForItemStatus.push(choice.value);
                    this.choiceOfanswerForItemStatusId.push(choice.id);
                }

                break;
            case 1:/*بازه ای*/
                this.itemShow = false;
                this.scoreShow = true;
                this.textShow = false;
                // @ts-ignore
                this.scoreFrom = this.questionWithAnswer.content.scoreFrom;
                // @ts-ignore
                this.scoreTo = this.questionWithAnswer.content.scoreTo;
                // @ts-ignore
                this.scoreNum = this.questionWithAnswer.content.answer;
                break;
            case 2:/*متنی*/
                this.itemShow = false;
                this.scoreShow = false;
                this.textShow = true;
                // @ts-ignore
                this.textAnswer = this.questionWithAnswer.content.answer;
                break;
        }

        this.setAnswers();
    }

    public nextQuestion(periority) {
        this.loadByPeriorityQuestion((periority + 1));
    }

    public previousQuestion(periority) {
        this.loadByPeriorityQuestion((periority - 1));
    }

    public loadByPeriorityQuestion(number) {
        this.answerQuestionService.All("SELECT * FROM SGD_answerQuestionTbl e where e.inspectionReportChecklistId=" + this.insReportChecklistId + " and e.periorityMob=" + number).then(rows => {
            if (rows.length > 0) {
                this.loadData({
                    id: rows[0][0],
                    content: JSON.parse(rows[0][1]),
                    inspectionReportChecklistId: rows[0][2],
                    periorityMob: rows[0][3]
                });
            } else {
                Toast.makeText("سوالی برای پاسخ دادن وجود ندارد").show();
            }

        }, error => {
            console.log("SELECT ERROR", error);
        });
    }

    public setAnswers() {
        // @ts-ignore
        this.answerIndex = this.choiceOfanswerForItemStatus.findIndex(obj => obj == this.questionWithAnswer.content.answer);/*ایندکس پاسخی را پیدا می کند که برای ان دردیتابیس پر شده است*/
        // @ts-ignore
        this.statusIndex = this.answerchoiceStatus.findIndex(obj => obj == this.questionWithAnswer.content.statusPersianTitle);
        this.statusIndex == 2 ? this.displayNonCompliance = true : this.displayNonCompliance = false;
        // @ts-ignore
        this.describtion = this.questionWithAnswer.content.describtion;

        this.fetchQuestionFaultTbl();
    }

    public selectedIndexAnswer(args) {
        let picker = <DropDown>args.object;
        if (picker.selectedIndex != 0) {
            // @ts-ignore
            this.questionWithAnswer.content.answer = picker.items[picker.selectedIndex];
            // @ts-ignore
            this.questionWithAnswer.content.choiceId = this.choiceOfanswerForItemStatusId[picker.selectedIndex];
        } else {
            // @ts-ignore
            this.questionWithAnswer.content.answer = '-';
            // @ts-ignore
            this.questionWithAnswer.content.choiceId = -1;
        }
    }

    genRows(item) {
        let rows = "*,*";
        item.forEach((el) => {
            rows += ",*";
        })
        return rows
    }

    public selectedIndexStatus(args) {
        let picker = <DropDown>args.object;
        if (picker.selectedIndex != 0) {
            // @ts-ignore
            this.questionWithAnswer.content.statusPersianTitle = picker.items[picker.selectedIndex];
            // @ts-ignore
            this.questionWithAnswer.content.status = picker.selectedIndex - 1;
            if (picker.selectedIndex == 2) {
                this.displayNonCompliance = true;
                this.fetchQuestionFaultTbl();
            } else {
                this.displayNonCompliance = false;
            }
        } else {
            // @ts-ignore
            this.questionWithAnswer.content.statusPersiaTitle = '-';
            this.displayNonCompliance = false;

        }

    }

    selectedIndexDefect(args) {
        let picker = <DropDown>args.object;
        if (picker.selectedIndex != 0) {
            this.fault = picker.items[picker.selectedIndex];
            this.questionFaultId = this.questionFaultIds[picker.selectedIndex];
        } else {
            this.fault = null;
            this.questionFaultId = null;
        }
    }

    selectedIndexDefectResolveTopic(args) {
        let picker = <DropDown>args.object;
        if (picker.selectedIndex != 0) {
            this.defectResolve = picker.items[picker.selectedIndex];
            this.defectResolveIndexNum = this.defectResolveIds[picker.selectedIndex];
        } else {
            this.defectResolve = null;
            this.defectResolveIndexNum = null;
        }
    }

    selectedIndexGrouping(args) {
        let picker = <DropDown>args.object;
        if (picker.selectedIndex != 0) {
            this.grouping = picker.items[picker.selectedIndex];
            this.groupingId = this.groupingIds[picker.selectedIndex];
        } else {
            this.grouping = null;
        }
    }

    selectedIndexAssort(args) {
        let picker = <DropDown>args.object;
        if (picker.selectedIndex != 0) {
            this.assort = picker.items[picker.selectedIndex];
            this.assortId = this.assortIds[picker.selectedIndex];
        } else {
            this.assort = null;
        }
    }

    public takePicture() {

        let that = this;
        const options = {
            saveToGallery: false
        };
        camera.requestPermissions().then(
            function success() {
                camera.takePicture(options).then((imageAsset) => {
                    let source = new ImageSource();

                    let itemsStr = [];
                    // @ts-ignore
                    itemsStr = imageAsset._android.split("/");
                    that.picName = itemsStr[itemsStr.length - 1];
                    source.fromAsset(imageAsset).then((source) => {

                        let base64 = source.toBase64String("png", 60);
                        // @ts-ignore
                        that.answerQuestionFualtPhoto = base64;
                    }).catch(
                        (error) => {
                            console.log("Error -> " + error.message);
                        }
                    );
                }).catch((err) => {
                    console.log("Error -> " + err.message);
                });
            },
            function failure() {
                console.log('denied ***');
            }
        );


    }


    save() {
        var allowToStore = false;
        // @ts-ignore
        switch (this.questionWithAnswer.content.structur) {

            case 0: /*چندگزینه ای*/
                if (!(this.answerIndex == 0) && !(this.statusIndex == 0)) {
                    allowToStore = true;
                } else {
                    Toast.makeText("جواب / وضعیت باید انتخاب شوند").show();
                }
                break;
            case 1:/*بازه ای*/
                if (!(this.scoreNum == null) && !(this.statusIndex == 0)) {
                    allowToStore = true;
                    // @ts-ignore
                    this.questionWithAnswer.content.answer = this.scoreNum;

                } else {
                    Toast.makeText("جواب / وضعیت باید مقداردهی  شوند").show();
                }
                // @ts-ignore
                this.scoreFrom = this.questionWithAnswer.content.scoreFrom;
                // @ts-ignore
                this.scoreTo = this.questionWithAnswer.content.scoreTo;
                break;

            case 2:/*متنی*/
                if (!(this.textAnswer == null) && !(this.statusIndex == 0)) {
                    allowToStore = true;
                    // @ts-ignore
                    this.questionWithAnswer.content.answer = this.textAnswer;
                } else {
                    Toast.makeText("جواب / وضعیت باید مقداردهی شوند").show();
                }
                break;

        }
        if (allowToStore) {

            // @ts-ignore
            this.questionWithAnswer.content.isAnswered = true;
            // @ts-ignore
            this.questionWithAnswer.content.describtion = this.describtion;

            // @ts-ignore
            this.questionWithAnswer.content.assorting = this.assort;
            // @ts-ignore
            this.questionWithAnswer.content.assortingId = this.assortId;

            // @ts-ignore
            this.questionWithAnswer.content.grouping = this.grouping;
            // @ts-ignore
            this.questionWithAnswer.content.groupingId = this.groupingId;
            // @ts-ignore
            this.questionWithAnswer.content.presencePlace = this.presencePlace;
            // @ts-ignore
            this.questionWithAnswer.content.repeatCount = this.repeatCount;


            // @ts-ignore
            this.answerQuestionService.excute2("update SGD_answerQuestionTbl  set answerQuestion=? where  id=? ", [JSON.stringify(this.questionWithAnswer.content), this.questionWithAnswer.id]).then(id => {
                Toast.makeText('پاسخ شما ثبت شد').show();
            }, error => {
                console.log("update ERROR", error);
            });

        }
    }

    public closeModal() {
        this.dialogParams.closeCallback();
    }

    getImage(src) {
        let option = {context: src, viewContainerRef: this.viewContainerRef, fullscreen: false}
        this.dialogService.showModal(CheckListAnswerPhotoComponent, option);
    }

    /*
     افزودن عیب های سوال
     */

    insertDefectAnswer() {
        const faultInfo = {
            questionFaultId: this.questionFaultId,
            faultTitle: this.fault,
            defectResolveIndex: this.defectResolveIndexNum,
            defectResolveTitle: this.defectResolve,
            groupingId: this.groupingId,
            grouping: this.grouping,
            assortId: this.assortId,
            assorting: this.assort,
            presencePlace: this.presencePlace,
            repeatCount: this.repeatCount,
            defectoveSamples:this.defectiveSamples

        };
        if ((faultInfo.questionFaultId == null) || (faultInfo.defectResolveIndex == null)) {
            Toast.makeText('فیلد های اجباری پر نشده اند!!!!').show();
            return;
        } else {
            if (this.faultId == -1) {
                // @ts-ignore
                this.faultTableService.excute2("insert into QuestionFaultTbl(faultInfo,imgStr,questionId) VALUES (?,?,?) ", [JSON.stringify(faultInfo), this.answerQuestionFualtPhoto, this.questionWithAnswer.id]
                ).then(id => {
                    Toast.makeText('ثبت شد').show();
                    this.picName = 'نام فایل';
                    this.fetchQuestionFaultTbl();
                    this.clear();
                }, error => {
                    console.log("INSERT ERROR", error);
                });
            } else {
                // @ts-ignore
                this.faultTableService.excute2("update QuestionFaultTbl  set faultInfo=? where id=? ", [JSON.stringify(faultInfo), this.faultId]
                ).then(id => {
                    Toast.makeText('بروزرسانی شد').show();
                    this.faultId = -1;
                    this.picName = 'نام فایل';
                    this.fetchQuestionFaultTbl();
                    this.clear();
                }, error => {
                    console.log("INSERT ERROR", error);
                });
            }

        }


    }

    selectDefectiveSamples() {

        let option = {
            context: {
                eventName:'answerModal',
                // @ts-ignore
                checkListCategoryId:this.questionWithAnswer.content.checkListCategoryId
            },
            viewContainerRef: this.viewContainerRef,
            fullscreen: false
        };
        this.dialogService.showModal(InstanceInfoGridComponent, option).then(result=>{
            this.defectiveSamples=result;
            this.defectiveSampleNameBtn=this.defectiveSamples.length+' نمونه انتخاب شده است'
        });
    }

    fetchQuestionFaultTbl() {
        // @ts-ignore
        this.faultTableService.All("select * from QuestionFaultTbl f where f.questionId= " + this.questionWithAnswer.id).then(rows => {

            this.questionFualtTable = [];
            for (let row of rows) {
                this.questionFualtTable.push({
                    id: row[0],
                    faultInfo: JSON.parse(row[1]),
                    answerQuestionFualtPhoto: row[2],
                    questionId: row[3]
                });

            }

        }, error => {
            console.log("error is:" + error);
        });
    }

    deleteDefectAnswer(id) {
        dialogs.confirm({
            title: "پیغام حذف",
            message: "از حذف این آیتم مطمئن هستید؟",
            okButtonText: "بلی",
            cancelButtonText: "خیر"
        }).then(res => {
            if (res) {
                this.faultTableService.excute("delete from QuestionFaultTbl where id=" + id).then(id => {
                    Toast.makeText("رکورد پاک شد").show();
                    this.fetchQuestionFaultTbl();
                }, error => {
                    console.log("error ...." + error);
                });
            }
        })


    }

    edit(entity) {

        const faultInfo = {
            questionFaultId: this.questionFaultId,
            faultTitle: this.fault,
            defectResolveIndex: this.defectResolveIndexNum,
            defectResolveTitle: this.defectResolve,
            groupingId: this.groupingId,
            grouping: this.grouping,
            assortId: this.assortId,
            assorting: this.assort,
            presencePlace: this.presencePlace,
            repeatCount: this.repeatCount

        };

        this.faultId = entity.id;
        this.assortIndex = this.assortIds.findIndex(obj => obj == entity.faultInfo.assortId);
        this.groupingIndex = this.groupingIds.findIndex(obj => obj == entity.faultInfo.groupingId);
        this.defectResolveIndex = this.defectResolveIds.findIndex(obj => obj == entity.faultInfo.defectResolveIndex)
        this.faultIndex = this.questionFaultIds.findIndex(obj => obj == entity.faultInfo.questionFaultId);

        this.fault = entity.faultInfo.faultTitle;
        this.questionFaultId = entity.faultInfo.questionFaultId;

        this.defectResolveIndexNum = entity.faultInfo.defectResolveIndex;
        this.defectResolve = entity.faultInfo.defectResolveTitle;

        this.groupingId = entity.faultInfo.groupingId;
        this.grouping = entity.faultInfo.grouping;

        this.assortId = entity.faultInfo.assortId;
        this.assort = entity.faultInfo.assorting;

        this.presencePlace = entity.faultInfo.presencePlace;
        this.repeatCount = entity.faultInfo.repeatCount;
    }

    clear() {
        this.assortIndex = 0;
        this.groupingIndex = 0;
        this.defectResolveIndex = 0;
        this.faultIndex = 0;
        this.presencePlace = null;
        this.repeatCount = null;

    }
}
