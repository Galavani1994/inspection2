export class InstanceModel {
    constructor(
      public id?:number,
      public examTypeId?:number,
      public examType?:string,
      public citiationReferencesId?:number,
      public citiationReferences?:string,
      public step?:number,
      public inspectionLevelId?:number,
      public inspectionLevel?:string,
      public bahrQuantity?:number,
      public instanceQuantity?:number,
      public characterType?:number,
      public litleCharacterDegreeREJ?:string,
      public litleCharacterDegreeACC?:string,
      public litleCharacterDegreeAQL?:string,
      public mainCharacterDegreeREJ?:string,
      public mainCharacterDegreeACC?:string,
      public mainCharacterDegreeAQL?:string,
      public criticalCharacterDegreeREJ?:string,
      public criticalCharacterDegreeACC?:string,
      public criticalCharacterDegreeAQL?:string,
    ){

    }
}
