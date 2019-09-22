import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {ModalDialogOptions, ModalDialogParams, ModalDialogService} from "nativescript-angular";

import {CheckListAnswerComponent} from "~/app/home_page/modals/check-list-modal/check-list-answer/check-list-answer.component";
import {AnswerQuestionService} from "~/app/services/answerQuestion/answerQuestion.service";
import * as Toast from "nativescript-toast";

var data=require("~/app/product_file/703.json");


@Component({
    selector: 'app-check-list-modal',
    templateUrl: './check-list-modal.component.html',
    styleUrls: ['./check-list-modal.component.css'],
    moduleId: module.id,
})
export class CheckListModalComponent implements OnInit {
    checkListId = null;
    itemId = null;
    countQu=null;
    checkList = '';
    checkListQuestion = [];
    checkListQue = [];
    checkListQueDB = [];
    checkListTitle='';

    constructor(private modalService: ModalDialogService, private modalParam: ModalDialogParams,
                private viewContainerRef: ViewContainerRef, private answerQuestionService: AnswerQuestionService) {
        this.checkListId=this.modalParam.context.values.checkListId;
        this.itemId=this.modalParam.context.values.itemId;
        let indexOfQuestion = data.inspectionCheckLists.findIndex(obj => obj.checkListId == this.modalParam.context.values.checkListId);
        for (let item of data.inspectionCheckLists[indexOfQuestion].checkList.checkListCategorys) {
            this.checkListQuestion.push(item.questions);
            this.checkListTitle=item.checkListTitle;
        }
        this.answerQuestionService.create_database();
        this.certain();



    }

    ngOnInit() {
        this.insertAnswerQuestion(this.modalParam.context.values.checkListId, this.modalParam.context.values.itemId);
    }

    public certain() {
        for (let que of this.checkListQuestion) {
            for (let qu of que) {
                this.checkListQue.push({
                    title: qu.title, answer: '-', match: '-',
                    scoreFrom: qu.scoreFrom, scoreTo: qu.scoreTo, structureTitle: qu.questionStructurePersianTitle,
                    structur: qu.questionStructure,
                    defect: qu.defect, defectType: qu.defectType, defectTypePersianTitle: qu.defectTypePersianTitle,
                    choices: qu.choices,describtion:"",
                    checkListCategoryTitle: qu.checkListCategoryTitle, isAnswered: false, questionFaults: []
                });
            }
        }

    }

    public checkListAnswer(item) {
        let options: ModalDialogOptions = {
            context: item,
            viewContainerRef: this.viewContainerRef,
            fullscreen: false,
        };
        this.modalService.showModal(CheckListAnswerComponent, options);
    }


    closeModal() {
        this.modalParam.closeCallback();
    }

    insertAnswerQuestion(checkListId, itemId) {
        this.checkExistQuestion().then((result)=>{
            console.log('dddd',result);
            if(result ==0 ){
                for(let item of this.checkListQue){
                    this.answerQuestionService.excute2("INSERT INTO answerQuestionTbl(answerQuestion,checkListId,itemId) VALUES (?,?,?)", [JSON.stringify(item), checkListId, itemId]).then(id => {
                        console.log("INSERT RESULT", id);
                    }, error => {
                        console.log("INSERT ERROR", error);
                    });
                }
            }
            this.fetchQuestion();
        });


    }
    checkExistQuestion():Promise<number>{
        return new Promise((resolve, reject)=>{
            this.answerQuestionService.All("SELECT COUNT(*) FROM answerQuestionTbl e where e.checkListId="+ this.checkListId+" and e.itemId="+this.itemId).then(total=>{
                resolve(total[0][0])
            },error=>{
                console.log("count ERROR", error);
                reject(-1);
            });
        });

    }
    fetchQuestion(){
        this.answerQuestionService.All("SELECT * FROM answerQuestionTbl e where e.checkListId=" + this.checkListId+" and e.itemId="+this.itemId).then(rows => {
            this.checkListQueDB = [];
            for (var row in rows) {
                this.checkListQueDB.push({id:rows[row][0],content:JSON.parse(rows[row][1])});
            }
        }, error => {
            console.log("SELECT ERROR", error);
        });
    }

    createTable() {
        this.answerQuestionService.create_database();
    }

    deleteTable() {
        this.answerQuestionService.excute("DROP TABLE answerQuestionTbl").then(de => {
            Toast.makeText("جدول مورد نظر حذف شد").show();
        }, error => {
            console.log('errore is...', error);
        });
    }
}
