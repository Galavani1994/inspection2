import {Component, OnInit} from '@angular/core';
import {FilePickerOptions, Mediafilepicker} from "nativescript-mediafilepicker";
import {File} from "tns-core-modules/file-system";
import * as appSettings from "tns-core-modules/application-settings";
import * as application from "tns-core-modules/application";

import * as  base64 from "base-64";
import * as utf8 from "utf8";


import {AES} from "crypto-ts";

var CryptoTS = require("crypto-ts");

@Component({
    selector: 'app-inspection-operation',
    templateUrl: './inspection-operation.component.html',
    styleUrls: ['./inspection-operation.component.css'],
    moduleId: module.id,
})

export class InspectionOperationComponent implements OnInit {

    text: string;
    data = '';

    isShow_sending = false;
    isShow_inspection = false;
    isShow_reciveing = true;

    isShow_sendig_raw = true;
    isShow_inspection_raw = true;
    isShow_reciveing_raw = false;

    constructor() {
        appSettings.setBoolean('isSelectdItemProduct', false);

    }

    ngOnInit() {
        appSettings.remove("sanjeshData");

    }

    get_data() {

        this.get_datas().then(result=>{
            if(result){
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
        get_datas(): Promise<boolean> {


        let extensions = ['json'];
        let that = this;
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

        return new Promise<boolean>((resolve, reject)=>{
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
