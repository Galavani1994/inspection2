import {Component, OnInit} from '@angular/core';
import {FilePickerOptions, ImagePickerOptions, Mediafilepicker} from "nativescript-mediafilepicker";
import {Observable} from "tns-core-modules/data/observable";
import { knownFolders, Folder, File } from "tns-core-modules/file-system";
import {android} from "tns-core-modules/application";


var fs=require("file-system");

@Component({
    selector: 'app-inspection-operation',
    templateUrl: './inspection-operation.component.html',
    styleUrls: ['./inspection-operation.component.css'],
    moduleId: module.id,
})

export class InspectionOperationComponent implements OnInit {

    public vm = new Observable();
    dataa:any;

    constructor() {
    }

    ngOnInit() {
    }

    get_data() {
        let extensions = [];
        let that=this;

        extensions = ['json'];


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
        mediafilepicker.on("getFiles", function (res) {
            let folder=knownFolders.documents();
            let results = res.object.get('results');
            that.dataa=results[0].file;
            console.log(that.dataa);



          /*  let result=results[0];
            let file=results[0].file;
            this.dataa='ssssss';
            console.log('res',res);
            console.log('results',results);
            console.dir(results);*/

        });


        mediafilepicker.on("error", function (res) {
            let msg = res.object.get('msg');
            console.log(msg);
        });

        mediafilepicker.on("cancel", function (res) {
            let msg = res.object.get('msg');
            console.log(msg);
        });
    }
}
