import {Component, OnInit} from '@angular/core';
import * as appSettings from "tns-core-modules/application-settings";
import {Router} from "@angular/router";
import {UserService} from "~/app/inspection-module/tabs/services/user/user.service";
import * as application from "tns-core-modules/application";
import {AndroidActivityBackPressedEventData, AndroidApplication} from "tns-core-modules/application";
import {exit} from 'nativescript-exit';
import * as dialogs from "tns-core-modules/ui/dialogs";
import * as Toast from "nativescript-toast";
import {DropDown} from "nativescript-drop-down";

var CryptoTS = require("crypto-ts");


declare var org: any;

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    moduleId: module.id,
})
export class HomeComponent implements OnInit {
    nationalCode: string;
    inspectorCode: string;
    manDayType=[];
    manDayTypeIndex=0;

    constructor(private userService: UserService, private router: Router) {

    }

    public login() {
        if (this.nationalCode != null && this.inspectorCode != null) {
            appSettings.setString('nationalCode', this.nationalCode);
            appSettings.setString('inspectorCode', this.inspectorCode);
            appSettings.setNumber('manDayType', this.manDayTypeIndex);
            this.router.navigateByUrl('/inspectionOperation');
        } else {
            Toast.makeText('نام کاربری  و رمز عبور الزامی است.').show();
        }
    }

    ngOnInit(): void {
        application.android.on(AndroidApplication.activityBackPressedEvent, (data: AndroidActivityBackPressedEventData) => {
            if (this.router.isActive("/inspectionOperation", false)) {
                data.cancel = true; // prevents default back button behavior
                dialogs.confirm({
                    title: "خروج",
                    message: "آیا تمایل دارید از برنامه خارج شوید؟",
                    okButtonText: "بلی",
                    cancelButtonText: "خیر"
                }).then(res => {
                    if (res) {
                        exit();
                    }
                });
            }
        });
        this.manDayType=['A','A1','B','C'];
    }

    onSelectedIndexChanged(args){
       /* let picker = <DropDown>args.object;
        this.inspectionReportcheckList.inspectionReportProductId = this.itemCharIds[picker.selectedIndex];*/
    }


}
