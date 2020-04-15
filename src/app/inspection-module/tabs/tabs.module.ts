import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {NativeScriptCommonModule} from 'nativescript-angular/common';


import {DropDownModule} from "nativescript-drop-down/angular";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NativeScriptFormsModule, NativeScriptRouterModule} from "nativescript-angular";
import {NativeScriptPickerModule} from "nativescript-picker/angular";
import {TNSCheckBoxModule} from "@nstudio/nativescript-checkbox/angular";
import {ItemModalComponent} from "~/app/inspection-module/tabs/modals/item-modal/item-modal.component";
import {QuestionsModalComponent} from "~/app/inspection-module/tabs/modals/check-list-modal/questions-modal.component";
import {AnswerModalComponent} from "~/app/inspection-module/tabs/modals/check-list-modal/check-list-answer/answer-modal.component";
import {CheckListAnswerPhotoComponent} from "~/app/inspection-module/tabs/modals/check-list-modal/check-list-answer-photo/check-list-answer-photo.component";

import {Routes} from "@angular/router";

import {TabsComponent} from "~/app/inspection-module/tabs/tabs.component";
import {InstanceEditComponent} from "~/app/inspection-module/tabs/instanceComponent/instance-edit.component";
import {InstanceComponent} from "~/app/inspection-module/tabs/instanceComponent/instance.component";


const tabsRoutes: Routes = [

    { path:'',component:TabsComponent}
];

@NgModule({
    declarations: [

        ItemModalComponent,
        QuestionsModalComponent,
        AnswerModalComponent,
        CheckListAnswerPhotoComponent,
        TabsComponent,
        InstanceComponent,
        InstanceEditComponent
    ],
    imports: [
        NativeScriptCommonModule,
        DropDownModule,
        FormsModule,
        ReactiveFormsModule,
        NativeScriptFormsModule,
        NativeScriptPickerModule,
        TNSCheckBoxModule,
        NativeScriptRouterModule.forChild(tabsRoutes)
    ],
    schemas: [NO_ERRORS_SCHEMA],
    entryComponents:[
        ItemModalComponent,
        QuestionsModalComponent,
        AnswerModalComponent,
        CheckListAnswerPhotoComponent
    ]
})
export class TabsModule {
}
