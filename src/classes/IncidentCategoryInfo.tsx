import IncidentInfo from './IncidentInfo';
import IDeepCopyable from './Buffer';

class IncidentCategoryInfo implements IDeepCopyable<IncidentCategoryInfo> {
    constructor(name: string){
        this.name = name;
    }
    name: string;
    incidents: IncidentInfo[] = [];
    //@ts-ignore
    deepCopy(): IncidentCategoryInfo {
        const copy = new IncidentCategoryInfo(this.name);
        const arrayCopy: Array<IncidentInfo> = new Array(this.incidents.length);
        for (let i = 0; i < this.incidents.length; i++){
            arrayCopy[i] = this.incidents[i].deepCopy();
        }
        copy.incidents = arrayCopy;
        return copy;
    }
}
export default IncidentCategoryInfo;