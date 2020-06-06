import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { FilePickerOptions, Mediafilepicker } from "nativescript-mediafilepicker";
import { File } from "tns-core-modules/file-system";
import { CSVRecord } from "~/app/inspection-module/tabs/instanceInfoComponent/CSVRecord .model";
import { InstanceInfoService } from "~/app/inspection-module/tabs/instanceInfoComponent/instanceInfo.service";
import * as Toast from "nativescript-toast";
import * as dialogs from "tns-core-modules/ui/dialogs";
import { Item } from "~/app/inspection-module/tabs/itemComponent/item.model";
import * as appSettings from "tns-core-modules/application-settings";
import { ItemsService } from "~/app/inspection-module/tabs/services/items/items.service";

let csvToJson = require('convert-csv-to-json');

@Component({
    selector: 'instanceInfo',
    templateUrl: './instanceInfo.component.html',
    styleUrls: ['./instanceInfo.component.css'],
    moduleId: module.id,
})
export class InstanceInfoComponent implements OnInit {

    @ViewChild('selectAll', { static: false }) selectAll: ElementRef;

    @Input()
    productId: number;
    fileName = "فایلی انتخاب نشده است ";
    public records: CSVRecord[] = [];

    public itemCharacter = [];
    itemList: Item[];
    sanjeshData = [];
    inspectionReportId: number;
    csvArr: CSVRecord[] = [];

    constructor(private instanceInfoService: InstanceInfoService,
        private itemService: ItemsService) {
        this.sanjeshData = JSON.parse(appSettings.getString('sanjeshData'));
        // @ts-ignore
        this.inspectionReportId = this.sanjeshData.inspectionReport.id;
        this.loadItemCahr();
    }

    ngOnInit(): void {

    }

    genCols(item) {
        let columns = "100,100";
        // item.forEach((el) => {
        //     columns += ",100 ";
        // })
        for (let i = 0; i < item.length; i++) {
            if (i == (item.length - 1)) {
                columns += ",50";
            } else {
                columns += ",100";
            }

        }
        return columns
    }

    genRows(item) {
        let rows = "50";
        item.forEach((el) => {
            rows += ",50";
        })
        return rows
    }

    checkAll() {
        if (this.selectAll.nativeElement.checked) {
            this.csvArr.forEach(item => {
                item.isChecked = false;
                this.selectAll.nativeElement.checked = false;
            })
        } else {
            this.csvArr.forEach(item => {
                item.isChecked = true;
                this.selectAll.nativeElement.checked = true;
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
                        let headerArray = this.getHeaderArray(csvRecordsArray);
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
        this.csvArr = [];
        let contentValue = [];

        for (let i = 1; i < csvRecordsArray.length; i++) {
            contentValue = <any>csvRecordsArray[i].split(',');
            this.csvArr.push({
                contentValue: contentValue,
                isChecked: false
            });
        }
        return this.csvArr;
    }


    save() {
        this.records.forEach(item=>{
            if (item.isChecked) {

                this.instanceInfoService.save(this.records, this.productId).then(id => {
                    // @ts-ignore
                    Toast.makeText('ثبت شد!!').show();
                }, error => {
                    console.log("INSERT ERROR", error);
                });
            }
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

    public loadItemCahr() {
        this.itemCharacter = [];
        // @ts-ignore
        for (let item of this.sanjeshData.inspectionOperationItem.identifyCharacters) {
            this.itemCharacter.push({
                identifyCharacterId: item.id,
                title: item.title,
                value: ""
            });
        }

    }

    fetch() {
        this.itemService.All("SELECT * FROM itemTbl e where e.inspectionReportId=" + this.inspectionReportId).then(rows => {
            this.itemList = [];
            for (var row in rows) {
                this.itemList.push({
                    id: rows[row][0],
                    productCharacteristic: JSON.parse(rows[row][1]),
                    description: rows[row][2],
                    inspectionReportId: rows[row][3]
                }
                );

            }
        }, error => {
            console.log("SELECT ERROR", error);
        });
    }


}
