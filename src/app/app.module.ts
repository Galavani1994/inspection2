import {NgModule, NO_ERRORS_SCHEMA} from "@angular/core";
import {NativeScriptModule} from "nativescript-angular/nativescript.module";

import {AppRoutingModule} from "./app-routing.module";
import {AppComponent} from "./app.component";
import {HomeComponent} from "~/app/home/home.component";
import {InspectionOperationComponent} from "~/app/home_page/inspection-operation/inspection-operation.component";
import {DropDownModule} from "nativescript-drop-down/angular";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NativeScriptFormsModule} from "nativescript-angular";


import {NativeScriptPickerModule} from "nativescript-picker/angular";
import {TNSCheckBoxModule} from "@nstudio/nativescript-checkbox/angular";
import {TabsModule} from "~/app/inspection-module/tabs/tabs.module";
import {RegisterComponent} from './register/register.component';
import {DatePipe} from "@angular/common";


@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptModule,
        AppRoutingModule,
        DropDownModule,
        FormsModule,
        ReactiveFormsModule,
        NativeScriptFormsModule,
        NativeScriptPickerModule,
        TNSCheckBoxModule,
        TabsModule

    ],
    declarations: [
        AppComponent,
        HomeComponent,
        InspectionOperationComponent,
        RegisterComponent,

    ],
    providers: [DatePipe],
    schemas: [
        NO_ERRORS_SCHEMA
    ],


})
/*
Pass your application module to the bootstrapModule function located in main.ts to start your app
*/
export class AppModule {
}
