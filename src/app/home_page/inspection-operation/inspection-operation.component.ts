import {Component, OnInit} from '@angular/core';
import {FilePickerOptions, Mediafilepicker} from "nativescript-mediafilepicker";
import {File} from "tns-core-modules/file-system";
import * as appSettings from "tns-core-modules/application-settings";
import * as application from "tns-core-modules/application";
import * as Toast from "nativescript-toast";

import * as  base64 from "base-64";
import * as utf8 from "utf8";


import {AES} from "crypto-ts";
import {AnswerQuestionService} from "~/app/inspection-module/tabs/services/answerQuestion/answerQuestion.service";
import {resolve} from "@angular/compiler-cli/src/ngtsc/file_system";
import {QuestionfaulttableService} from "~/app/inspection-module/tabs/services/faultTbl/questionfaulttable.service";

var CryptoTS = require("crypto-ts");

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

    isShow_sending = false;
    isShow_inspection = false;
    isShow_reciveing = true;

    isShow_sendig_raw = true;
    isShow_inspection_raw = true;
    isShow_reciveing_raw = false;

    constructor(private answerQuService: AnswerQuestionService, private faultTableService: QuestionfaulttableService) {
        appSettings.setBoolean('isSelectdItemProduct', false);

    }

    ngOnInit() {
        appSettings.remove("sanjeshData");

    }


    get_data() {

        this.get_datas().then(result => {
            if (result) {
                this.isShow_sending = false;
                this.isShow_inspection = true;
                this.isShow_reciveing = false;

                this.isShow_sendig_raw = true;
                this.isShow_inspection_raw = false;
                this.isShow_reciveing_raw = true;
            }
        })

        // let extensions = ['json'];
        // let that = this;
        // let options: FilePickerOptions = {
        //     android: {
        //         extensions: extensions,
        //         maxNumberFiles: 1
        //     },
        //     ios: {
        //         extensions: extensions,
        //         multipleSelection: true
        //     }
        // };
        // let mediafilepicker = new Mediafilepicker();
        // mediafilepicker.openFilePicker(options);
        // mediafilepicker.on("getFiles", (res) => {
        //     let file = File.fromPath(res.object.get('results')[0].file);
        //     let thats = this;
        //     file.readText()
        //         .then((result) => {
        //
        //             // var bytes=base64.decode(result);
        //             appSettings.setString('sanjeshData', result);
        //
        //
        //         });
        //     thats.isShow_sending = false;
        //     thats.isShow_inspection = true;
        //     thats.isShow_reciveing = false;
        //
        //     thats.isShow_sendig_raw = true;
        //     thats.isShow_inspection_raw = false;
        //     thats.isShow_reciveing_raw = true;
        //
        // });
        // mediafilepicker.on("error", function (res) {
        //     let msg = res.object.get('msg');
        //     console.log(msg);
        // });
        //
        // mediafilepicker.on("cancel", function (res) {
        //     let msg = res.object.get('msg');
        //     console.log(msg);
        // });


    }

    public sendData() {

        let expData = appSettings.getString('sanjeshData');
        if (expData == undefined || expData == null) {
            Toast.makeText('قایلی برای ارسال وجود ندارد.').show();
            return;
        }
        //let sanjeshData=JSON.parse(appSettings.getString('sanjeshData'));
        this.fetchAnswerQu().then((resolve) => {
            let file = File.fromPath("/storage/emulated/0/SGD/export/" + Date.now() + ".sgd");
            file.writeText(JSON.stringify(this.data)).then(() => {
                Toast.makeText("قایل در مسیر " + "/storage/emulated/0/SGD/export/" + "ذخیره شده است").show();
            });
        });

    }

    public fetchAnswerQu(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.answerQuService.All("SELECT * FROM answerQuestionTbl ").then((rows) => {
                this.data = [];
                for (let row of rows) {
                    this.getFaultTbl(row[0]);
                    this.data.push({
                        id: row[0],
                        content: JSON.parse(row[1]),
                        checkListId: row[2],
                        itemId: row[3],
                        identifyCharId: row[4],
                        periorityMob: row[5],
                        questionFaultTbl: this.questionFualtTable
                    })
                }
                resolve(true);
            });
        })

    }

    public getFaultTbl(questionId): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.faultTableService.All("select * from QuestionFaultTbl f where f.questionId= " + questionId).then(items => {

                if (items.length > 0) {
                    this.questionFualtTable = [];
                    for (let item of items) {
                        this.questionFualtTable.push({
                            id: item[0],
                            defect: item[1],
                            troubleshooting: item[2],
                            answerQuestionFualtPhoto: item[3],
                            questionId: item[4]
                        });

                    }
                    return resolve(true);
                }

            }, error => {
                console.log("error is:" + error);
            });
        });
    }

    get_datas(): Promise<boolean> {


        let extensions = ['json'];
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

                        // var bytes=base64.decode(result);
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

}
