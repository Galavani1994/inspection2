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
import {ModalDialogParams} from "nativescript-angular";
import {InstanceService} from "~/app/inspection-module/tabs/instanceComponent/instance.service";
import {capitalizationType} from "tns-core-modules/ui/dialogs";
import all = capitalizationType.all;

let csvToJson = require('convert-csv-to-json');
declare var main: any;

@Component({
    selector: 'instanceInfoGrid',
    templateUrl: './instance-info-grid.component.html',
    styleUrls: ['./instanceInfo.component.css'],
    moduleId: module.id,
})
export class InstanceInfoGridComponent implements OnInit {

    @ViewChild('selectAll', {static: false}) selectAll: ElementRef;

    @Input()
    productId: number;
    fileName = "فایلی انتخاب نشده است ";
    public records: CSVRecord[] = [];
    public selectedInInstance: CSVRecord[] = [];

    public itemCharacter: IdentifyCharacter[] = [];
    itemList: Item[];
    sanjeshData = [];
    inspectionReportId: number;
    csvArr: CSVRecord[] = [];
    selelctRecord: CSVRecord[] = [];
    eventName: any;
    checkListCategoryId: any;

    constructor(private instanceInfoService: InstanceInfoService,
                private itemService: ItemsService,
                private instanceService: InstanceService,
                private dialogParams: ModalDialogParams) {
        this.eventName = this.dialogParams.context.eventName;
        this.checkListCategoryId = this.dialogParams.context.checkListCategoryId;
        this.selectedInInstance = this.dialogParams.context.selecterecord;

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


    selected(entity) {
        for (let item of entity) {
            if (item.isChecked) {
                this.selelctRecord.push(item);
            }
        }
        this.dialogParams.closeCallback(this.selelctRecord);
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
                        productCharacteristic: JSON.parse(main.java.org.inspection.AES.decrypt(rows[row][1], appSettings.getString('dbKey'))),
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
        let allRecords = [];
        if (this.eventName == 'answerModal') {
            this.instanceService.All("select * from instacneTbl where inspectionReportId=" + this.inspectionReportId + " and checkListCategoryId=" + this.checkListCategoryId).then(rows => {
                this.records = [];
                for (var row in rows) {
                    allRecords.push(JSON.parse(main.java.org.inspection.AES.decrypt(rows[row][1], appSettings.getString('dbKey'))).selectedInstance);
                }
                /*allRecords.forEach(item => {
                    item.forEach(item_0 => {
                        if (item_0.isChecked == true) {
                            item_0.isChecked = false;
                            this.records.push(item_0);
                        }
                    })
                })*/


                if (this.selectedInInstance != undefined && this.selectedInInstance.length > 0) {
                    allRecords.forEach(item => {
                        item.forEach(item_0 => {
                            if (item_0.isChecked == true) {
                                item_0.isChecked = false;
                                this.records.push(item_0);
                            }
                        })
                    })
                    this.records.forEach(item => {
                        this.selectedInInstance.forEach(record => {
                            if (item.id == record.id) {
                                // @ts-ignore
                                item.isChecked = 'true';
                            }
                        });
                    })
                } else {
                    allRecords.forEach(item => {
                        item.forEach(item_0 => {
                            if (item_0.isChecked == true) {
                                item_0.isChecked = false;
                                this.records.push(item_0);
                            }
                        })
                    })
                }
            })
        } else {
            this.instanceInfoService.All("SELECT * FROM SGD_inspection_report_item ch  where ch.inspectionReportId=" + this.inspectionReportId).then(rows => {
                this.records = [];
                for (var row in rows) {
                    allRecords.push({
                            id: rows[row][0],
                            contentValue: JSON.parse(main.java.org.inspection.AES.decrypt(rows[row][1], appSettings.getString('dbKey'))),
                            isChecked: rows[row][3]
                        }
                    );

                }
                if (this.selectedInInstance != undefined && this.selectedInInstance.length > 0) {
                    allRecords.forEach(item => {
                        if (item.isChecked == 'true') {
                            item.isChecked = 'false';
                            this.records.push(item);
                        }
                    })
                    this.records.forEach(item => {
                        this.selectedInInstance.forEach(record => {
                            if (item.id == record.id) {
                                // @ts-ignore
                                item.isChecked = 'true';
                            }
                        });
                    })
                } else {
                    allRecords.forEach(item => {
                        if (item.isChecked == 'true') {
                            item.isChecked = 'false';
                            this.records.push(item);
                        }
                    })
                }

            }, error => {
                console.log("SELECT ERROR", error);
            });
        }

    }


}
