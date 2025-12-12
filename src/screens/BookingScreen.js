import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import firestore from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

const BookingScreen = ({ navigation, route }) => {
  const { currentLocation } = route.params;
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('standard');
  const [estimatedFare, setEstimatedFare] = useState(0);

  const vehicleTypes = [
    { id: 'standard', name: 'Standard', icon: 'local-taxi', baseRate: 10, perKm: 2 },
    { id: 'comfort', name: 'Comfort', icon: 'directions-car', baseRate: 15, perKm: 3 },
    { id: 'premium', name: 'Premium', icon: 'airport-shuttle', baseRate: 25, perKm: 5 },
  ];

  const calculateFare = () => {
    const distance = Math.random() * 10 + 2; // Mock distance calculation
    const vehicle = vehicleTypes.find(v => v.id === selectedVehicle);
    const fare = vehicle.baseRate + (distance * vehicle.perKm);
    setEstimatedFare(Math.round(fare));
  };

  const bookRide = async () => {
    if (!pickup || !destination) {
      Alert.alert('Error', 'Please enter pickup and destination');
      return;
    }

    try {
      const user = auth().currentUser;
      const rideData = {
        riderId: user.uid,
        pickup,
        destination,
        vehicleType: selectedVehicle,
        estimatedFare,
        status: 'searching',
        paymentMethod: 'cash',
        pickupLocation: currentLocation,
        createdAt: firestore.FieldValue.serverTimestamp(),
      };

      // Create ride in Firestore
      const rideRef = await firestore().collection('rides').add(rideData);

      // Add to real-time database for driver matching
      await database().ref(`activeRides/${rideRef.id}`).set({
        ...rideData,
        rideId: rideRef.id,
        createdAt: Date.now(),
      });

      Alert.alert('Success', 'Searching for nearby drivers...', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('RideTracking', { rideId: rideRef.id }),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to book ride');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book a Ride</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.inputContainer}>
          <Icon name="my-location" size={24} color="#4CAF50" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Pickup Location"
            placeholderTextColor="#999"
            value={pickup}
            onChangeText={setPickup}
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="location-on" size={24} color="#FF5722" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Destination"
            placeholderTextColor="#999"
            value={destination}
            onChangeText={setDestination}
            onBlur={calculateFare}
          />
        </View>

        <Text style={styles.sectionTitle}>Select Vehicle</Text>
        {vehicleTypes.map((vehicle) => (
          <TouchableOpacity
            key={vehicle.id}
            style={[
              styles.vehicleCard,
              selectedVehicle === vehicle.id && styles.vehicleCardSelected,
            ]}
            onPress={() => {
              setSelectedVehicle(vehicle.id);
              calculateFare();
            }}>
            <Icon
              name={vehicle.icon}
              size={32}
              color={selectedVehicle === vehicle.id ? '#4CAF50' : '#fff'}
            />
            <View style={styles.vehicleInfo}>
              <Text style={styles.vehicleName}>{vehicle.name}</Text>
              <Text style={styles.vehicleRate}>
                {vehicle.baseRate} SAR + {vehicle.perKm} SAR/km
              </Text>
            </View>
            {selectedVehicle === vehicle.id && (
              <Icon name="check-circle" size={24} color="#4CAF50" />
            )}
          </TouchableOpacity>
        ))}

        {estimatedFare > 0 && (
          <View style={styles.fareContainer}>
            <Text style={styles.fareLabel}>Estimated Fare</Text>
            <Text style={styles.fareAmount}>{estimatedFare} SAR</Text>
            <Text style={styles.paymentMethod}>💵 Cash Payment</Text>
          </View>
        )}
      </ScrollView>

      <TouchableOpacity style={styles.bookButton} onPress={bookRide}>
        <Text style={styles.bookButtonText}>Confirm Booking</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#2a2a2a',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    padding: 15,
    color: '#fff',
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    marginBottom: 15,
  },
  vehicleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  vehicleCardSelected: {
    borderColor: '#4CAF50',
    backgroundColor: '#1e3a1e',
  },
  vehicleInfo: {
    flex: 1,
    marginLeft: 15,
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  vehicleRate: {
    fontSize: 14,
    color: '#999',
  },
  fareContainer: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    alignItems: 'center',
  },
  fareLabel: {
    fontSize: 14,
    color: '#999',
    marginBottom: 5,
  },
  fareAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 10,
  },
  paymentMethod: {
    fontSize: 16,
    color: '#fff',
  },
  bookButton: {
    backgroundColor: '#4CAF50',
    margin: 20,
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default BookingScreen;
