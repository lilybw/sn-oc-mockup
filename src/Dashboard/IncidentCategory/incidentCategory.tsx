import React, { RefObject} from 'react';
import './IncidentCategory.css';
//@ts-ignore
import Incident from '../Incident/incident';
//@ts-ignore
import IncidentCategoryInfo from '../../classes/IncidentCategoryInfo';
import IncidentInfo from '../../classes/IncidentInfo';

//key: number, category: IncidentCategoryInfo, draggingIncident: boolean, dashboard: typeof Dashboard,
//incidentRefMap: Map<IncidentInfo, React.LegacyRef<HTMLDivElement>>}>

function IncidentCategory(props: {
            //dashboardAccessPoint: DashboardAccessPoint, 
            ref?: React.MutableRefObject<HTMLDivElement | null>,
            forwardRef?: RefObject<HTMLDivElement>,
            incidentIsBeingDragged?: boolean,
            category: IncidentCategoryInfo, 
            key: React.Key,
            selectIncident: (incident: IncidentInfo | null, ref: React.RefObject<any> | null) => boolean,
        }
): JSX.Element {

    const getRefMap = (category: IncidentCategoryInfo): Map < IncidentInfo, React.LegacyRef < HTMLDivElement >> => {
        let toReturn = new Map<IncidentInfo, React.LegacyRef<HTMLDivElement>>();
        category.incidents.forEach(
            (incident) => toReturn.set(incident, React.createRef())
        );
        return toReturn;
    }

    //||STATE||\\
    //const [key, setKey]                       = React.useState<React.Key>(props.key);
    const [category, setCategory]               = React.useState<IncidentCategoryInfo>(props.category);
    //const [dashboard, ]                         = React.useState<DashboardAccessPoint>(props.dashboardAccessPoint);
    const [incidentRefMap, setIncidentRefMap]   = React.useState<Map<IncidentInfo, React.LegacyRef<HTMLDivElement>>>(getRefMap(props.category));

    const onIncidentReceived = (incident: IncidentInfo) => {
        const map = incidentRefMap;
        map.set(incident, React.createRef());
        setIncidentRefMap(map);
        const list = category.incidents;
        list.unshift(incident);
        list.sort((a: IncidentInfo, b: IncidentInfo) => a.updated.compareTo(b.updated));
    }

    const removeIncident = (incident: IncidentInfo) => {
        const map = incidentRefMap;
        map.delete(incident);
        setIncidentRefMap(map);
        const list = category.incidents;
        list.splice(list.indexOf(incident), 1);
        setCategory(category);
    }
 
    return (
        <div className="IncidentCategory" data-showhover={props.incidentIsBeingDragged} ref={props.forwardRef}>
            <div className="IncidentCategory-title">{ category.name }</div>
            <div className="IncidentCategory-incidents">
                { category.incidents.map((incident: IncidentInfo, index: Number) => 
                    <Incident ref={incidentRefMap.get(incident) as React.LegacyRef<any>} 
                        category={{ removeIncident: removeIncident, addIncident: onIncidentReceived, getInfo: () => category }} 
                        incident={incident} key={index as React.Key} 
                        selectIncident={props.selectIncident}
                        //dashboardAccessPoint={dashboard}
                    />
                    ) 
                }
            </div>
        </div>
    );
}
export default IncidentCategory;