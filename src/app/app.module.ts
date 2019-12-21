import {NgModule, NO_ERRORS_SCHEMA} from "@angular/core";
import {NativeScriptModule} from "nativescript-angular/nativescript.module";

import {AppRoutingModule} from "./app-routing.module";
import {AppComponent} from "./app.component";
import {HomeComponent} from "~/app/home/home.component";
import {InspectionOperationComponent} from "~/app/home_page/inspection-operation/inspection-operation.component";
import {TabsComponent} from "~/app/inspection-module/tabs/tabs.component";
import {DropDownModule} from "nativescript-drop-down/angular";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ModalDialogParams, ModalDialogService, NativeScriptFormsModule} from "nativescript-angular";


import {NativeScriptPickerModule} from "nativescript-picker/angular";
import {TNSCheckBoxModule} from "@nstudio/nativescript-checkbox/angular";
import {TabsModule} from "~/app/inspection-module/tabs/tabs.module";
import { RegisterComponent } from './register/register.component';
import {ItemModalComponent} from "~/app/inspection-module/tabs/modals/item-modal/item-modal.component";
import {QuestionsModalComponent} from "~/app/inspection-module/tabs/modals/check-list-modal/questions-modal.component";
import {AnswerModalComponent} from "~/app/inspection-module/tabs/modals/check-list-modal/check-list-answer/answer-modal.component";
import {CheckListAnswerPhotoComponent} from "~/app/inspection-module/tabs/modals/check-list-modal/check-list-answer-photo/check-list-answer-photo.component";
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
