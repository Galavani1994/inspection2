import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {ModalDialogOptions, ModalDialogParams, ModalDialogService} from "nativescript-angular";


import * as Toast from "nativescript-toast";
import * as appSettings from "tns-core-modules/application-settings";
import {AnswerQuestionService} from "~/app/inspection-module/tabs/services/answerQuestion/answerQuestion.service";
import {AnswerModalComponent} from "~/app/inspection-module/tabs/modals/check-list-modal/check-list-answer/answer-modal.component";
import {Observable} from "rxjs";
import {AnswerQuestionModel} from "~/app/inspection-module/tabs/modals/check-list-modal/answer-question.model";


declare var main: any;

@Component({
    selector: 'app-check-list-modal',
    templateUrl: './questions-modal.component.html',
    styleUrls: ['./questions-modal.component.css'],
    moduleId: module.id,
})
export class QuestionsModalComponent implements OnInit {
    checkListId = null;
    itemId = null;
    countQu = null;
    checkList = '';
    questions = []; /*سوالات مربوط به چک لیست همراه طبقه بندی*/
    AllQuestionWithoutCategory = [];/*سوالات مربوط به چک لیست یک پارچه بدون طبقه*/
    answerQuestionList = [];
    checkListTitle = '';
    private processing = false;

    inspectionReportId: number;
    inspectionChecklistId: number;
    inspectionReportCheckListId: string;

    constructor(private modalService: ModalDialogService, private modalParam: ModalDialogParams,
                private viewContainerRef: ViewContainerRef, private answerQuestionService: AnswerQuestionService) {

        this.inspectionReportId = this.modalParam.context.inspectionReportId;
        this.inspectionChecklistId = this.modalParam.context.inspectionChecklistId;
        this.inspectionReportCheckListId = this.modalParam.context.inspectionReportCheckListId;

        let indexOfInspectionCheckList = JSON.parse(appSettings.getString('sanjeshData')).inspectionCheckLists.findIndex(obj => obj.id == this.inspectionChecklistId);
        this.checkListTitle = JSON.parse(appSettings.getString('sanjeshData')).inspectionCheckLists[indexOfInspectionCheckList].checkList.title;
        for (let item of JSON.parse(appSettings.getString('sanjeshData')).inspectionCheckLists[indexOfInspectionCheckList].checkList.checkListCategorys) {
            this.questions.push(item.questions);
        }
        this.getAllQuestionWithoutCategory();
        this.insertQuestionsToDB();
    }

    ngOnInit() {
    }

    public getAllQuestionWithoutCategory() {
        let count = 0;
        /*برای کانک ت کردن سوالات چک لیست(questions) که براساس طیقه هستند*/
        for (let question of this.questions) {
            count++;
            for (let qu of question) {
                this.AllQuestionWithoutCategory.push({
                    title: qu.title,
                    questionId: qu.id,
                    answer: ' ',
                    choiceId: -1,
                    status: null,
                    statusPersianTitle: '',
                    scoreFrom: qu.scoreFrom,
                    scoreTo: qu.scoreTo,
                    structureTitle: qu.questionStructurePersianTitle,
                    structur: qu.questionStructure,
                    choices: qu.choices,
                    describtion: "",
                    checkListCategoryId: qu.checkListCategoryId,
                    checkListCategoryTitle: qu.checkListCategoryTitle,
                    isAnswered: false,
                    questionFaults: qu.questionFaults,
                    defectiveSamples: null,
                    questionPriority: qu.priority,
                    categoryPriority: count
                });
            }
        }

    }


    public Answer(item) {
        let options: ModalDialogOptions = {
            context: item,
            viewContainerRef: this.viewContainerRef,
            fullscreen: true,
        };
        this.modalService.showModal(AnswerModalComponent, options).then(() => {
            this.processing = true;
            this.fetchQuestion();
        });
    }


    closeModal() {
        this.modalParam.closeCallback();
    }

    insertQuestionsToDB() {
        this.checkExistQuestion().then((result) => {
            if (result == 0) {
                let periority = 1;
                for (let item of this.AllQuestionWithoutCategory) {
                    this.answerQuestionService.excute2("INSERT INTO SGD_answerQuestionTbl(answerQuestion,inspectionReportChecklistId,periorityMob,inspectionReportId) VALUES (?,?,?,?)", [main.java.org.inspection.AES.encrypt(JSON.stringify(item), appSettings.getString('dbKey')), this.inspectionReportCheckListId, periority, this.inspectionReportId]).then(id => {
                        console.log("INSERT RESULT", id);
                    }, error => {
                        console.log("INSERT ERROR", error);
                    });
                    periority += 1;
                }
            }
        }).then(result => {
            this.fetchQuestion();
        });
    }

    checkExistQuestion(): Promise<number> {
        return new Promise((resolve, reject) => {
            this.answerQuestionService.All("SELECT COUNT(*) FROM SGD_answerQuestionTbl e where e.inspectionReportChecklistId=" + this.inspectionReportCheckListId).then(total => {
                resolve(total[0][0])
            }, error => {
                console.log("count ERROR", error);
                reject(-1);
            });
        });

    }

    fetchQuestion() {
        this.answerQuestionService.All("SELECT * FROM SGD_answerQuestionTbl e where e.inspectionReportChecklistId=" + this.inspectionReportCheckListId).then(rows => {
            this.answerQuestionList = [];
            for (var row in rows) {
                this.answerQuestionList.push({
                    id: rows[row][0],
                    content: JSON.parse(main.java.org.inspection.AES.decrypt(rows[row][1], appSettings.getString('dbKey'))),
                    inspectionReportChecklistId: rows[row][2],
                    periorityMob: rows[row][3]
                });
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
