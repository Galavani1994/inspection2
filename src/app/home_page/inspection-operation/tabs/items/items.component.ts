import {Component, DoCheck, OnInit} from "@angular/core";
import {DropDown} from "nativescript-drop-down";

import * as Toast from 'nativescript-toast';
import {ItemsService} from "~/app/services/items/items.service";
import * as dialogs from "tns-core-modules/ui/dialogs";

var Sqlite = require("nativescript-sqlite");
var data=require("~/app/product_file/703.json");
// import data from "data/storage/emulated/0/Folder/673.json";

@Component({
    selector: "app-items",
    templateUrl: "./items.component.html",
    styleUrls: ["./items.component.css"],
    moduleId: module.id
})
export class ItemsComponent implements OnInit {
    private database: any;
    public resultItemChsrschter: Array<any>;

    id: number = 0;
    newId: number;
    update = false;
    inspectionItem = [];
    productTitles = [];
    identifyCharacters = [];
    public itemCharacter = [];
    public selectedIndex = 0;
    public index: number;
    allow = false;
    show = false;
    proTitle = '';
    proId = '';
    productId = '';
    public mainId: number;
    columns: string = "auto,auto,auto,auto";

    public constructor(public itemService: ItemsService) {
        this.itemService;
    }

    ngOnInit() {

        this.inspectionItem = data.inspectionOperationItems;
        for (let item of this.inspectionItem) {
            this.productTitles.push(item.productTitle);
        }
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


    public clearData() {
        for (let i of this.itemCharacter) {
            i.value = '';
        }
    }


    public selectedIndexChanged(args) {
        let picker = <DropDown>args.object;
        let itemName = picker.items[picker.selectedIndex];
        if (itemName != 0) {
            this.itemCharacter = [];
            let titleIndex = this.inspectionItem.findIndex(obj => obj.productTitle == itemName);
            for (let it of this.inspectionItem[titleIndex].identifyCharacters) {
                this.proId = it.productId;
                this.proTitle = it.productTitle;
                this.itemCharacter.push(
                    {title: it.title, value: "", productName: it.productTitle, productId: it.productId}
                );
            }
            this.allow = true;
            this.fetch();
        } else {
            this.allow = false;
        }
    }

    public deleteTable() {
        this.itemService.excute("DROP TABLE itemTbl").then(de => {
            Toast.makeText("جدول مورد نظر حذف شد").show();
        }, error => {
            console.log('errore is...', error);
        });
    }

    public insert() {
        if (this.update == false && this.newId == null) {
            this.itemService.excute2("INSERT INTO itemTbl (productCharacter,productName,productId) VALUES (?,?,?)", [JSON.stringify(this.itemCharacter), this.proTitle, this.proId]).then(id => {
                Toast.makeText('ثبت شد').show();
                console.log("INSERT RESULT", id);
            }, error => {
                console.log("INSERT ERROR", error);
            });
        } else {
            this.itemService.excute2("update itemTbl set productCharacter= ? WHERE id=?", [JSON.stringify(this.itemCharacter), this.newId]).then(id => {
                Toast.makeText('ویرایش  شد').show();
                console.log("updateed RESULT", id);
            }, error => {
                console.log("update ERROR", error);
            });
        }
        this.fetch();
        this.clearData();
        this.update = false;
        this.newId = null;
    }

    public fetch() {
        this.itemService.All("SELECT * FROM itemTbl e where e.productId=" + this.proId).then(rows => {
            this.resultItemChsrschter = [];
            for (var row in rows) {
                this.resultItemChsrschter.push({
                        id: rows[row][0],
                        values: JSON.parse(rows[row][1])
                    }
                );

            }
        }, error => {
            console.log("SELECT ERROR", error);
        });

        this.show = true;

    }

    delete(id) {
        dialogs.confirm({
            title: "پیغام حذف",
            message: "از حذف این آیتم مطمئن هستید؟",
            okButtonText: "بلی",
            cancelButtonText: "خیر"
        }).then(res => {
            if (res) {
                if(this.update){
                    alert('ابتدا عملیات ویرایش را تمام کنید');
                }else {
                    this.itemService.excute("DELETE FROM  itemTbl WHERE id=" + id).then(de => {
                        Toast.makeText("رکورد موردنظر باموفقیت حذف شد").show();
                    }, error => {
                        console.log('errore is....', error);
                    });
                    this.fetch();
                }

            }
        })

    }

    edit(id) {
        this.newId = id;
        this.update = true;
        this.itemService.All("select * FROM  itemTbl WHERE id=" + id).then(de => {

            this.itemCharacter = JSON.parse(de[0][1]);
            console.log('selected data is...', JSON.parse(de[0][1]));
        }, error => {
            console.log('errore is...', error);
        });
    }

}

