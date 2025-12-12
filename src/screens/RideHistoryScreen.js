import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const RideHistoryScreen = ({ navigation }) => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRideHistory();
  }, []);

  const fetchRideHistory = async () => {
    try {
      const user = auth().currentUser;
      const ridesSnapshot = await firestore()
        .collection('rides')
        .where('riderId', '==', user.uid)
        .orderBy('createdAt', 'desc')
        .limit(50)
        .get();

      const ridesData = ridesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setRides(ridesData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching rides:', error);
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#4CAF50';
      case 'cancelled':
        return '#f44336';
      case 'searching':
      case 'accepted':
      case 'started':
        return '#FFC107';
      default:
        return '#999';
    }
  };

  const renderRideItem = ({ item }) => (
    <View style={styles.rideCard}>
      <View style={styles.rideHeader}>
        <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
        <Text style={styles.rideDate}>{formatDate(item.createdAt)}</Text>
        <Text style={[styles.rideStatus, { color: getStatusColor(item.status) }]}>
          {item.status.toUpperCase()}
        </Text>
      </View>

      <View style={styles.locationRow}>
        <Icon name="my-location" size={16} color="#4CAF50" />
        <Text style={styles.locationText} numberOfLines={1}>
          {item.pickup}
        </Text>
      </View>

      <View style={styles.locationRow}>
        <Icon name="location-on" size={16} color="#FF5722" />
        <Text style={styles.locationText} numberOfLines={1}>
          {item.destination}
        </Text>
      </View>

      <View style={styles.rideFooter}>
        <View style={styles.vehicleType}>
          <Icon name="local-taxi" size={16} color="#999" />
          <Text style={styles.vehicleText}>{item.vehicleType}</Text>
        </View>
        <Text style={styles.fareText}>{item.estimatedFare} SAR</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ride History</Text>
        <View style={{ width: 28 }} />
      </View>

      {rides.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="history" size={80} color="#444" />
          <Text style={styles.emptyText}>No rides yet</Text>
          <Text style={styles.emptySubtext}>Your ride history will appear here</Text>
        </View>
      ) : (
        <FlatList
          data={rides}
          renderItem={renderRideItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  listContainer: {
    padding: 20,
  },
  rideCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  rideHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  rideDate: {
    flex: 1,
    color: '#999',
    fontSize: 12,
  },
  rideStatus: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  rideFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#3a3a3a',
  },
  vehicleType: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vehicleText: {
    color: '#999',
    fontSize: 12,
    marginLeft: 5,
    textTransform: 'capitalize',
  },
  fareText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  emptySubtext: {
    color: '#999',
    fontSize: 14,
    marginTop: 8,
  },
});

export default RideHistoryScreen;
