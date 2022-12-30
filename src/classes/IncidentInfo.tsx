import DateAndTime from './DateAndTime';
import ActivityInfo from './ActivityInfo';
import UserInfo from './UserInfo';
import { onFail, log } from './JsonKeyFailBuilder';
import { asMap } from './MapUtil';
import IDeepCopyable from './Buffer';
import IncidentCategoryInfo from './IncidentCategoryInfo';

class IncidentInfo implements IDeepCopyable<IncidentInfo> {
    constructor(info: {
        number?: number,
        type?: string,
        shortDescription?: string,
        description?: string,
        state?: string,
        assignedTo?: UserInfo,
        assignmentGroup?: string,
        created?: DateAndTime,
        updated?: DateAndTime,
        channel?: string,
        priority?: number,
        urgency?: number,
        impact?: number,
        caller?: UserInfo,
        activities?: ActivityInfo[]
    }){
        this._ogJSON = JSON.stringify(info);
        this.number = info.number || 9999999;
        this.type = info.type || "UKN";
        this.shortDescription = info.shortDescription || "No short description";
        this.description = info.description ||"No description";
        this.assignedTo = info.assignedTo || UserInfo.UNKNOWN;
        this.caller = info.caller || UserInfo.UNKNOWN;
        this.assignmentGroup = info.assignmentGroup || "No assignment group";
        this.state = info.state || "No state";
        this.priority = info.priority || -1;
        this.impact = info.impact || -1;
        this.urgency = info.urgency || -1;
        this.channel = info.channel || "the eather";
        this.created = info.created || new DateAndTime([0,0,0,0,0,0]);
        this.updated = info.updated || new DateAndTime([0, 0, 0, 0, 0, 0]);
        this.activities = info.activities || [];
    }

    static fromJSON(json: any, dateTimeFormat?: string[]): IncidentInfo{
        let keyFails: string[] = [];
        /*DEBUG*///console.log(JSON.stringify(json));
        if (dateTimeFormat == null || dateTimeFormat.length < 4) {
            dateTimeFormat = ["T", "Z", "-", ":"];
        }
  
        const data = {
            number: json.identifier.number || onFail(keyFails, "number", 9999999),
            type: json.identifier.type || onFail(keyFails, "type", "UKN"),
            shortDescription: json.shortDescription || onFail(keyFails, "shortDescription", "No short description"),
            description: json.description || onFail(keyFails, "description", "No description"),
            state: json.state || onFail(keyFails, "state", "No state"),
            assignedTo: UserInfo.fromJSON(json.assignedTo) || onFail(keyFails, "assignedTo", UserInfo.UNKNOWN),
            assignmentGroup: json.assignmentGroup === undefined ? 
                onFail(keyFails, "assignmentGroup", "No assignment group") : json.assignmentGroup.name || onFail(keyFails, "assignmentGroup.name", "No assignment group name"),
            created: DateAndTime.fromJSON(json.timestamps.created, dateTimeFormat[0], dateTimeFormat[1], dateTimeFormat[2], dateTimeFormat[3]) || onFail(keyFails, "created_on", new DateAndTime([0,0,0,0,0,0])),
            updated: DateAndTime.fromJSON(json.timestamps.updated, dateTimeFormat[0], dateTimeFormat[1], dateTimeFormat[2], dateTimeFormat[3]) || onFail(keyFails, "updated_on", new DateAndTime([0, 0, 0, 0, 0, 0])),
            channel: json.channel || onFail(keyFails, "channel", -1),
            priority: json.priority || onFail(keyFails, "priority", -1),
            urgency: json.urgency || onFail(keyFails, "urgency", -1),
            impact: json.impact || onFail(keyFails, "impact", -1),
            caller: UserInfo.fromJSON(json.caller) || onFail(keyFails, "caller", UserInfo.UNKNOWN),
            activities: this.extractActivities(json.activities, dateTimeFormat) || onFail(keyFails, "activities", [])
        }
 
        
        log(keyFails, "IncidentInfo", 15, console.warn, false);
        return new IncidentInfo(data);
    }
    static extractActivities(activitiesJSON: any, dateTimeFormat: string[]): ActivityInfo[] | undefined {
        if(activitiesJSON === undefined || activitiesJSON === null){
            return undefined;
        }
        const activities = [];
        for (let i = 0; i < activitiesJSON.length; i++) {
            activities.push(ActivityInfo.fromJSON(activitiesJSON[i], dateTimeFormat));
        }
        return activities;
    }

    toMap(attributes: string[]): Map<string,any> {
        return asMap(this, attributes);
    }

    private _ogJSON: any;
    number: number;
    type: string;
    shortDescription: string;
    description: string;
    state: string; //Use incidents state enum
    assignedTo: UserInfo;
    assignmentGroup: string;
    created: DateAndTime;
    updated: DateAndTime;
    channel: string;
    priority: number;
    urgency: number;
    impact: number;
    caller: UserInfo;
    activities: ActivityInfo[];

    private _stateData: {   //make this a type
        isBeingDragged?: boolean,
        isShowingBody?: boolean,
        isGoingToDrag?: boolean,
        dragJustEnded?: boolean,
        category?: IncidentCategoryInfo,
        onMouseMove: (e: React.MouseEvent<any, any>) => void,
        onMouseUp: (e: React.MouseEvent<any, any>) => boolean,
    } = {
        isBeingDragged: false,
        isShowingBody: false,
        isGoingToDrag: false,
        dragJustEnded: false,
        category: undefined,
        onMouseMove: (e: React.MouseEvent<any,any>) => {},
        onMouseUp: (e: React.MouseEvent<any, any>) => {return false;},
    };
    /**
     * Don't use this unless you made it.
     * Ties directly into the React Component and how it functions.
     * @returns If you use this, you're in the dark since so was I when I made it
     */
    _getStateData(): {
        isBeingDragged?: boolean,
        isShowingBody?: boolean,
        isGoingToDrag?: boolean,
        dragJustEnded?: boolean,
        category?: IncidentCategoryInfo,
        onMouseMove: (e: React.MouseEvent<any,any>) => void,
        onMouseUp: (e: React.MouseEvent<any, any>) => boolean,
    } {
        return this._stateData;
    };

    //@ts-ignore
    deepCopy(): IncidentInfo {
        const copy = new IncidentInfo({});
        copy._ogJSON = this._ogJSON;
        copy.number = this.number;
        copy.type = this.type;
        copy.shortDescription = this.shortDescription;
        copy.description = this.description;
        copy.state = this.state;
        copy.assignedTo = this.assignedTo.deepCopy();
        copy.assignmentGroup = this.assignmentGroup;
        copy.created = this.created.deepCopy();
        copy.updated = this.updated.deepCopy();
        copy.channel = this.channel;
        copy.priority = this.priority;
        copy.urgency = this.urgency;
        copy.impact = this.impact;
        copy.caller = this.caller.deepCopy();
        copy.activities = this.activities.map((activity) => activity.deepCopy());
        return copy;
    }

    compareTo(other: IncidentInfo): number{
        if(this.type === other.type){
            if(this.number < other.number){
                return -1;
            }
            if(this.number > other.number){
                return 1;
            }
            return 0;
        }
        return 1;
    }
}
export default IncidentInfo;