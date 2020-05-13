import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";

@Component({
    selector: 'defectiv-samples',
    templateUrl: './defective-samples.component.html',
    styleUrls: ['./defective-samples.component.css'],
    moduleId: module.id,
})
export class DefectiveSamplesComponent implements OnInit  {
    @ViewChild('selectAll',{static:false})selectAll:ElementRef;
    records=[];
    ngOnInit(): void {
    }
    checkAll(){
        if(this.selectAll.nativeElement.checked){
            this.records.forEach(item=>{
                item.isChecked=false;
            })
        }else {
            this.records.forEach(item=>{
                item.isChecked=true;
            })
        }

    }

}
