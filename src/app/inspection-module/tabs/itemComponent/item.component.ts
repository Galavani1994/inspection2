import {Component, OnInit} from "@angular/core";
import * as appSettings from "tns-core-modules/application-settings";
import {ItemsService} from "~/app/inspection-module/tabs/services/items/items.service";
import {Item} from "~/app/inspection-module/tabs/itemComponent/item.model";
import * as Toast from "nativescript-toast";
import * as dialogs from "tns-core-modules/ui/dialogs";
import {CheckListService} from "~/app/inspection-module/tabs/services/checkList/checkList.service";

declare var main: any;

@Component({
    selector: 'item-list',
    templateUrl: './item.component.html',
    styleUrls: ['./item.component.css'],
    moduleId: module.id,
})
export class ItemComponent implements OnInit {
    sanjeshData = []
    productTitle: string;
    productId: number;
    public itemCharacter = [];
    update = false;
    itemList: Item[];
    itemDescription = "";
    characterId = -1;
    inspectionReportId: number;
    btnInsertLable = 'افزودن';


    constructor(private itemService: ItemsService,
                public checkListService: CheckListService) {
        this.sanjeshData = JSON.parse(appSettings.getString('sanjeshData'));
        // @ts-ignore
        this.productTitle = this.sanjeshData.productTitle;
        // @ts-ignore
        this.productId = this.sanjeshData.productId;
        // @ts-ignore
        this.inspectionReportId = this.sanjeshData.inspectionReport.id;

        this.loadItemCahr();
    }

    ngOnInit(): void {

    }

    public clearData() {
        for (let i of this.itemCharacter) {
            i.value = '';
        }
        this.characterId = -1;
        this.itemDescription = "";
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
        this.fetch();
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

    genCols(item) {
        let columns = "100 ,100 ";
        item.forEach((el) => {
            columns += ",100 ";
        })
        return columns
    }

    genRows(item) {
        let rows = "*";
        item.forEach((el) => {
            rows += ",*";
        })
        return rows
    }

    edit(id) {
        this.characterId = id;
        this.btnInsertLable = 'ثبت';
        this.itemService.All("select * FROM  itemTbl WHERE id=" + id).then(de => {
            this.characterId = de[0][0];
            this.itemCharacter = JSON.parse(main.java.org.inspection.AES.decrypt(de[0][1], appSettings.getString('dbKey')));
            this.itemDescription = de[0][2]
        }, error => {
            console.log('errore is...', error);
        });
    }

    public insert() {
        // @ts-ignore
        if (this.sanjeshData.notificationInspectionType != 1 && this.itemCharacter.find(x => x.value == "") != undefined) {
            Toast.makeText("همه فیلدها باید مقدار دهی شوند").show();
            return false;
        }
        // @ts-ignore
        if (this.sanjeshData.notificationInspectionType == 1 && this.itemDescription == "") {
            Toast.makeText("در حالت نمونه ای مقدار شرح باید مقدار دهی شود.").show();
            return false;
        }
        if (this.characterId == -1) {
            this.itemService.excute2("INSERT INTO itemTbl (productCharacter,description,inspectionReportId) VALUES (?,?,?)", [main.java.org.inspection.AES.encrypt(JSON.stringify(this.itemCharacter), appSettings.getString('dbKey')), this.itemDescription, this.inspectionReportId]).then(id => {
                Toast.makeText('ثبت شد').show();
                console.log("INSERT RESULT", id);
            }, error => {
                console.log("INSERT ERROR", error);
            });
        } else {
            this.itemService.excute2("update itemTbl set productCharacter= ?,description=? WHERE id=?", [main.java.org.inspection.AES.encrypt(JSON.stringify(this.itemCharacter), appSettings.getString('dbKey')), this.itemDescription, this.characterId]).then(id => {
                Toast.makeText('ویرایش  شد').show();
                console.log("updateed RESULT", id);
                this.btnInsertLable = 'افزودن';
            }, error => {
                console.log("update ERROR", error);
            });
        }
        this.fetch();
        this.clearData();
    }

    delete(id) {
        dialogs.confirm({
            title: "پیغام حذف",
            message: "از حذف این آیتم مطمئن هستید؟",
            okButtonText: "بلی",
            cancelButtonText: "خیر"
        }).then(res => {
            if (res) {
                if (this.characterId != -1) {
                    alert('ابتدا عملیات ویرایش را تمام کنید');
                } else {
                    this.checkListService.All("select count(*) from SGD_inspectionReportCheckList t where t.inspectionReportProductId=" + id).then(result => {
                        if (result[0][0] == 0) {
                            this.itemService.excute("DELETE FROM  itemTbl WHERE id=" + id).then(de => {
                                Toast.makeText("رکورد موردنظر باموفقیت حذف شد").show();
                            }, error => {
                                console.log('errore is....', error);
                            });
                            this.fetch();
                        } else {
                            Toast.makeText("برای این مشخصه در چک لیست مقدار ثبت شده است").show();
                        }
                    }, error => {
                        console.log("message error is..." + error);
                    });

                }

            }
        })

    }


}
