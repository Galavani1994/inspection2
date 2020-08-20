import {AfterViewInit, Component, OnInit} from '@angular/core';
import * as appSettings from "tns-core-modules/application-settings";
import {Router} from "@angular/router";
import {UserService} from "~/app/inspection-module/tabs/services/user/user.service";
import * as application from "tns-core-modules/application";
import {AndroidActivityBackPressedEventData, AndroidApplication} from "tns-core-modules/application";
import {exit} from 'nativescript-exit';
import * as dialogs from "tns-core-modules/ui/dialogs";
import * as Toast from "nativescript-toast";
import {RootDetection} from 'nativescript-root-detection';


declare var org: any;

const rooted=RootDetection.isDeviceRooted();

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    moduleId: module.id,
})
export class HomeComponent implements OnInit {
    nationalCode: string;
    inspectorCode: string;
    manDayType = [];
    manDayTypeIndex = 0;

    constructor( private router: Router) {
    }

    ngOnInit(): void {

        this.checkRooted(null);
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
        this.manDayType = ['A', 'A1', 'B', 'C'];
    }
    checkRooted(args){
        if (rooted) {
            dialogs.confirm({
                title: "هشدار امنیتی",
                message: "به دلیل روت بودن دستگاه، شما قادر به ادامه ی کار با نرم افزار نیستید.",
                okButtonText: "بلی"
            }).then(res => {
                    exit();
            });
        }
    }
    public login() {
        this.checkRooted(null);
        if (this.nationalCode != null && this.inspectorCode != null) {
            appSettings.setString('nationalCode', this.nationalCode);
            appSettings.setString('inspectorCode', this.inspectorCode);
            appSettings.setNumber('manDayType', this.manDayTypeIndex);
            this.router.navigateByUrl('/inspectionOperation');
        } else {
            Toast.makeText('نام کاربری  و رمز عبور الزامی است.').show();
        }
    }


    onSelectedIndexChanged(args) {
        this.checkRooted(args);
    }


}
