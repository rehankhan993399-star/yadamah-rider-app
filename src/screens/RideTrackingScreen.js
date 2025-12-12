import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';

const RideTrackingScreen = ({ navigation, route }) => {
  const { rideId } = route.params;
  const [rideData, setRideData] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const rideRef = database().ref(`activeRides/${rideId}`);
    
    const onValueChange = rideRef.on('value', (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setRideData(data);
        if (data.driverLocation) {
          setDriverLocation(data.driverLocation);
        }
        setLoading(false);

        if (data.status === 'completed') {
          Alert.alert('Ride Completed', 'Thank you for riding with Yadamah!', [
            { text: 'OK', onPress: () => navigation.navigate('Home') },
          ]);
        }
      }
    });

    return () => rideRef.off('value', onValueChange);
  }, [rideId]);

  const cancelRide = async () => {
    Alert.alert(
      'Cancel Ride',
      'Are you sure you want to cancel this ride?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          onPress: async () => {
            await database().ref(`activeRides/${rideId}`).update({
              status: 'cancelled',
            });
            await firestore().collection('rides').doc(rideId).update({
              status: 'cancelled',
            });
            navigation.navigate('Home');
          },
        },
      ],
    );
  };

  const completeRide = async () => {
    await database().ref(`activeRides/${rideId}`).update({
      status: 'completed',
      completedAt: Date.now(),
    });
    await firestore().collection('rides').doc(rideId).update({
      status: 'completed',
      completedAt: firestore.FieldValue.serverTimestamp(),
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading ride details...</Text>
      </View>
    );
  }

  const getStatusText = () => {
    switch (rideData?.status) {
      case 'searching':
        return 'Searching for driver...';
      case 'accepted':
        return 'Driver is on the way';
      case 'arrived':
        return 'Driver has arrived';
      case 'started':
        return 'Ride in progress';
      default:
        return 'Processing...';
    }
  };

  const getStatusColor = () => {
    switch (rideData?.status) {
      case 'searching':
        return '#FFC107';
      case 'accepted':
      case 'arrived':
        return '#2196F3';
      case 'started':
        return '#4CAF50';
      default:
        return '#999';
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={{
          latitude: rideData?.pickupLocation?.latitude || 24.7136,
          longitude: rideData?.pickupLocation?.longitude || 46.6753,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}>
        {rideData?.pickupLocation && (
          <Marker
            coordinate={rideData.pickupLocation}
            title="Pickup"
            pinColor="#4CAF50"
          />
        )}
        {driverLocation && (
          <Marker
            coordinate={driverLocation}
            title="Driver">
            <Icon name="local-taxi" size={40} color="#FFD700" />
          </Marker>
        )}
      </MapView>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      <View style={styles.infoCard}>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
          <Text style={styles.statusText}>{getStatusText()}</Text>
        </View>

        {rideData?.driver && (
          <View style={styles.driverInfo}>
            <View style={styles.driverAvatar}>
              <Icon name="person" size={32} color="#fff" />
            </View>
            <View style={styles.driverDetails}>
              <Text style={styles.driverName}>{rideData.driver.name}</Text>
              <Text style={styles.vehicleInfo}>
                {rideData.driver.vehicle} • {rideData.driver.plateNumber}
              </Text>
            </View>
            <TouchableOpacity style={styles.callButton}>
              <Icon name="phone" size={24} color="#4CAF50" />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.rideDetails}>
          <View style={styles.detailRow}>
            <Icon name="my-location" size={20} color="#4CAF50" />
            <Text style={styles.detailText}>{rideData?.pickup}</Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name="location-on" size={20} color="#FF5722" />
            <Text style={styles.detailText}>{rideData?.destination}</Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name="payments" size={20} color="#FFC107" />
            <Text style={styles.detailText}>
              {rideData?.estimatedFare} SAR • Cash Payment
            </Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          {rideData?.status === 'searching' && (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={cancelRide}>
              <Text style={styles.cancelButtonText}>Cancel Ride</Text>
            </TouchableOpacity>
          )}
          
          {rideData?.status === 'started' && (
            <TouchableOpacity
              style={styles.completeButton}
              onPress={completeRide}>
              <Text style={styles.completeButtonText}>Complete Ride</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 25,
    padding: 12,
  },
  infoCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  statusBadge: {
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 20,
  },
  statusText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  driverAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  driverDetails: {
    flex: 1,
    marginLeft: 15,
  },
  driverName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  vehicleInfo: {
    color: '#999',
    fontSize: 14,
  },
  callButton: {
    padding: 10,
  },
  rideDetails: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 10,
    flex: 1,
  },
  actionButtons: {
    gap: 10,
  },
  cancelButton: {
    backgroundColor: '#f44336',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  completeButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RideTrackingScreen;
