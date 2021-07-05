import { Observable } from "rxjs";

export class FileItem{
    public name:string;
    public uploading=false;
    public uploadPercent: Observable<number>;
    public downloadURL: Observable<string>;

    private aceptType = ['image/jpeg', 'image/png'];
    constructor(public file:File = file){
        this.name = file.name; 

    }

    validateType(fileType:string):boolean{
        return fileType  =='' || fileType ==undefined? false :this.aceptType.includes(fileType);
    }

    checkDropped(fileName:string, files:FileItem[]):boolean{
        for(const file of files){
            if(file.name == fileName){
                return true;
            }
        }
        return false;
    }
}