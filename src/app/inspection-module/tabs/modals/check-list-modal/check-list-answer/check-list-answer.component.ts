import {Component, ElementRef, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {ModalDialogParams, ModalDialogService} from "nativescript-angular";
import {DropDown, ValueList} from "nativescript-drop-down";
import * as camera from "nativescript-camera";

import * as Toast from 'nativescript-toast';


import {ImageSource} from "tns-core-modules/image-source";

import * as dialogs from "tns-core-modules/ui/dialogs";
import {AnswerQuestionService} from "~/app/inspection-module/tabs/services/answerQuestion/answerQuestion.service";
import {CheckListAnswerPhotoComponent} from "~/app/inspection-module/tabs/modals/check-list-modal/check-list-answer-photo/check-list-answer-photo.component";

@Component({
    selector: 'app-check-list-answer',
    templateUrl: './check-list-answer.component.html',
    styleUrls: ['./check-list-answer.component.css'],
    moduleId: module.id,
})
export class CheckListAnswerComponent implements OnInit {

    describtion = "";
    scoreFrom=null;
    scoreTo=null;
    answerQu="";
    scoreNum=null;
    itemShow=false;
    scoreShow=false;
    textShow=false;
    answerchoiceQuestion = [];
    answerchoiceStatus = ['.....', 'انطباق','عدم انطباق','عدم قضاوت','عدم کاربرد','بازرسی مجدد'];
    answerchoiceDefect = ['....', 'test1'];
    answerchoiceTroubleshooting = ['....', 'test2'];
    answerIndex = 0;
    statusIndex = 0;
    defectIndex = 0;
    troubleshootingIndex = 0;
    displayNonCompliance = false;
    question = {};
    questionFualt = [];


    ///////////////////////AnswerQuestionFault///////
    defect = null;
    troubleshooting = null;
    answerQuestionFualtPhoto = null;

    ////////////////////////////////////////////////


    constructor(private dialogParams: ModalDialogParams, private dialogService: ModalDialogService, private viewContainerRef: ViewContainerRef,
                private answerQuestionService: AnswerQuestionService) {
        this.question = this.dialogParams.context;
        // @ts-ignore
        switch (this.question.content.structur) {
            case 0:
                this.itemShow=true;
                this.scoreShow=false;
                this.textShow=false;
                break;
            case 1:
                this.itemShow=false;
                this.scoreShow=true;
                this.textShow=false;
                // @ts-ignore
                this.scoreFrom=this.question.content.scoreFrom;
                // @ts-ignore
                this.scoreTo=this.question.content.scoreTo;
                // @ts-ignore
                this.scoreNum=this.question.content.answer;
                break;
            case 2:
                this.itemShow=false;
                this.scoreShow=false;
                this.textShow=true;
                // @ts-ignore
                this.answerQu=this.question.content.answer;
                break;

        }
        this.answerchoiceQuestion = ['....'];
        // @ts-ignore
        for (let choice of  this.question.content.choices) {
            this.answerchoiceQuestion.push(choice.value);
        }
        this.setAnswers();


    }

    public setAnswers() {
        // @ts-ignore
        this.answerIndex = this.answerchoiceQuestion.findIndex(obj => obj == this.question.content.answer);
        // @ts-ignore
        this.statusIndex = this.answerchoiceStatus.findIndex(obj => obj == this.question.content.match);
        this.statusIndex == 2 ? this.displayNonCompliance = true : this.displayNonCompliance = false;
        // @ts-ignore
        this.describtion = this.question.content.describtion;
    }

    public selectedIndexAnswer(args) {
        let picker = <DropDown>args.object;
        if (picker.selectedIndex != 0) {
            // @ts-ignore
            this.question.content.answer = picker.items[picker.selectedIndex];
        } else {
            // @ts-ignore
            this.question.content.answer = '-';
        }
    }

    genRows(item) {
        let rows = "*,*,*,*,*,*,*,*,*,*,*,*,*,*";
        item.forEach((el) => {
            rows += ",*";
        })
        return rows
    }

    public selectedIndexStatus(args) {
        let picker = <DropDown>args.object;
        if (picker.selectedIndex != 0) {
            // @ts-ignore
            this.question.content.match = picker.items[picker.selectedIndex];
            if (picker.selectedIndex == 2) {
                this.displayNonCompliance = true;
            } else {
                this.displayNonCompliance = false;
            }
        } else {
            // @ts-ignore
            this.question.content.match = '-';
            this.displayNonCompliance = false;

        }

    }

    selectedIndexDefect(args) {
        let picker = <DropDown>args.object;
        if (picker.selectedIndex != 0) {
            this.defect = picker.items[picker.selectedIndex];
        } else {
            this.defect = null;
        }
    }

    selectedIndexTroubleshooting(args) {
        let picker = <DropDown>args.object;
        if (picker.selectedIndex != 0) {
            this.troubleshooting = picker.items[picker.selectedIndex];
        } else {
            this.troubleshooting = null;
        }
    }

    ngOnInit() {
    }

    public takePicture() {

        let that = this;
        camera.requestPermissions().then(
            function success() {
                camera.takePicture().then((imageAsset) => {
                    let source = new ImageSource();
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


    closeModal() {
        // @ts-ignore
        switch (this.question.content.structur) {
            case 0:
                if (!(this.answerIndex == 0) && !(this.statusIndex == 0)) {
                    this.dialogParams.closeCallback();
                    // @ts-ignore
                    this.question.content.isAnswered = true;
                    // @ts-ignore
                    this.question.content.describtion = this.describtion;

                    // @ts-ignore
                    this.answerQuestionService.excute2("update answerQuestionTbl  set answerQuestion=? where  id=? ", [JSON.stringify(this.question.content), this.question.id]).then(id => {
                        Toast.makeText('پاسخ شما ثبت شد').show();
                    }, error => {
                        console.log("update ERROR", error);
                    });
                } else {
                    Toast.makeText("جواب / وضعیت باید انتخاب شوند").show();
                }
                break;
            case 1:
                if (!(this.scoreNum == null) && !(this.statusIndex == 0)) {
                    this.dialogParams.closeCallback();
                    // @ts-ignore
                    this.question.content.isAnswered = true;
                    // @ts-ignore
                    this.question.content.describtion = this.describtion;
                    // @ts-ignore
                    this.question.content.answer=this.scoreNum;
                    // @ts-ignore
                    this.answerQuestionService.excute2("update answerQuestionTbl  set answerQuestion=? where  id=? ", [JSON.stringify(this.question.content), this.question.id]).then(id => {
                        Toast.makeText('پاسخ شما ثبت شد').show();
                    }, error => {
                        console.log("update ERROR", error);
                    });
                } else {
                    Toast.makeText("جواب / وضعیت باید مقداردهی  شوند").show();
                }
                // @ts-ignore
                this.scoreFrom=this.question.content.scoreFrom;
                // @ts-ignore
                this.scoreTo=this.question.content.scoreTo;
                break;
            case 2:
                if (!(this.answerQu == null) && !(this.statusIndex == 0)) {
                    this.dialogParams.closeCallback();
                    // @ts-ignore
                    this.question.content.isAnswered = true;
                    // @ts-ignore
                    this.question.content.describtion = this.describtion;
                    // @ts-ignore
                    this.question.content.answer=this.answerQu;
                    // @ts-ignore
                    this.answerQuestionService.excute2("update answerQuestionTbl  set answerQuestion=? where  id=? ", [JSON.stringify(this.question.content), this.question.id]).then(id => {
                        Toast.makeText('پاسخ شما ثبت شد').show();
                    }, error => {
                        console.log("update ERROR", error);
                    });
                } else {
                    Toast.makeText("جواب / وضعیت باید مقداردهی شوند").show();
                }
                break;

        }
    }


    getImage(src) {
        let option = {context: src, viewContainerRef: this.viewContainerRef, fullscreen: false}
        this.dialogService.showModal(CheckListAnswerPhotoComponent, option);
    }

    insertDefectAnswer() {
       if(!(this.defect==null) && !(this.troubleshooting==null)){
           // @ts-ignore
           this.question.content.questionFaults.push({
               defect: this.defect,
               troubleshooting: this.troubleshooting,
               answerQuestionFualtPhoto: this.answerQuestionFualtPhoto
           });
           // @ts-ignore
           this.questionFualt = this.question.content.questionFaults;
       }else {
           // @ts-ignore
           Toast.makeText('عیب / رفع عیب انتخاب نشده است',{backgroundColor: 'red'}).show();
       }
    }

    deleteDefectAnswer(item) {
        dialogs.confirm({
            title: "پیغام حذف",
            message: "از حذف این آیتم مطمئن هستید؟",
            okButtonText: "بلی",
            cancelButtonText: "خیر"
        }).then(res => {
            if (res) {
                // @ts-ignore
                let index = this.question.content.questionFaults.findIndex(obj => obj.defect == item.defect && obj.troubleshooting == item.troubleshooting);
                // @ts-ignore
                this.question.content.questionFaults.splice(index, 1);
            }
        })


    }
}
