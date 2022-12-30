import React from 'react';
//@ts-ignore
import Activity from './Activity/activity';
//@ts-ignore
import ActivityInfo from '../../../classes/ActivityInfo';
//ts-ignore
import UserInfo from '../../../classes/UserInfo';
//ts-ignore
import DateAndTime from '../../../classes/DateAndTime';
import './activityArea.css';

function ActivityArea(props: 
    { activities: ActivityInfo[], type: string, hasUserInput: boolean, inputIsSelected?: boolean }
): JSX.Element {

    //||STATE||\\
    const [activities, setActivities]   = React.useState<ActivityInfo[]>(props.activities);
    const [type, ]                      = React.useState<string>(props.type);
    const [hasUserInput, ]              = React.useState<boolean>(props.hasUserInput);
    const [inputRef, ]                   = React.useState<React.RefObject<HTMLTextAreaElement>>(React.createRef<HTMLTextAreaElement>());
    const [formRef, ]                   = React.useState<React.RefObject<HTMLFormElement>>(React.createRef<HTMLFormElement>());
    //const [inputIsSelected, setInputIsSelected] = React.useState<boolean>(props.inputIsSelected || false);

    //TODO: On activity recieved, add it to the list of activities

    const onNewActivitySubmit = (event: any) => {
        if(inputRef.current === undefined || inputRef.current === null
            || formRef.current === undefined || formRef.current === null) 
        {return};

        const input: HTMLTextAreaElement = inputRef.current;
        const message = input.value;
        input.blur();
        
        const now = new Date();
        const array = activities;
        array.push(new ActivityInfo(UserInfo.UNKNOWN, DateAndTime.fromDate(now),   type, message)); //TODO: sort on time
        array.sort((a, b) => a.timestamp.compareTo(b.timestamp)); //somehow reversing the array afterwards to get newest on top, break the html rerender and they dont show up
        setActivities(array);

        console.log("New Activity Submitted: ");
        console.log(JSON.stringify(activities));

        formRef.current.reset();
    }

    const submitOnEnter = (event: any) => {
        if (event.which === 13 && !event.shiftKey) {
            event.target.form.dispatchEvent(new Event("submit", { cancelable: true }));
            onNewActivitySubmit(event);
            event.preventDefault(); // Prevents the addition of a new line in the text field (not needed in a lot of cases)
        }
    }

    const getInput = (): JSX.Element => {
        if(hasUserInput){
            return (
                <div className="ActivityArea-UserInput">
                    <form 
                        id="NewActivityForm" 
                        onSubmit={onNewActivitySubmit}
                        ref={formRef}>
                        <textarea 
                            id="messageInput" 
                            onKeyPress={(e) => submitOnEnter(e)} 
                            className="ActivityArea-InputField" 
                            placeholder="Write Your Message Here..." 
                            ref={inputRef}/>
                    </form>
                </div>
            );
        }
        return (<></>);
    }


    return (
        <div className="ActivityArea" id="ActivityArea">
            <div className="ActivityArea-header">
                {   type }
            </div>
            <div className="ActivityArea-body">
                {  activities.map( (activity, index) => 
                    <Activity activity={activity} key={index as React.Key} />
                    )
                }
            </div>
            {getInput()}
        </div>
    );
    
}
export default ActivityArea;