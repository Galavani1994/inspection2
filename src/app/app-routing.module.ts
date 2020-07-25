import {NgModule} from "@angular/core";
import {NativeScriptRouterModule} from "nativescript-angular/router";
import {Routes} from "@angular/router";

import {HomeComponent} from "~/app/home/home.component";
import {InspectionOperationComponent} from "~/app/home_page/inspection-operation/inspection-operation.component";
import {TabsModule} from "~/app/inspection-module/tabs/tabs.module";
import {InstanceInfoComponent} from "~/app/inspection-module/tabs/instanceInfoComponent/instanceInfo.component";

const routes: Routes = [
    {path: "", component: HomeComponent},
    {path: "home", component: HomeComponent},
    {path: "inspectionOperation", component: InspectionOperationComponent},
    {path: "tabs", loadChildren: () => TabsModule}
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule {
}
