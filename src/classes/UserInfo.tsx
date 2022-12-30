import { asMap } from "./MapUtil";
import { IDeepCopyable } from "./Buffer";

class UserInfo implements IDeepCopyable<UserInfo> {

    static UNKNOWN = new UserInfo({});
    static fromJSON = (json: any): UserInfo => {
        if(json === undefined){
            return UserInfo.UNKNOWN;
        }
        const data = {
            name: json.name || json.author || "unnamed",
            initials: json.initials || undefined,
            email: json.email || undefined
        }
        data.initials = data.initials || UserInfo.extractFromName(data.name);
        data.email = data.email || (data.initials.toLowerCase() + "@tv2.dk (approximated)");

        return new UserInfo(data);
    }
    deepCopy(): UserInfo {
        const data = {name: this.name, initials: this.initials, email: this.email};
        return new UserInfo(data);
    }

    name: string;
    initials: string;
    email: string;

    constructor(data: {name?: string, initials?: string, email?: string}) {
        this.name = data.name || "Unknown";
        this.initials = data.initials || UserInfo.extractFromName(this.name);
        this.email = data.email || (this.initials.toLowerCase() + "@tv2.dk (approximated)");
    }

    toMap(attributes: string[]): Map<string,any> {
        return asMap(this, attributes);
    }


    static extractFromName(name: string): string{
        let initials: string = "";
        let words: string[] = name.split(" ");
        if(words.length < 2){
            initials = name.substring(0, 4);
        }else{
            initials = words[0].substring(0, 2) + words[words.length - 1].substring(0, 2);
        }
        return initials.toUpperCase() + " (approximated)";
    }

}
export default UserInfo;