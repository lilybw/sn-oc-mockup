import IncidentInfo from './IncidentInfo';

export interface DashboardAccessPoint {
    removeOnMouseMove: (identifier: any) => boolean,
    removeOnMouseUp: (identifier: any) => boolean,
    addOnMouseMove: (identifier: any, mouseMoveHandler: (e: any) => void) => boolean,
    addOnMouseUp: (identifier: any, mouseUpHandler: (e: any) => void) => boolean,
    onIncidentReassign: (position: {x: Number, y: Number}, incident: IncidentInfo, returnToSender: (incident: IncidentInfo) => void) => void,
}
