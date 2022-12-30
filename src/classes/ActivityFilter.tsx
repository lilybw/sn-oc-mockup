import ActivityInfo from './ActivityInfo';

export const filterTypes = {
    WORK_NOTES: 0,
    CALLER_COMMUNICATION: 1,
    SYSTEM: 2
};

export const activityFilter = (args: { type: Number, activities: ActivityInfo[]}): ActivityInfo[] => {
    let filteredActivities: ActivityInfo[] = Array<ActivityInfo>();
    switch(args.type){
        case filterTypes.WORK_NOTES:
            filteredActivities = args.activities.filter(info => info.type === "Work notes");
            break;
        case filterTypes.CALLER_COMMUNICATION:
            filteredActivities = args.activities.filter(info => info.type === "Additional comments");
            break;
        case filterTypes.SYSTEM:
            filteredActivities = args.activities.filter(info => info.type === "SystemInfo" || info.type === "Field changes");
            break;
        default:
            filteredActivities = args.activities;
            break;
    }
    return filteredActivities;
}