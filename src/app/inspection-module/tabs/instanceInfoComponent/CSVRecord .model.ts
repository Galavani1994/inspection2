import {IdentifyCharacter} from "~/app/inspection-module/tabs/instanceInfoComponent/identify-character.model";

export class CSVRecord {

    constructor(
        public id?: string,
        public contentValue?: IdentifyCharacter[],
        public isChecked?: boolean
    ) {
        this.id = '-1';
    }


}
