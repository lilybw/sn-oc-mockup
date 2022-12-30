import React from 'react';
import IncidentInfo from '../../classes/IncidentInfo';
import ActivityArea from './ActivityArea/activityArea';
import './incident.css';
import { VisualMap } from '../../VisualMap/visualMap';
import ActivityInfo from '../../classes/ActivityInfo';
import { activityFilter, filterTypes } from '../../classes/ActivityFilter';
import { CategoryAccessPoint } from '../../classes/CategoryAccessPoint';

function Incident(props: 
    { ref: React.LegacyRef<HTMLDivElement>, 
        category: CategoryAccessPoint, 
        incident: IncidentInfo, 
        key: React.Key | null,
        selectIncident: (incident: IncidentInfo | null, ref: React.RefObject<any> | null) => boolean
}): JSX.Element {

    //||STATE||\\
    const [incident, ]                          = React.useState<IncidentInfo>(props.incident);
    const [category,]                           = React.useState<CategoryAccessPoint>(props.category);
    const [showBody, setShowBody]               = React.useState<boolean>(false);
    const [isBeingDragged, setIsBeingDragged]   = React.useState<boolean>(false);
    const [areWeGoingToDrag, setAreWeGoingToDrag] = React.useState<boolean>(false);
    const [htmlRef, ]                           = React.useState<React.LegacyRef<HTMLDivElement>>(props.ref || React.createRef<HTMLDivElement>());	
    const [workNotes, ]                         = React.useState<ActivityInfo[]>(activityFilter({ activities: props.incident.activities, type: filterTypes.WORK_NOTES }));
    const [callerCommunication, ]               = React.useState<ActivityInfo[]>(activityFilter({ activities: props.incident.activities, type: filterTypes.CALLER_COMMUNICATION }));
    const [systemInfo, ]                        = React.useState<ActivityInfo[]>(activityFilter({ activities: props.incident.activities, type: filterTypes.SYSTEM }));
    
    incident._getStateData().category = category.getInfo();

    const getBody = (): JSX.Element => {
        if (showBody && !isBeingDragged){
            return (
                <div className="Incident-Body" data-expanded={showBody}>
                    <div className="Incident-UpperRow">
                        <div className="Incident-description"> 
                            { incident.description } 
                        </div>
                        <VisualMap percentAvailableWidth={40} map={incident.toMap(['urgency','priority','impact','channel'])} />
                        <VisualMap percentAvailableWidth={40} map={incident.caller.toMap([])} omitKeys={true} />
                        <div className="column">
                            <div className="Incident-baseInfo">Created:</div>
                            <div className="Incident-baseInfo">{  incident.created.toString() }</div>
                            <button className="Incident-baseInfo">Runbook</button>
                            <button className="Incident-baseInfo">Resolve</button>
                        </div>
                    </div>
                    <div className="Incident-LowerRow" id="Incident-LowerRow">
                        <ActivityArea activities={workNotes} type="Work Notes" hasUserInput={true} key="Work Notes" />
                        <ActivityArea activities={callerCommunication} type="Caller Communication" hasUserInput={true} key="Caller Communication" />
                        <ActivityArea activities={systemInfo} type="System Info" hasUserInput={false} key="System Info" />
                    </div>
                </div>
            );
        }else{
            return <></>;
        }
    }

    const toggleBody = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (!isBeingDragged){
            setShowBody(!showBody);
        }
    }


    const onDragEnd = (e: React.MouseEvent<HTMLDivElement, MouseEvent>): boolean =>{
        setAreWeGoingToDrag(false);
        setIsBeingDragged(false);

        if(htmlRef){
            //@ts-ignore
            htmlRef.current.style.top = "0px";
            //@ts-ignore
            htmlRef.current.style.left = "0px";
        }

        console.log("Incident needs reassign - incident side");
    
        return true;
    }

    const onMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const position = { x: e.clientX, y: e.clientY };
        if(htmlRef !== null){
            //@ts-ignore
            const element = htmlRef.current;

            element.style.top = (position.y - 5) + "px";
            element.style.left = (position.x - 5) + "px";

            setIsBeingDragged(true);
            setAreWeGoingToDrag(false);
        }
    }

    const onDragStart = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        console.log("Mouse down - incident side.")
        if (!showBody) {
            if(props.selectIncident(incident, htmlRef as React.RefObject<HTMLDivElement>)){
                incident._getStateData().onMouseMove = onMove;
                incident._getStateData().onMouseUp = onDragEnd;
                setAreWeGoingToDrag(true);
            }
        }
    }
    const toggleSetStateMenu = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        console.log("Set State Menu");
        e.stopPropagation();
    }

    return (
        <div id="TheEntireThing" className={`Incident ${isBeingDragged ? "Incident-whilestDragged" : ""}`} 
                data-showbody={showBody} 
                onMouseDown={(e) => onDragStart(e)} 
                onMouseUp={(e) => onDragEnd(e)}
                ref={htmlRef}>
            <div className="Incident-header" onClick={(e) => toggleBody(e)}>
                <div className="Incident-type">{incident.type }</div>
                <div className="Incident-number">{incident.number }</div>
                <div className={`Incident-shortDescription ${isBeingDragged ? "hidden" : ""}`}>{incident.shortDescription }</div>
                <button className={`Incident-state ${isBeingDragged ? "hidden" : ""}`} onClick={(e)=>toggleSetStateMenu(e)}> 
                    {incident.state}
                </button>
                <div className={`Incident-assignedTo ${isBeingDragged ? "hidden" : ""}`}>P {incident.assignedTo.initials }</div>
                <div className={`Incident-caller ${isBeingDragged ? "hidden" : ""}`}>C {incident.caller.initials }</div>
                <div className={`Incident-group ${isBeingDragged ? "hidden" : ""}`}>G {incident.assignmentGroup }</div>
                <div className={`Incident-updated ${isBeingDragged ? "hidden" : ""}`}>U {incident.updated.toString() }</div>
            </div>
            {getBody()}
        </div>
    );
    
}
export default Incident;