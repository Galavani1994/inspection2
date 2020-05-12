import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {ModalDialogOptions, ModalDialogParams, ModalDialogService} from "nativescript-angular";


import * as Toast from "nativescript-toast";
import * as appSettings from "tns-core-modules/application-settings";
import {AnswerQuestionService} from "~/app/inspection-module/tabs/services/answerQuestion/answerQuestion.service";
import {AnswerModalComponent} from "~/app/inspection-module/tabs/modals/check-list-modal/check-list-answer/answer-modal.component";
import {Observable} from "rxjs";




@Component({
    selector: 'app-check-list-modal',
    templateUrl: './questions-modal.component.html',
    styleUrls: ['./questions-modal.component.css'],
    moduleId: module.id,
})
export class QuestionsModalComponent implements OnInit {
    checkListId = null;
    itemId = null;
    countQu=null;
    checkList = '';
    questions = []; /*سوالات مربوط به چک لیست همراه طبقه بندی*/
    mainQuestions = [];/*سوالات مربوط به چک لیست یک پارچه بدون طبقه*/
    fetchQuestionFromDB = [];
    checkListTitle='';
    private processing=false;

    constructor(private modalService: ModalDialogService, private modalParam: ModalDialogParams,
                private viewContainerRef: ViewContainerRef, private answerQuestionService: AnswerQuestionService) {
        this.checkListId=this.modalParam.context.values.checkListId;
        this.itemId=this.modalParam.context.values.itemId;
        let indexOfQuestion = JSON.parse(appSettings.getString('sanjeshData')).inspectionCheckLists.findIndex(obj => obj.checkListId == this.modalParam.context.values.checkListId);
        for (let item of JSON.parse(appSettings.getString('sanjeshData')).inspectionCheckLists[indexOfQuestion].checkList.checkListCategorys) {
            this.questions.push(item.questions);
            this.checkListTitle=item.checkListTitle;
        }
        this.answerQuestionService.create_database();
        this.certain();



    }

    ngOnInit() {
        this.insertQuestionsToDB(this.modalParam.context.values.checkListId, this.modalParam.context.values.itemId,this.modalParam.context.values.identifyCharId);
    }

    public certain() {
        /*برای کانکت کردن سوالات چک لیست(questions) که براساس طیقه هستند*/
        for (let question of this.questions) {
            for (let qu of question) {
                this.mainQuestions.push({
                    title: qu.title,
                    questionIdServer:qu.id,
                    answer: '-',
                    match: '-',
                    scoreFrom: qu.scoreFrom,
                    scoreTo: qu.scoreTo,
                    structureTitle: qu.questionStructurePersianTitle,
                    structur: qu.questionStructure,
                    defect: qu.defect,
                    defectType: qu.defectType,
                    defectTypePersianTitle: qu.defectTypePersianTitle,
                    choices: qu.choices,
                    describtion:"",
                    checkListCategoryTitle: qu.checkListCategoryTitle,
                    isAnswered: false,
                    grouping:'',
                    groupingId:'',
                    assorting:'',
                    assortingId:'',
                    estenad:'',
                    repeatedTime:'',
                    questionFaults: qu.questionFaults
                });
            }
        }

    }


    public Answer(item) {
        let options: ModalDialogOptions = {
            context: item,
            viewContainerRef: this.viewContainerRef,
            fullscreen: false,
        };
        this.modalService.showModal(AnswerModalComponent, options).then(()=>{
            this.processing=true;
            this.fetchQuestion();
        });
    }


    closeModal() {
        this.modalParam.closeCallback();
    }

    insertQuestionsToDB(checkListId, itemId, identifyCharId) {
        this.checkExistQuestion().then((result)=>{
            if(result ==0 ){
                let periority=1;
                for(let item of this.mainQuestions){
                    this.answerQuestionService.excute2("INSERT INTO answerQuestionTbl(answerQuestion,checkListId,itemId,identifyCharId,periorityMob) VALUES (?,?,?,?,?)", [JSON.stringify(item), checkListId, itemId,identifyCharId,periority]).then(id => {
                        console.log("INSERT RESULT", id);
                    }, error => {
                        console.log("INSERT ERROR", error);
                    });
                    periority+=1;
                }
            }
            this.fetchQuestion();
        });
    }
    checkExistQuestion():Promise<number>{
        return new Promise((resolve, reject)=>{
            this.answerQuestionService.All("SELECT COUNT(*) FROM answerQuestionTbl e where e.checkListId="+ this.checkListId+" and e.itemId="+this.itemId+" and e.identifyCharId="+this.modalParam.context.values.identifyCharId).then(total=>{
                resolve(total[0][0])
            },error=>{
                console.log("count ERROR", error);
                reject(-1);
            });
        });

    }
    fetchQuestion(){
        this.answerQuestionService.All("SELECT * FROM answerQuestionTbl e where e.checkListId=" + this.checkListId+" and e.itemId="+this.itemId+" and e.identifyCharId="+this.modalParam.context.values.identifyCharId).then(rows => {
            this.fetchQuestionFromDB = [];
            for (var row in rows) {
                this.fetchQuestionFromDB.push({id:rows[row][0],content:JSON.parse(rows[row][1]),checkListId:rows[row][2],itemId:rows[row][3],identifyCharId:rows[row][4],periorityMob:rows[row][5]});
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
