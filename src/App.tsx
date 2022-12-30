//@ts-ignore
import { Dashboard, incidentBuffer } from './Dashboard/dashboard';
//@ts-ignore
import Copyright from './Copyright/copyright';
import React from 'react';
import incidentJson from './Dashboard/Incident/incident.json';
import IncidentInfo from './classes/IncidentInfo';
import './App.css';

const titles = [
   "ServiceRealtime",
   "ServiceWhenIFeelLikeIt",
   "ServiceInAMomentHoney",
   "ServiceSomeday",
   "ServiceNever",
   "ServiceNotNow",
   "ServiceNotToday",
   "ServiceNotThisWeek",
   "ServiceNotThisMonth",
   "ServiceNotThisYear",
   "ServiceNotInMyLifetime",
   "ServiceMaybeWhenPlayIsDown",
   "ServiceWhenTheres2MondaysInAWeek",
   "ServiceMaybe",
   "ServiceWhenever",
   "ServiceGoGetACoffee",
   "ServiceGoGetSomeSleep",
    "ServiceGoGetSomeFood"
]
const title = titles[Math.floor(Math.random() * titles.length -1)]

function App (props: any): JSX.Element {

  const useEntryPoint = async (dataCallback: (data: Promise<any>) => void): Promise<void> => { //This is somehow a event loop blocking function. It's not supposed to be.
    const timeA: number = new Date().getMilliseconds();
    const scrambleJSON = (incidents: any[]): any[] => {
      let today = new Date();
      const toReturn = incidents.map((incident, index) => {
        incident.timestamps.created = today.getDay() + "-" + today.getMonth() + "-" + today.getFullYear() + "T" + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        incident.identifier.number = Math.floor(Math.random() * 10000000) + index;
        return incident;
      })

      return toReturn;
    }
    const incidents: any[] = scrambleJSON([
      JSON.parse(JSON.stringify(incidentJson)),
      JSON.parse(JSON.stringify(incidentJson)),
      JSON.parse(JSON.stringify(incidentJson)),
      JSON.parse(JSON.stringify(incidentJson)),
      JSON.parse(JSON.stringify(incidentJson)),
      JSON.parse(JSON.stringify(incidentJson))
    ]);
    const populateCategories = async (incidents: any[]) => {
      const timeA: number = new Date().getMilliseconds();
      for (let i = 0; i < incidents.length; i++) {
        dataCallback(incidents[i]);
      }
      console.log("data processing overhead: " + (new Date().getMilliseconds() - timeA) + "ms");
    }
    populateCategories(incidents);
    console.log("Fake data total overhead (async): " + (new Date().getMilliseconds() - timeA) + "ms");
  };

  const dataCallback = async (data: Promise<any>): Promise<void> => {
    const incident = IncidentInfo.fromJSON(await data);
    incidentBuffer.push(incident);
  };

  useEntryPoint(dataCallback);

  const [dataAvailable, setDataAvailable] = React.useState<boolean>(false);


    return (
      <div className="App">
        <Dashboard 
          title={title}
          dataAccessPoint={useEntryPoint} />
        <Copyright />
      </div>
  );

}
export default App;
