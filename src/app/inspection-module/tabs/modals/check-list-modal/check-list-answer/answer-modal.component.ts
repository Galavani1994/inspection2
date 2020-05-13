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

@Component({
    selector: 'app-check-list-answer',
    templateUrl: './answer-modal.component.html',
    styleUrls: ['./answer-modal.component.css'],
    moduleId: module.id,
})
export class AnswerModalComponent implements OnInit {

    picName='نام فایل';

    ////////////////////////////MAIN_INFO_QUESTION///////////
    checkListIdOnload=-1;
    itemIdOnload=-1;
    identifyCharIdOnload=-1;
    perirityMobOnload=-1;
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
    answerchoiceStatus = ['.....', 'انطباق', 'عدم انطباق', 'عدم قضاوت', 'عدم کاربرد', 'بازرسی مجدد'];
    answerchoiceFault = ['....'];/*آیتم های عیب*/
    answerchoiceFaultId=['....',];/*آی دی آیتم های عیب*/
    answerchoiceTroubleshooting = ['....'];/*آیتم های رفع عیب*/
    answerchoiceTroubleshootingId = ['....'];/*آی دی آیتم های رفع عیب*/
    answerIndex = 0;
    statusIndex = 0;
    faultIndex = 0;
    troubleshootingIndex = 0;
    displayNonCompliance = false;
    questionWithAnswer = {};/*زمانی که پاسخ دهی را میزند سوال و جواب ها اگر پرشده یاشند دراین قرار می گیرد*/
    questionFualtTable = [];
    questionFualtTable_raw = [];

    groupingTopic=[];
    groupingIds=[];
    groupingIndex=0;

    assortTopic=[];
    assortIds=[];
    assortIndex=0;

    defectResolveTopic=[];
    defectResolveIds=[];
    defectResolveIndex=0;


    estenad="";
    repeatedTime="";

    assort = null;/*طبقه بندی*/
    assortId = null;/*آی دی طبقه بندی*/

    grouping = null;/*گروه بندی*/
    groupingId = null;/*آی دی گروه بندی*/


    ///////////////////////AnswerQuestionFault////////
    defect = null;/*عیب*/
    defectId = null;/*آی دی عیب*/

    defectResolve = null;/*رفع عیب*/
    defectResolveIndexNum = null;/*آی دی رفع عیب*/


    answerQuestionFualtPhoto = null;/*تصویر خطا*/
    ////////////////////////////////////////////////


    constructor(private dialogParams: ModalDialogParams, private dialogService: ModalDialogService, private viewContainerRef: ViewContainerRef,
                private answerQuestionService: AnswerQuestionService,
                private faultTableService:QuestionfaulttableService) {

        this.loadData(this.dialogParams.context);
        this.loadGroupAndSortAndDefectResolveLists();

    }

