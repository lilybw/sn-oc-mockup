import IncidentInfo from './IncidentInfo';
import IncidentCategoryInfo from './IncidentCategoryInfo';

export interface CategoryAccessPoint {
    addIncident: (incident: IncidentInfo) => void,
    removeIncident: (incident: IncidentInfo) => void,
    getInfo(): IncidentCategoryInfo
}