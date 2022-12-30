import React from 'react';
//@ts-ignore
import ActivityInfo from '../../../../classes/ActivityInfo';
import './activity.css';

function Activity(props: 
    {activity: ActivityInfo, key: React.Key}
    ): JSX.Element {
    
    //||STATE||\\
    const [activity, ]   = React.useState<ActivityInfo>(props.activity);
    //const [key, setKey]             = React.useState<React.Key>(props.key);


    return (
        <div className="Activity">
            <div className="Activity-header">
                <div className="Activity-headerColumn">
                    <div>{activity.author.name}</div>
                    <div>{activity.type}</div>
                </div>
                <div>{activity.timestamp.toString() }</div>
            </div>
            <div className="Activity-body">
                {activity.content} 
                </div>
        </div>
    );
}
export default Activity;