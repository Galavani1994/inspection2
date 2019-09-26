import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import {HomeComponent} from "~/app/home/home.component";
import {InspectionOperationComponent} from "~/app/home_page/inspection-operation/inspection-operation.component";
import {TabsComponent} from "~/app/home_page/inspection-operation/tabs/tabs.component";
import {InformationComponent} from "~/app/home_page/inspection-operation/tabs/information/information.component";
import {ItemsComponent} from "~/app/home_page/inspection-operation/tabs/items/items.component";
import {DropDownModule} from "nativescript-drop-down/angular";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NativeScriptFormsModule} from "nativescript-angular";

import {InstanceComponent} from "~/app/home_page/inspection-operation/tabs/instance/instance.component";
import {EquipmentsComponent} from "~/app/home_page/inspection-operation/tabs/equipments/equipments.component";
import {StandardsComponent} from "~/app/home_page/inspection-operation/tabs/standards/standards.component";
import {ItemModalComponent} from "~/app/home_page/modals/item-modal/item-modal.component";
import {CheckListModalComponent} from "~/app/home_page/modals/check-list-modal/check-list-modal.component";
import {CheckListAnswerComponent} from "~/app/home_page/modals/check-list-modal/check-list-answer/check-list-answer.component";
import {CheckListAnswerPhotoComponent} from "~/app/home_page/modals/check-list-modal/check-list-answer-photo/check-list-answer-photo.component";
import {CheckListComponent} from "~/app/home_page/inspection-operation/tabs/check-list/check-list.component";
import {NativeScriptPickerModule} from "nativescript-picker/angular";
import {TNSCheckBoxModule} from "@nstudio/nativescript-checkbox/angular";






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
        TNSCheckBoxModule

    ],
    declarations: [
        AppComponent,
        HomeComponent,
        InspectionOperationComponent,
        TabsComponent,
        InformationComponent,
        ItemsComponent,
        CheckListComponent,
        InstanceComponent,
        EquipmentsComponent,
        StandardsComponent,
        ItemModalComponent,
        CheckListModalComponent,
        CheckListAnswerComponent,
        CheckListAnswerPhotoComponent
    ],
    providers: [],
    schemas: [
        NO_ERRORS_SCHEMA
    ],
    entryComponents:[
        ItemModalComponent,
        CheckListModalComponent,
        CheckListAnswerComponent,
        CheckListAnswerPhotoComponent
    ]
})
/*
Pass your application module to the bootstrapModule function located in main.ts to start your app
*/
export class AppModule { }
