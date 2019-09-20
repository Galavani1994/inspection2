import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Visibility} from "tns-core-modules/ui/enums";
import { TabView, TabViewItem, SelectedIndexChangedEventData } from "tns-core-modules/ui/tab-view";

import hidden = Visibility.hidden;
import {Observable} from "tns-core-modules/data/observable";

var data = require("~/app/product_file/666.json");

@Component({
    selector: 'app-tabs',
    templateUrl: './tabs.component.html',
    styleUrls: ['./tabs.component.css'],
    moduleId: module.id,
})
export class TabsComponent implements OnInit {

    constructor() {

    }

    ngOnInit() {

    }
    onLoaded(args) {
        const tabView: TabView = <TabView>args.object;
        const vm = new Observable();
        vm.set("tabSelectedIndex", 0);
        vm.set("tabSelectedIndexResult", "Profile Tab (tabSelectedIndex = 0 )");

        tabView.bindingContext = vm;
    }

     changeTab(args) {
        const vm = args.object.bindingContext;
        const tabSelectedIndex = vm.get("tabSelectedIndex");
        if (tabSelectedIndex === 0) {
            vm.set("tabSelectedIndex", 1);
        } else if (tabSelectedIndex === 1) {
            vm.set("tabSelectedIndex", 2);
        } else if (tabSelectedIndex === 2) {
            vm.set("tabSelectedIndex", 0);
        }
    }
// displaying the old and new TabView selectedIndex
   onSelectedIndexChanged(args: SelectedIndexChangedEventData) {
        if (args.oldIndex !== -1) {
            const newIndex = args.newIndex;
            const vm = (<TabView>args.object).bindingContext;
            if (newIndex === 0) {
                vm.set("tabSelectedIndexResult", "Profile Tab (tabSelectedIndex = 0 )");
            } else if (newIndex === 1) {
                vm.set("tabSelectedIndexResult", "Stats Tab (tabSelectedIndex = 1 )");
            } else if (newIndex === 2) {
                vm.set("tabSelectedIndexResult", "Settings Tab (tabSelectedIndex = 2 )");
            }
           /* dialogs.alert(`Selected index has changed ( Old index: ${args.oldIndex} New index: ${args.newIndex} )`)
                .then(() => {
                    console.log("Dialog closed!");
                });*/
        }
    }

}