    ngOnInit() {


    }
    loadGroupAndSortAndDefectResolveLists(){
        let groupList=[];
        let assortList=[];
        let ResolveList=[];
        groupList = JSON.parse(appSettings.getString('sanjeshData')).groupingLists;
        assortList = JSON.parse(appSettings.getString('sanjeshData')).assortLists;
        ResolveList = JSON.parse(appSettings.getString('sanjeshData')).defectResolveLists;

        this.groupingTopic=['...'];
        this.groupingIds=['...'];

        this.assortTopic=['...'];
        this.assortIds=['...'];

        this.defectResolveTopic=['...'];
        this.defectResolveIds=['...'];

        groupList.forEach(item=>{
            this.groupingTopic.push(item.topic);
            this.groupingIds.push(item.id);
        });
        assortList.forEach(item=>{
            this.assortTopic.push(item.topic);
            this.assortIds.push(item.id);
        });
        ResolveList.forEach(item=>{
            this.defectResolveTopic.push(item.persianTitle);
            this.defectResolveIds.push(item.index);
        });

    }
    public loadData(data){
        this.questionWithAnswer = data;
        this.checkListIdOnload=data.checkListId;
        this.itemIdOnload=data.itemId;
        this.identifyCharIdOnload=data.identifyCharId;
        this.perirityMobOnload=data.periorityMob;
        // @ts-ignore
        for (let fault of this.questionWithAnswer.content.questionFaults) {
            this.answerchoiceFault.push(fault.faultTitle);
            this.answerchoiceFaultId.push(fault.faultId);
        }
        // @ts-ignore
        switch (this.questionWithAnswer.content.structur) {
            case 0:/*چندگزینه ای*/
                this.itemShow = true;
                this.scoreShow = false;
                this.textShow = false;

                this.choiceOfanswerForItemStatus = ['....'];
                // @ts-ignore
                for (let choice of  this.questionWithAnswer.content.choices) {
                    this.choiceOfanswerForItemStatus.push(choice.value);
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

    public nextQuestion(periority){
        this.loadByPeriorityQuestion((periority+1));
    }
    public previousQuestion(periority){
        this.loadByPeriorityQuestion((periority-1));
    }
    public loadByPeriorityQuestion(number){
        this.answerQuestionService.All("SELECT * FROM answerQuestionTbl e where e.checkListId=" + this.checkListIdOnload+" and e.itemId="+this.itemIdOnload+" and e.identifyCharId="+this.identifyCharIdOnload+" and e.periorityMob="+number).then(rows => {
            if(rows.length>0){
                this.loadData({id:rows[0][0],content:JSON.parse(rows[0][1]),checkListId:rows[0][2],itemId:rows[0][3],identifyCharId:rows[0][4],periorityMob:rows[0][5]});
            }else {
                Toast.makeText("سوالی برای پاسخ دادن وجود ندارد").show();
            }

        }, error => {
            console.log("SELECT ERROR", error);
        });
    }
    public setAnswers() {
        this.loadGroupAndSortAndDefectResolveLists();

        // @ts-ignore
        this.answerIndex = this.choiceOfanswerForItemStatus.findIndex(obj => obj == this.questionWithAnswer.content.answer);/*ایندکس پاسخی را پیدا می کند که برای ان دردیتابیس پر شده است*/
        // @ts-ignore
        this.statusIndex = this.answerchoiceStatus.findIndex(obj => obj == this.questionWithAnswer.content.match);
        this.statusIndex == 2 ? this.displayNonCompliance = true : this.displayNonCompliance = false;
        // @ts-ignore
        this.describtion = this.questionWithAnswer.content.describtion;
        // @ts-ignore
        this.estenad = this.questionWithAnswer.content.estenad;
        // @ts-ignore
        this.repeatedTime = this.questionWithAnswer.content.repeatedTime;

        // @ts-ignore
        this.groupingIndex=this.groupingIds.findIndex(obj=>obj==this.questionWithAnswer.content.groupingId);
        // @ts-ignore
        this.assortIndex=this.assortIds.findIndex(obj=>obj==this.questionWithAnswer.content.assortingId);

        this.fetchQuestionFaultTbl();
    }

    public selectedIndexAnswer(args) {
        let picker = <DropDown>args.object;
        if (picker.selectedIndex != 0) {
            // @ts-ignore
            this.questionWithAnswer.content.answer = picker.items[picker.selectedIndex];
        } else {
            // @ts-ignore
            this.questionWithAnswer.content.answer = '-';
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
            this.questionWithAnswer.content.match = picker.items[picker.selectedIndex];
            if (picker.selectedIndex == 2) {
                this.displayNonCompliance = true;
                this.fetchQuestionFaultTbl();
            } else {
                this.displayNonCompliance = false;
            }
        } else {
            // @ts-ignore
            this.questionWithAnswer.content.match = '-';
            this.displayNonCompliance = false;

        }

    }

    selectedIndexDefect(args) {
        let picker = <DropDown>args.object;
        if (picker.selectedIndex != 0) {
            this.defect = picker.items[picker.selectedIndex];
            this.defectId=this.answerchoiceFaultId[picker.selectedIndex];
        } else {
            this.defect = null;
        }
    }

    selectedIndexDefectResolveTopic(args) {
        let picker = <DropDown>args.object;
        if (picker.selectedIndex != 0) {
            this.defectResolve = picker.items[picker.selectedIndex];
            this.defectResolveIndexNum = this.defectResolveIds[picker.selectedIndex];
        } else {
            this.defectResolve = null;
        }
    }

    selectedIndexGrouping(args) {
        let picker = <DropDown>args.object;
        if (picker.selectedIndex != 0) {
            this.grouping = picker.items[picker.selectedIndex];
            this.groupingId=this.groupingIds[picker.selectedIndex];
        } else {
            this.grouping = null;
        }
    }
    selectedIndexAssort(args) {
        let picker = <DropDown>args.object;
        if (picker.selectedIndex != 0) {
            this.assort = picker.items[picker.selectedIndex];
            this.assortId=this.assortIds[picker.selectedIndex];
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

                    let itemsStr=[];
                    // @ts-ignore
                    itemsStr= imageAsset._android.split("/");
                    that.picName=itemsStr[itemsStr.length-1];
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
            this.questionWithAnswer.content.estenad = this.estenad;
            // @ts-ignore
            this.questionWithAnswer.content.repeatedTime = this.repeatedTime;


            // @ts-ignore
            this.answerQuestionService.excute2("update answerQuestionTbl  set answerQuestion=? where  id=? ", [JSON.stringify(this.questionWithAnswer.content), this.questionWithAnswer.id]).then(id => {
                Toast.makeText('پاسخ شما ثبت شد').show();
            }, error => {
                console.log("update ERROR", error);
            });

        }
    }

    public closeModal(){
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
        // @ts-ignore
        this.faultTableService.excute2("insert into QuestionFaultTbl(faultTitle,faultId,troubleShootingId,troubleShooting,imgStr,questionId) VALUES (?,?,?,?,?,?) ", [this.defect,this.defectId,this.defectResolveIndexNum, this.defectResolve, this.answerQuestionFualtPhoto, this.questionWithAnswer.id]
        ).then(id => {
            Toast.makeText('ثبت شد').show();
            this.fetchQuestionFaultTbl();
        }, error => {
            console.log("INSERT ERROR", error);
        });


    }

    selectDefectiveSamples(){
        let option = {context:'', viewContainerRef: this.viewContainerRef, fullscreen: false};
        this.dialogService.showModal(DefectiveSamplesComponent,option);
    }

    fetchQuestionFaultTbl(){
        // @ts-ignore
        this.faultTableService.All("select * from QuestionFaultTbl f where f.questionId= "+this.questionWithAnswer.id).then(rows=>{

            this.questionFualtTable=[];
            for(let row of rows){
                this.questionFualtTable.push({
                    id:row[0],
                    defect: row[1],
                    defectId: row[2],
                    defectResolveIndexNum: row[3],
                    defectResolv: row[4],
                    answerQuestionFualtPhoto: row[5],
                    questionId:row[6]
                });

            }

        },error=>{
            console.log("error is:"+error);
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
                this.faultTableService.excute("delete from QuestionFaultTbl where id="+id).then(id=>{
                    Toast.makeText("رکورد پاک شد").show();
                    this.fetchQuestionFaultTbl();
                },error=>{
                    console.log("error ...."+error);
                });
            }
        })


    }
}
