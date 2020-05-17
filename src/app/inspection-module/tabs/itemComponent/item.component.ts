import {Component, OnInit} from "@angular/core";
import * as appSettings from "tns-core-modules/application-settings";
import {ItemsService} from "~/app/inspection-module/tabs/services/items/items.service";
import {Item} from "~/app/inspection-module/tabs/itemComponent/item.model";
import * as Toast from "nativescript-toast";
import * as dialogs from "tns-core-modules/ui/dialogs";
import {CheckListService} from "~/app/inspection-module/tabs/services/checkList/checkList.service";


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


    constructor(private itemService: ItemsService,
                public checkListService: CheckListService) {
        this.sanjeshData = JSON.parse(appSettings.getString('sanjeshData'));
        // @ts-ignore
        this.productTitle = this.sanjeshData.productTitle;
        // @ts-ignore
        this.productId = this.sanjeshData.productId;
        this.loadItemCahr();
    }

    ngOnInit(): void {

    }

    public clearData() {
        for (let i of this.itemCharacter) {
            i.value = '';
        }
        this.characterId = -1;
        this.itemDescription="";
    }

    public loadItemCahr() {
        this.itemCharacter = [];
        // @ts-ignore
        for (let item of this.sanjeshData.inspectionOperationItems[0].identifyCharacters) {
            this.itemCharacter.push({
                id: item.id,
                title: item.title,
                value: "",
                productId: item.productId
            });
        }
        this.fetch();
    }

    fetch() {
        this.itemService.All("SELECT * FROM itemTbl e where e.productId=" + this.productId).then(rows => {
            this.itemList = [];
            for (var row in rows) {
                this.itemList.push({
                        id: rows[row][0],
                        productCharacter: JSON.parse(rows[row][1]),
                        description: rows[row][2],
                        product: rows[row][3],
                        productId: rows[row][4]
                    }
                );

            }
        }, error => {
            console.log("SELECT ERROR", error);
        });
    }

    genCols(item) {
        let columns = "100 ,100,100 ";
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
        this.itemService.All("select * FROM  itemTbl WHERE id=" + id).then(de => {
            this.characterId = de[0][0];
            this.itemCharacter = JSON.parse(de[0][1]);
            this.itemDescription = de[0][2]
        }, error => {
            console.log('errore is...', error);
        });
    }

    public insert() {
        // @ts-ignore
        if (this.sanjeshData.notificationInspectionType!=1&&this.itemCharacter.find(x => x.value == "") != undefined) {
            Toast.makeText("همه فیلدها باید مقدار دهی شوند").show();
            return false;
        }
        // @ts-ignore
        if (this.sanjeshData.notificationInspectionType==1 && this.itemDescription=="") {
            Toast.makeText("در حالت نمونه ای مقدار شرح باید مقدار دهی شود.").show();
            return false;
        }
        if (this.characterId == -1) {
            this.itemService.excute2("INSERT INTO itemTbl (productCharacter,description,productName,productId,inspectorId) VALUES (?,?,?,?,?)", [JSON.stringify(this.itemCharacter), this.itemDescription, this.productTitle, this.productId,54]).then(id => {
                Toast.makeText('ثبت شد').show();
                console.log("INSERT RESULT", id);
            }, error => {
                console.log("INSERT ERROR", error);
            });
        } else {
            this.itemService.excute2("update itemTbl set productCharacter= ? WHERE id=?", [JSON.stringify(this.itemCharacter), this.characterId]).then(id => {
                Toast.makeText('ویرایش  شد').show();
                console.log("updateed RESULT", id);
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
                if (this.characterId!=-1) {
                    alert('ابتدا عملیات ویرایش را تمام کنید');
                } else {
                    this.checkListService.All("select count(*) from checkListTbl t where t.identifyCharId=" + id).then(result => {
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
