import {NgModule} from "@angular/core";
import {NativeScriptRouterModule} from "nativescript-angular/router";
import {Routes} from "@angular/router";

import {HomeComponent} from "~/app/home/home.component";
import {InspectionOperationComponent} from "~/app/home_page/inspection-operation/inspection-operation.component";
import {TabsModule} from "~/app/inspection-module/tabs/tabs.module";
import {RegisterComponent} from "~/app/register/register.component";
import {InstanceComponent} from "~/app/inspection-module/tabs/instanceComponent/instance.component";
import {InstanceEditComponent} from "~/app/inspection-module/tabs/instanceComponent/instance-edit.component";

const routes: Routes = [
    {path: "", component: HomeComponent},
    {path: "home", component: HomeComponent},
    {path: "inspectionOperation", component: InspectionOperationComponent},
    {path: "register", component: RegisterComponent},
    {path: "tabs", loadChildren: () => TabsModule}
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule {
}
