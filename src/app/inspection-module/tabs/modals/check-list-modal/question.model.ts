import {BaseEntity} from "~/app/shared/baseEntity";

export class Question extends BaseEntity<any> {
    constructor(
        public checkListCategoryId: number,
        public checkListCategoryTitle: string,
        public title: string,
        public normalAmount: number,
        public scoreFrom: number,
        public coefficient: number,
        public scoreTo: number,
        public questionStructure: number,
        public questionStructureTitle: string,
        public questionStructurePersianTitle: string,
        public description: string,
        public active: boolean,
        public choices: any[],
        public defect: string,
        public defectType: number,
        public defectTypeTitle: string,
        public defectTypePersianTitle: string,
        public priority: number,
        public inspectionMethods: any[],
        public references: any[],
        public questionFaults: any[],
        public status: number,
        public answer: string,
        public choiceId: number,
        public isAnswered: boolean,
        public defectiveSamples: any[],
        public categoryPriority: number,
        public descriptionAnswer: string,
    ) {
        super();
        this.id = -1;
        this.choiceId = -1;
        this.categoryPriority = 1;
        this.isAnswered = false;

    }
}
