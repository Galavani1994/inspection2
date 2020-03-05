import {Component, OnInit} from '@angular/core';
import {FilePickerOptions, Mediafilepicker} from "nativescript-mediafilepicker";
import {File} from "tns-core-modules/file-system";
import * as appSettings from "tns-core-modules/application-settings";
import * as application from "tns-core-modules/application";
import * as Toast from "nativescript-toast";

import * as  base64 from "base-64";
import * as utf8 from "utf8";
import {AnswerQuestionService} from "~/app/inspection-module/tabs/services/answerQuestion/answerQuestion.service";
import {QuestionfaulttableService} from "~/app/inspection-module/tabs/services/faultTbl/questionfaulttable.service";
import {DatePipe} from "@angular/common";


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
    questionId=[];

    isShow_sending = false;
    isShow_inspection = false;
    isShow_reciveing = true;

    isShow_sendig_raw = true;
    isShow_inspection_raw = true;
    isShow_reciveing_raw = false;

    fileTitle='';

    constructor(private answerQuService: AnswerQuestionService,
                private faultTableService: QuestionfaulttableService,
                private datePipe: DatePipe) {
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

                        var decoded = base64.decode(result);
                        var decodeToUtf8 = utf8.decode(decoded)
                        appSettings.setString('sanjeshData', decodeToUtf8);
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

       /* let expData = appSettings.getString('sanjeshData');
        if (expData == undefined || expData == null) {
            Toast.makeText('فایلی برای ارسال وجود ندارد.').show();
            return;
        }*/

        let date=Date.now();
        this.fileTitle=this.datePipe.transform(date,'yyyy-MM-dd hh:mm:ss');
        let that=this;
        this.fetchAnswerQu().then((id)=>{
            let file = File.fromPath("/storage/emulated/0/SGD/export/"+this.fileTitle+"/content.esgd");
            file.writeText(JSON.stringify(this.data)).then(() => {
                Toast.makeText("فایل محتوا در مسیر " + "/storage/emulated/0/SGD/export/" + "ذخیره شده است").show();
            });
            this.getFaultTbl(this.questionId);

        }).then(function () {

            let fault = File.fromPath("/storage/emulated/0/SGD/export/"+that.fileTitle+"/faultTbl.esgd");



           /* var decodeToUtf8 = utf8.encode(JSON.stringify(that.questionFualtTable))
            var decoded = base64.decode(decodeToUtf8);*/

            fault.writeText(JSON.stringify(that.questionFualtTable)).then(() => {
                Toast.makeText("فایل عیب ها در مسیر " + "/storage/emulated/0/SGD/export/" + "ذخیره شده است").show();
            });
        })

    }

    public fetchAnswerQu(): Promise<boolean> {
        let username=appSettings.getString('username');
        let password=appSettings.getString('password');
        return new Promise<boolean>((resolve, reject) => {
            this.answerQuService.All("SELECT * FROM answerQuestionTbl ").then((rows) => {
                this.data = [];
                for (let row of rows) {
                    this.questionId.push(row[0]);
                    this.data.push({
                        id: row[0],
                        content: JSON.parse(row[1]),
                        checkListId: row[2],
                        itemId: row[3],
                        identifyCharId: row[4],
                        periorityMob: row[5],
                        nationalCode: username,
                        personalCode: password
                    });
                }

                resolve(true);
            });
        })

    }

    public getFaultTbl(questionId) {
            this.faultTableService.All("select * from QuestionFaultTbl f where f.questionId in("+questionId+") " ).then(items => {
                if (items.length > 0) {
                    this.questionFualtTable = [];
                    for (let item of items) {
                        this.questionFualtTable.push({
                            id: item[0],
                            defect: item[1],
                            defectId: item[2],
                            troubleshootingId: item[3],
                            troubleshooting: item[4],
                            answerQuestionFualtPhoto: item[5],
                            questionId: item[6]
                        });
                    }
                }

            }, error => {
                console.log("error is:" + error);
            });
    }


    /*insertInfo(data:string,info:string){

        String nationalCode = "2790428697";
        String main_str = "helloworld helloworld helloworld";
        String[] ss = nationalCode.split("");
        int co=0;
        for (int i = 1; i < main_str.length(); i = i + 2) {
            if (co<ss.length) {
                main_str = main_str.substring(0, i) + ss[co] + main_str.substring(i);
                co++;
            }else {
                break;
            }
        }
    }*/

}
