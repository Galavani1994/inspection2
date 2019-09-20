import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Routes } from "@angular/router";

import {HomeComponent} from "~/app/home/home.component";
import {InspectionOperationComponent} from "~/app/home_page/inspection-operation/inspection-operation.component";
import {TabsComponent} from "~/app/home_page/inspection-operation/tabs/tabs.component";

const routes: Routes = [
    { path: "", redirectTo: "/home", pathMatch: "full" },
    { path: "home", component: HomeComponent },
    { path: "inspectionOperation", component: InspectionOperationComponent },
    { path: "tabs", component: TabsComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
