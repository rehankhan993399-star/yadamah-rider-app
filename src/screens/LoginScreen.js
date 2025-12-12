import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const LoginScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [confirm, setConfirm] = useState(null);
  const [name, setName] = useState('');

  const signInWithPhoneNumber = async () => {
    try {
      const confirmation = await auth().signInWithPhoneNumber('+966' + phoneNumber);
      setConfirm(confirmation);
      Alert.alert('Success', 'OTP sent to your phone');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const confirmCode = async () => {
    try {
      const userCredential = await confirm.confirm(otp);
      const user = userCredential.user;

      // Create user profile in Firestore
      await firestore().collection('riders').doc(user.uid).set({
        name: name,
        phoneNumber: '+966' + phoneNumber,
        createdAt: firestore.FieldValue.serverTimestamp(),
        totalRides: 0,
      });
    } catch (error) {
      Alert.alert('Error', 'Invalid OTP');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>YADAMAH</Text>
        <Text style={styles.subtitle}>Welcome Rider</Text>

        {!confirm ? (
          <>
            <TextInput
              style={styles.input}
              placeholder="Your Name"
              placeholderTextColor="#999"
              value={name}
              onChangeText={setName}
            />
            <View style={styles.phoneContainer}>
              <Text style={styles.countryCode}>+966</Text>
              <TextInput
                style={styles.phoneInput}
                placeholder="Phone Number"
                placeholderTextColor="#999"
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                maxLength={9}
              />
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={signInWithPhoneNumber}
              disabled={!name || phoneNumber.length < 9}>
              <Text style={styles.buttonText}>Send OTP</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TextInput
              style={styles.input}
              placeholder="Enter OTP"
              placeholderTextColor="#999"
              keyboardType="number-pad"
              value={otp}
              onChangeText={setOtp}
              maxLength={6}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={confirmCode}
              disabled={otp.length < 6}>
              <Text style={styles.buttonText}>Verify OTP</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 40,
  },
  input: {
    backgroundColor: '#2a2a2a',
    borderRadius: 10,
    padding: 15,
    color: '#fff',
    fontSize: 16,
    marginBottom: 15,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 10,
    marginBottom: 15,
    paddingLeft: 15,
  },
  countryCode: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  phoneInput: {
    flex: 1,
    padding: 15,
    color: '#fff',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
