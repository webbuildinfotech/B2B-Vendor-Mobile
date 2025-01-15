import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const MapScreen = () => {
  const [markers, setMarkers] = useState([
    { id: 1, title: 'Delhi', description: 'Capital of India', latitude: 28.6139, longitude: 77.209 },
    { id: 2, title: 'Mumbai', description: 'Financial capital of India', latitude: 19.076, longitude: 72.8777 },
    { id: 3, title: 'Kolkata', description: 'City of Joy', latitude: 22.5726, longitude: 88.3639 },
    { id: 4, title: 'Bangalore', description: 'Silicon Valley of India', latitude: 12.9716, longitude: 77.5946 },
    { id: 5, title: 'Chennai', description: 'Detroit of India', latitude: 13.0827, longitude: 80.2707 },
    { id: 6, title: 'Hyderabad', description: 'City of Pearls', latitude: 17.385, longitude: 78.4867 },
    { id: 7, title: 'Jaipur', description: 'Pink City', latitude: 26.9124, longitude: 75.7873 },
    { id: 8, title: 'Ahmedabad', description: 'Manchester of the East', latitude: 23.0225, longitude: 72.5714 },
    { id: 9, title: 'Pune', description: 'Oxford of the East', latitude: 18.5204, longitude: 73.8567 },
    { id: 10, title: 'Lucknow', description: 'City of Nawabs', latitude: 26.8467, longitude: 80.9462 },
    { id: 11, title: 'Amritsar', description: 'Home of Golden Temple', latitude: 31.634, longitude: 74.8723 },
    { id: 12, title: 'Goa', description: 'Beach Paradise', latitude: 15.2993, longitude: 74.124 },
  ]);

  const [region, setRegion] = useState({
    latitude: 20.5937,
    longitude: 78.9629,
    latitudeDelta: 20, 
    longitudeDelta: 20,
  });

  const onRegionChange = (newRegion) => {
    setRegion(newRegion);
    // console.log('Region changed to:', newRegion);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Dealer Locations</Text>
      <MapView
        style={styles.map}
        initialRegion={region}
        onRegionChangeComplete={onRegionChange}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
            title={marker.title}
            description={marker.description}
          />
        ))}
      </MapView>
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  map: {
    flex: 1,
    width:"100%",
    height:"90%",
  },
});
