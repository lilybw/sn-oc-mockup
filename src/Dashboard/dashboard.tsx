import React from 'react';
import './Dashboard.css';

import IncidentCategory from './IncidentCategory/incidentCategory';
import IncidentInfo from '../classes/IncidentInfo';
import IncidentCategoryInfo from '../classes/IncidentCategoryInfo';
import DateAndTime from '../classes/DateAndTime';
import SimpleBuffer from '../classes/Buffer';
import ConcurrentLoader from '../classes/ConcurrentLoader';

export const incidentBuffer: SimpleBuffer<IncidentInfo> = new SimpleBuffer(); //Busy-wait Lock this
const categoryBuffer: SimpleBuffer<IncidentCategoryInfo> = new SimpleBuffer(); //Busy-wait Lock this

export function Dashboard(props: 
    { dataAccessPoint: (dataCallback: (data: Promise<any>) => void) => Promise<void>,
    title: string }
): JSX.Element{
    //const timeA = new Date().getMilliseconds();

    const getIncidentCategories = (): IncidentCategoryInfo[] => {
        //TODO: Pull these from the database
        return [
            new IncidentCategoryInfo("new"),
            new IncidentCategoryInfo("in progress"),
            new IncidentCategoryInfo("awaiting status")
        ]
    }

    const calcCategoryRefMap = (categories: IncidentCategoryInfo[]): Map<IncidentCategoryInfo, React.MutableRefObject<HTMLDivElement | null>> => {
        const toReturn = new Map<IncidentCategoryInfo,React.MutableRefObject<HTMLDivElement | null>>();
        
        categories.forEach((category) => {
            toReturn.set(category, React.createRef());
        });

        return toReturn;
    }
    const setCategories = (categories: IncidentCategoryInfo[]) => {
        _setCategoryRefMap(calcCategoryRefMap(categories)); //Maybe one of these can be optimized out as to not retrigger component update
        _setCategories(categories);
        //Recalc ref map
    }

    //||STATE||\\
    //const [dataAccessPoint, ]                       = React.useState<(dataCallback: (data: Promise<any>) => void ) => Promise<void>>(props.dataAccessPoint);
    const [categories, _setCategories]              = React.useState<IncidentCategoryInfo[]>(getIncidentCategories());
    const [categoryRefMap, _setCategoryRefMap]      = React.useState<Map<IncidentCategoryInfo, React.MutableRefObject<HTMLDivElement | null>>>(calcCategoryRefMap(categories));
    const [time, setTime]                           = React.useState<DateAndTime>(DateAndTime.fromDate(new Date()));
    const [selectedIncident, setSelectedIncident]   = React.useState<IncidentInfo | null>(null);
    const [selectedIncidentRef, setSelectedIncidentRef] = React.useState<React.RefObject<any> | null>(null);

    React.useEffect( () => {
            const interval = setInterval(() => { //Lmao this is bad, 2 instancings instead of 1 or actually 0 (simply incrementing existing instance)
                setTime(DateAndTime.fromDate(new Date()));
            }, 1000);
            return () => clearInterval(interval);
        }, []
    );

    const getCategoryIndex = async (incident: IncidentInfo) =>{
        //TODO: Look up incident.indentifiers.number in database
        //Return the category from the database
        //Return the category number, default 0
        return Math.floor(Math.random() * categories.length);
    }

    /**
     * Meant for assinging a single incident every once in a while.
     * For multiple incidents, use the incidentBuffer.
     * @param incident Incident to be added to the dashboard
     */
    const onIncidentRecieved = async (incident: Promise<any>) => {
        //https://tv2prod.service-now.com/nav_to.do?uri=/incident_list.do?sysparm_clear_stack=true&sysparm_userpref_module=bb1971934f9be2006cba34828110c7e9&sysparm_query=assigned_toDYNAMIC90d1921e5f510100a9ad2572f2b477fe^ORassignment_groupDYNAMICd6435e965f510100a9ad2572f2b47744^stateNOT%20IN6,7^EQ
        //Generic url: https://tv2poc.service-now.com/api/now/table/incident
        //database.insertInto("incidentsCategories", ({incident: incident, category: "New"}));
        let newIncident = IncidentInfo.fromJSON(await incident);
        let categoryNum = await getCategoryIndex(newIncident); //Returns random index for now

        const updatedCategories: IncidentCategoryInfo[] = categories; //array
        updatedCategories[categoryNum].incidents.unshift(newIncident); //object
        updatedCategories[categoryNum].incidents.sort((a, b) => a.updated.compareTo(b.updated));

        setCategories(updatedCategories);
    }

    //dataAccessPoint(onIncidentRecieved);

    const evaluateIncidentBuffer = async () => {
        const timeA: number = new Date().getMilliseconds();
        console.log("evaluateIncidentBuffer buffer contains " + incidentBuffer.size() + " incidents");
        //console.log(JSON.stringify(incidentBuffer.deepCopy()));

        const bufferCopy: IncidentInfo[] = incidentBuffer.retrieve(); //Clears the buffer too

        const loader = new ConcurrentLoader(bufferCopy, getCategoryIndex); //Returns random index for now
        loader.beginLoading();

        const updatedCategories: IncidentCategoryInfo[] = categories; //array

        bufferCopy.forEach(async incident => {
            const categoryNum = await loader.get(incident) ?? 0; 
            updatedCategories[categoryNum].incidents.unshift(incident); //object
        });

        console.log("Sorting categories");
        updatedCategories.forEach(category => category.incidents.sort((a, b) => a.updated.compareTo(b.updated)));

        categoryBuffer.pushAll(updatedCategories); //Copy the updated categories into the buffer
        console.log("Evaluating incident buffer overhead: " + (new Date().getMilliseconds() - timeA) + "ms");
    }
    if(incidentBuffer.size() > 0){
        evaluateIncidentBuffer();
    }
    if(categoryBuffer.size() > 0){
        setCategories(categoryBuffer.retrieve());
    }

    /**
     * Reassigns the incident to the category at the given position
     * @param position The position of the mouse
     * @param incident The incident in question
     * @param returnToSender callback to return the incident to its original category
     * @returns void
     */
    const onIncidentReassign = (position: {x: Number, y: Number}, incident: IncidentInfo, returnToSender: (incident: IncidentInfo) => void) =>{
        console.log("Reassigning incident category for incident: " + incident.number);
        const updatedCategories = categories;
        const allRefs = [...categoryRefMap.values()].filter( (ref) => ref !== null);
        console.log("allRefs: " + allRefs.length);

        for(let i = 0; i < allRefs.length; i++){
            const current = allRefs[i].current;
            if(current === null || current === undefined){
                continue;
            }

            const rect = current.getBoundingClientRect();
            if(position.x >= rect.left && position.x < rect.right && position.y >= rect.top && position.y < rect.bottom){
                console.log("Incident " + incident.number + " reassigned to category " + updatedCategories[i].name);
                //keysFromValue(categoryRefMap, current)[0].onIncidentReceived(incident);
                setCategories(updatedCategories);
                return;
            }
        }
        //reassign to origin
        console.log("Dashboard return incident to sender")
        returnToSender(incident);
    }
   
    const triggerMoveHandlers = (e: React.MouseEvent) =>{
        if(selectedIncident != null && selectedIncidentRef != null ){
            selectedIncident._getStateData().onMouseMove(e);
        }
    }
    const selectIncident = (incident: IncidentInfo | null, ref: React.RefObject<any> | null): boolean => {
        console.log("Selecting incident: " + incident?.number);
        console.log("currently selected incident: " + selectedIncident?.number);

        const wasEmpty: boolean = selectedIncident === null;

        setSelectedIncident(incident);
        setSelectedIncidentRef(ref);

        return wasEmpty;
    }
    const triggerMouseUpHandlers = (e: React.MouseEvent) =>{
        if(selectedIncident != null){
            if (selectedIncident._getStateData().onMouseUp(e)){
                onIncidentReassign({x: e.clientX, y: e.clientY}, selectedIncident, (e)=>{
                    console.log("Incident " + e.number + " returned to sender")
                });
                selectIncident(null, null);
            };
        }
    }

    return (
        <div className="Dashboard" >
            <div className="Dashboard-header">
                <div className="Dashboard-logo">{props.title}</div>
                <div className="Dashboard-title">OC Dashboard</div>
                <div className="Dashboard-time"> { time.toString(true) }</div>
            </div>
            <div className="Incident-Categories" onMouseMove={(e) => triggerMoveHandlers(e)} onMouseUp={(e) => triggerMouseUpHandlers(e)}>
                {categories.map( (category, index) => 
                    
                    <IncidentCategory forwardRef={categoryRefMap.get(category)}      
                        //dashboardAccessPoint = {{...dashboardHandlers, onIncidentReassign: onIncidentReassign}} 
                        selectIncident={selectIncident}
                        key={index}
                        category={category}
                    />
                    )
                }
            </div>
        </div>
    );
    
}
export default Dashboard;