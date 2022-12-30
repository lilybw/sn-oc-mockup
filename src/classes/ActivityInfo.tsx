import DateAndTime from './DateAndTime';
import UserInfo from './UserInfo';
import {onFail, log} from './JsonKeyFailBuilder';
import { IDeepCopyable } from './Buffer';

class ActivityInfo implements IDeepCopyable<ActivityInfo>{
    constructor(author?: UserInfo, timestamp?: DateAndTime, type?: string, content?: string){
        this.author = author || UserInfo.UNKNOWN;
        this.timestamp = timestamp || new DateAndTime([]);
        this.type = type || "untyped";
        this.content = content || "no content";
    }

    static fromJSON(json: any, dateTimeFormat?: string[]): ActivityInfo {
        let keyFails: string[] = [];
        if(dateTimeFormat === undefined){
            dateTimeFormat = ["T", "Z", "-", ":"];
        }
        let toReturn = new ActivityInfo(
            new UserInfo(json.author),
            DateAndTime.fromJSON(json.timestamp, dateTimeFormat[0], dateTimeFormat[1], dateTimeFormat[2], dateTimeFormat[3]),
            json.type || onFail(keyFails, "type", "untyped"),
            json.content || onFail(keyFails, "content", "no content")
        );
        log(keyFails, "ActivityInfo", 2, console.warn, false);
        return toReturn;
    }

    author: UserInfo;
    type: string;
    timestamp: DateAndTime; //to DateTimeObject
    content: string;

    deepCopy(): ActivityInfo {
        return new ActivityInfo(this.author.deepCopy(), this.timestamp.deepCopy(), this.type, this.content);
    }
}
export default ActivityInfo;
