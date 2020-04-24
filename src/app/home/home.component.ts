import {Component, OnInit} from '@angular/core';
import * as appSettings from "tns-core-modules/application-settings";
import {Router} from "@angular/router";
import {UserService} from "~/app/inspection-module/tabs/services/user/user.service";
import * as application from "tns-core-modules/application";
import {AndroidActivityBackPressedEventData, AndroidApplication} from "tns-core-modules/application";
import {exit} from 'nativescript-exit';
import * as dialogs from "tns-core-modules/ui/dialogs";
import {Toast} from "nativescript-toast";

var CryptoTS = require("crypto-ts");

//let application = require("application");

declare var org:any;
@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    moduleId: module.id,
})
export class HomeComponent implements OnInit {
    username = null;
    password = null;

    constructor(private userService: UserService, private router: Router) {
      
    }

    public login() {
        this.router.navigateByUrl('/inspectionOperation');
        /*if (this.username != null && this.password != null) {
            this.userService.All("select COUNT(*) from userTbl t where t.nationalCode= " + this.username + " and t.personnelCode=" + this.password).then(res => {
                if (res[0][0] > 0 && res[0][0] == 1) {

                    appSettings.setString('username',this.username);
                    appSettings.setString('password',this.password);
                    this.router.navigateByUrl('/inspectionOperation');
                    appSettings.setBoolean("isLogin", true);
                } else {
                    Toast.makeText('نام کاربری / رمز عبور اشتباه است').show();
                }
            }, error => {
                Toast.makeText('نام کاربری / رمز عبور اشتباه است').show();
            });
        } else {
            Toast.makeText("نام کاربری/رمز عبور باید مقدار دهی شود").show();
        }*/
       // org.example.MyToast.showToast(application.android.context,"السلام علی الحسین علیه السلام","short");

    }

    ngOnInit(): void {
        appSettings.setBoolean("isLogin", false);
        application.android.on(AndroidApplication.activityBackPressedEvent, (data: AndroidActivityBackPressedEventData) => {
            if (this.router.isActive("/inspectionOperation",false)) {
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

    }


}
