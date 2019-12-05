import {Component, OnInit} from '@angular/core';
import {UserService} from "~/app/inspection-module/tabs/services/user/user.service";
import * as Toast from "nativescript-toast";
import {error} from "tns-core-modules/trace";
import {Router} from "@angular/router";

@Component({
    selector: 'ns-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css'],
    moduleId: module.id,
})
export class RegisterComponent implements OnInit {
    firstName = '';
    lastName = '';
    nationalCode = null;
    personnelCode = null;

    constructor(private userService:UserService,private router:Router) {
        this.userService;
    }

    ngOnInit() {
    }

    insertUser() {

        if(this.firstName==null || this.firstName==''){
            Toast.makeText('فیلد نام اجباری است').show();
            return;
        }
        if(this.lastName==null || this.lastName==''){
            Toast.makeText('فیلد نام خانوادگی اجباری است').show();
            return;
        }
        if(this.nationalCode==null || this.nationalCode==''){
            Toast.makeText('فیلد کدملی اجباری است').show();
            return;
        }
        if(this.personnelCode==null || this.personnelCode==''){
            Toast.makeText('فیلد شماره پرسنلی اجباری است').show();
            return;
        }
        this.userService.All("select count(*) from userTbl t where t.nationalCode= "+this.nationalCode).then(obj=>{
            if(obj[0][0]==0){
                this.userService.excute2("insert into userTbl(firstName,lastName,nationalCode,personnelCode) values (?,?,?,?)",[this.firstName,this.lastName,this.nationalCode,this.personnelCode]).then(id=>{
                    Toast.makeText('ثبت شد').show();
                    this.clearUser();
                    console.log("INSERT RESULT", id);
                    this.router.navigateByUrl('');
                },error=>{
                    console.log("INSERT ERROR", error);
                });
            }else {
                let  toast=Toast.makeText('چنین کاربری با این کد ملی ثبت شده است.');
                toast.show();
                return;
            }
        },error=>{
           console.log("error is..."+error);
        });

    }

    clearUser(){
        this.firstName='';
        this.lastName='';
        this.nationalCode=null;
        this.personnelCode=null;
    }
}
