import IDeepCopyable from './Buffer';

export const lengthOfMonths = {
    _raw: [31,28,31,30,31,30,31,31,30,31,30,31],
    _isLeapYear: (year: number) => {
        if(year % 4 === 0 && year % 100 !== 0){
            return true;
        }
        if(year % 400 === 0){
            return true;
        }
        return false;
    },
    get: (month: number, year: number) => {
        if(month === 1 && lengthOfMonths._isLeapYear(year)){
            return 29;
        }
        return lengthOfMonths._raw[month];
    }
};

class DateAndTime implements IDeepCopyable<DateAndTime> {
    constructor(dmyhms: number[]) {
        this.day = dmyhms[0] || 0;
        this.month = dmyhms[1] || 0;
        this.year = dmyhms[2] || 0;
        this.hour = dmyhms[3] || 0;
        this.minute = dmyhms[4] || 0;
        this.second = dmyhms[5] || 0;
    }
    date(): string {
        return this._formatNumber(this.day) + "/" + this._formatNumber(this.month) + "/" + this._formatNumber(this.year);
    };
    time(): string {
        return this._formatNumber(this.hour) + ":" + this._formatNumber(this.minute) + ":" + this._formatNumber(this.second);
    };
    day: number;
    month: number;
    year: number;
    hour: number;
    minute: number;
    second: number;
    //@ts-ignore
    deepCopy(): DateAndTime {
        return new DateAndTime([
            this.day,
            this.month,
            this.year,
            this.hour,
            this.minute,
            this.second
        ]);
    }
    incrementSeconds = (): DateAndTime => {
        this.second++;
        if(this.second > 59){
            this.second = 0;
            this.incrementMinutes();
        }
        return this;
    }
    incrementMinutes = (): DateAndTime => {
        this.minute++;
        if(this.minute > 59){
            this.minute = 0;
            this.incrementHours();
        }
        return this;
    }
    incrementHours = (): DateAndTime => {
        this.hour++;
        if(this.hour > 23){
            this.hour = 0;
            this.incrementDays();
        }
        return this;
    }
    incrementDays = (): DateAndTime => {
        this.day++;
        if (this.day > lengthOfMonths.get(this.month - 1, this.year)) {
            this.day = 1;
            this.incrementMonths();
        }
        return this;
    }
    incrementMonths = (): DateAndTime => {
        this.month++;
        if(this.month > 12){
            this.month = 1;
            this.incrementYears();
        }
        return this;
    }
    incrementYears = (): DateAndTime => {
        this.year++;
        return this;
    }
    _formatNumber(number: number): string {
        return number < 10 ? "0" + number : number.toString();
    }
    toString(useSpace?: boolean): string {
        return this._formatNumber(this.day) + "/" + this._formatNumber(this.month) + "/" + this.year + (useSpace ? " " : "|" )
            + this._formatNumber(this.hour) + ":" + this._formatNumber(this.minute) + ":" + this._formatNumber(this.second);
    };
    static fromJSON(json: string, dateTimeSplit: string, timeZoneIndicator: string, dateSeperator: string, timeSeperator: string): DateAndTime {
        if(json === undefined){
            return new DateAndTime([0,0,0,0,0,0]);
        }
        
        const dateAndTime: string[] = json.split(dateTimeSplit);
        const date: string[] = dateAndTime[0].split(dateSeperator);
        const time: string[] = dateAndTime[1].replace(timeZoneIndicator, "").split(timeSeperator);
        
        return new DateAndTime([
            parseInt(date[0]),
            parseInt(date[1]),
            parseInt(date[2]),
            parseInt(time[0]),
            parseInt(time[1]),
            parseInt(time[2])
        ]);
    };
    static fromDate(jsDate: Date): DateAndTime {
        return new DateAndTime([
            jsDate.getDate(),
            jsDate.getMonth(),
            jsDate.getFullYear(),
            jsDate.getHours(),
            jsDate.getMinutes(),
            jsDate.getSeconds()
        ]);
    }   
    compareTo(other: DateAndTime): number {
        if(this.year > other.year) return 1;
        if(this.year < other.year) return -1;
        if(this.month > other.month) return 1;
        if(this.month < other.month) return -1;
        if(this.day > other.day) return 1;
        if(this.day < other.day) return -1;
        if(this.hour > other.hour) return 1;
        if(this.hour < other.hour) return -1;
        if(this.minute > other.minute) return 1;
        if(this.minute < other.minute) return -1;
        if(this.second > other.second) return 1;
        if(this.second < other.second) return -1;
        return 0;
    }
}
export default DateAndTime;