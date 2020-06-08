import {Component, ElementRef, Input, OnInit, ViewChild} from "@angular/core";
import {FilePickerOptions, Mediafilepicker} from "nativescript-mediafilepicker";
import {File} from "tns-core-modules/file-system";
import {CSVRecord} from "~/app/inspection-module/tabs/instanceInfoComponent/CSVRecord .model";
import {InstanceInfoService} from "~/app/inspection-module/tabs/instanceInfoComponent/instanceInfo.service";
import * as Toast from "nativescript-toast";
import * as dialogs from "tns-core-modules/ui/dialogs";
import {Item} from "~/app/inspection-module/tabs/itemComponent/item.model";
import * as appSettings from "tns-core-modules/application-settings";
import {ItemsService} from "~/app/inspection-module/tabs/services/items/items.service";
import {IdentifyCharacter} from "~/app/inspection-module/tabs/instanceInfoComponent/identify-character.model";

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

    public itemCharacter: IdentifyCharacter[] = [];
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
        this.loadAll();
    }

    genCols(item) {
        let columns = "100,100";
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
            this.records.forEach(item => {
                item.isChecked = false;
                this.selectAll.nativeElement.checked = false;
            })
        } else {
            this.records.forEach(item => {
                item.isChecked = true;
                this.selectAll.nativeElement.checked = true;
            })
        }

    }

    get_data() {
        this.uploadFile().then(result => {
            this.save(result);
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
                let entityList: any;
                file.readText()
                    .then((result) => {
                        let csvRecordsArray = (<string>result).split(/\r\n|\n/);
                        let headerArray = this.getHeaderArray(csvRecordsArray);
                        entityList = this.getDataRecordsArrayFromCSVFile(csvRecordsArray);
                        resolve(entityList);
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
        let records = [];


        for (let i = 2; i < csvRecordsArray.length; i++) {
            records = <any>csvRecordsArray[i].split(',');
            let contentValue: IdentifyCharacter[] = [];
            for (let i = 0; i < this.itemCharacter.length; i++) {
                contentValue.push({
                    identifyCharacterId: this.itemCharacter[i].identifyCharacterId,
                    title: this.itemCharacter[i].title,
                    value: records[i]
                })
            }

            this.csvArr.push({
                id: '-1',
                contentValue: contentValue,
                isChecked: false
            });
        }
        return this.csvArr;
    }


    save(entity) {

        for (let item of entity) {
            if (item.id != '-1') {
                this.instanceInfoService.update(item.id, item.isChecked).then(id => {

                }, error => {
                    console.log("INSERT ERROR", error);
                })
            } else {
                let date = Date.now();
                this.instanceInfoService.save(date.toString(), item.contentValue, this.inspectionReportId, item.isChecked).then(id => {

                }, error => {
                    console.log("INSERT ERROR", error);
                })
            }

        }
        // @ts-ignore
        Toast.makeText('ثبت رکوردها انجام شد.').show();
        this.loadAll();

    }

    delteAllData() {
        dialogs.confirm({
            title: "پیغام حذف",
            message: "از حذف این آیتم مطمئن هستید؟",
            okButtonText: "بلی",
            cancelButtonText: "خیر"
        }).then(res => {
            if (res) {
                this.instanceInfoService.clearDB(this.inspectionReportId).then(id => {
                    // @ts-ignore
                    Toast.makeText('تمامی رکوردهای ذخیره شده برای این گزارش در دیتابیس پاک شدند.!!').show();
                    this.loadAll();
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

    loadAll() {
        this.instanceInfoService.All("SELECT * FROM SGD_inspection_report_item ch  where ch.inspectionReportId=" + this.inspectionReportId).then(rows => {
            this.records = [];
            for (var row in rows) {
                this.records.push({
                        id: rows[row][0],
                        contentValue: JSON.parse(rows[row][1]),
                        isChecked: rows[row][3]
                    }
                );

            }
        }, error => {
            console.log("SELECT ERROR", error);
        });
    }


}
