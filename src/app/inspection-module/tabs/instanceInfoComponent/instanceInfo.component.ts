import {Component, ElementRef, Input, OnInit, ViewChild} from "@angular/core";
import {FilePickerOptions, Mediafilepicker} from "nativescript-mediafilepicker";
import {File} from "tns-core-modules/file-system";
import {CSVRecord} from "~/app/inspection-module/tabs/instanceInfoComponent/CSVRecord .model";
import {InstanceInfoService} from "~/app/inspection-module/tabs/instanceInfoComponent/instanceInfo.service";
import * as Toast from "nativescript-toast";
import * as dialogs from "tns-core-modules/ui/dialogs";

let csvToJson = require('convert-csv-to-json');

@Component({
    selector: 'instanceInfo',
    templateUrl: './instanceInfo.component.html',
    styleUrls: ['./instanceInfo.component.css'],
    moduleId: module.id,
})
export class InstanceInfoComponent implements OnInit {

    @ViewChild('selectAll', {static: false}) selectAll: ElementRef;

    @Input()
    productId: number;
    fileName = "فایلی انتخاب نشده است ";
    public records: CSVRecord[] = [];
    public headers='تجمیع ستون ها';

    constructor(private instanceInfoService: InstanceInfoService) {


    }

    ngOnInit(): void {

    }

    checkAll() {
        if (this.selectAll.nativeElement.checked) {
            this.records.forEach(item => {
                item.isChecked = false;
            })
        } else {
            this.records.forEach(item => {
                item.isChecked = true;
            })
        }

    }

    get_data() {
        this.uploadFile().then(result => {
            if (result) {
                this.records = this.records;
            }
        })
    }

    uploadFile(): Promise<boolean> {
        let extensions = ['csv'];
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
                file.readText()
                    .then((result) => {
                        let csvRecordsArray = (<string>result).split(/\r\n|\n/);
                       this.headers = this.getHeaderArray(csvRecordsArray);
                        this.records = this.getDataRecordsArrayFromCSVFile(csvRecordsArray);
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

    getHeaderArray(csvRecordsArr: any) {
        let headers = (<string>csvRecordsArr[0]);
        let headerArray = [];
        for (let j = 0; j < headers.length; j++) {
            headerArray.push(headers[j]);
        }
        return headers;
    }

    getDataRecordsArrayFromCSVFile(csvRecordsArray: any) {
        let csvArr = [];

        for (let i = 1; i < csvRecordsArray.length; i++) {
            let csvRecord: CSVRecord = new CSVRecord();
            csvRecord.values = <string>csvRecordsArray[i];
            csvRecord.isChecked = false;
            csvArr.push(csvRecord);
        }
        return csvArr;
    }


    save() {
        this.instanceInfoService.save(this.records, this.productId).then(id => {
            // @ts-ignore
            Toast.makeText('ثبت شد!!').show();
        }, error => {
            console.log("INSERT ERROR", error);
        });
    }

    delteAllData() {
        dialogs.confirm({
            title: "پیغام حذف",
            message: "از حذف این آیتم مطمئن هستید؟",
            okButtonText: "بلی",
            cancelButtonText: "خیر"
        }).then(res => {
            if (res) {
                this.instanceInfoService.clearDB().then(id => {
                    // @ts-ignore
                    Toast.makeText('تمامی رکوردهای ذخیره شده در دیتابیس پاک شدند.!!').show();
                }, error => {
                    console.log("INSERT ERROR", error);
                });
            }
        });

    }


}
