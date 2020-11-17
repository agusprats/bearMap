import React from 'react';
import mapStyles from './mapStyles';
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
  LoadScript,
} from '@react-google-maps/api';
import { formatRelative} from 'date-fns';
//import '@reach/combobox/styles.css'

const libraries = ['places'];
const mapContainerStyle = {
  width: '100vw',
  height: '100vh',
};
const options = {
  styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: true,
};

const center = {
  lat: 43.6532,
  lng: -79.3832,
};


function App() {
  const {isLoaded, loadError} = useLoadScript ({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

const [markers, setMarkers] = React.useState([]);
const [selected, setSelected] = React.useState(null);

const onMapClick = React.useCallback((event) => {
  setMarkers((current) => [
    ...current,
    {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
      time: new Date(),
    },
  ]);
}, []);

const mapRef = React.useRef();
const onMapLoad = React.useCallback((map) => {
  mapRef.current = map;
}, [])

if (loadError) return 'Error loading maps';
if (!isLoaded) return 'Loading Maps';

  return (
    <div>

      <h1>
      Bears{" "}
        <span role="img" aria-label="tent">
          ⛺️
        </span>
      </h1>
      <GoogleMap 
      mapContainerStyle={mapContainerStyle}
      center={center}
      options={options}
      zoom={8}
      onClick={onMapClick}
      onLoad={onMapLoad}
       >
         {markers.map((marker) => (
          <Marker
          key={`${marker.lat}-${marker.lng}`}
          position={{ lat: marker.lat, lng: marker.lng }}
          onClick={() => {
            setSelected(marker);
          }}
          icon={{
            url: `/bear.svg`,
            origin: new window.google.maps.Point(0, 0),
            anchor: new window.google.maps.Point(15, 15),
            scaledSize: new window.google.maps.Size(30, 30),
          }}
          onClick={() => {
            setSelected(marker);
          }}
        />
        ))}

{selected ? 
(<InfoWindow position={{lat: selected.lat, lng: selected.lng}} 
  onCloseClick={() => {
setSelected(null);
}} >
  <div>
    <h2>Bear Spotted!!!</h2>
<p>Spotted {formatRelative(selected.time, new Date())}</p>
    
  </div>
</InfoWindow>) : null}


      </GoogleMap>
    </div>
  );
}

export default App;
