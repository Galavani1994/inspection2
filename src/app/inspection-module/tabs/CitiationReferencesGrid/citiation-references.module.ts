import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {NativeScriptCommonModule} from 'nativescript-angular/common';
import {DropDownModule} from "nativescript-drop-down/angular";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NativeScriptFormsModule} from "nativescript-angular";
import {NativeScriptPickerModule} from "nativescript-picker/angular";
import {TNSCheckBoxModule} from "@nstudio/nativescript-checkbox/angular";
import {CitiationReferencesGridComponent} from "~/app/inspection-module/tabs/CitiationReferencesGrid/citiation-references-grid.component";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        DropDownModule,
        FormsModule,
        ReactiveFormsModule,
        NativeScriptFormsModule,
        NativeScriptPickerModule,
        TNSCheckBoxModule
    ],
    declarations: [
        CitiationReferencesGridComponent
    ],
    entryComponents: [
        CitiationReferencesGridComponent
    ],
    exports: [CitiationReferencesGridComponent],
    schemas: [NO_ERRORS_SCHEMA],

})
export class CitiationReferencesModule {
}
