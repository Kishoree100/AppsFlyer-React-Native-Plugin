/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React, { useEffect, useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  Button,
  useColorScheme,
  ScrollView,
  Alert,
} from 'react-native';
import appsFlyer from 'react-native-appsflyer';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [afId, setAfId] = useState('');
  const [conversionData, setConversionData] = useState(null);
  const [deepLinkData, setDeepLinkData] = useState(null);

  useEffect(() => {
    const customerUserId = 'RN_User1';
    appsFlyer.setCustomerUserId(customerUserId, (res) => {
      console.log('setCustomerUserId:', res);
    });

    // Get AppsFlyer ID
    appsFlyer.getAppsFlyerUID((err, id) => {
      if (!err) {
        setAfId(id);
      }
    });

    const options = {
      devKey: 'CpYt7yYGtdMfBHMPqBohs7',
      isDebug: true,
      appId: 'YOUR_IOS_APP_ID_IF_NEEDED',
      onInstallConversionDataListener: true,
      onDeepLinkListener: true,
    };

    appsFlyer.initSdk(
      options,
      (result) => {
        console.log('AppsFlyer SDK initialized:', result);
      },
      (error) => {
        console.error('AppsFlyer init error:', error);
      }
    );

    const conversionListener = appsFlyer.onInstallConversionData((res) => {
      if (res?.data) {
        const data = JSON.parse(res.data);
        console.log('Install Conversion Data:', data);
        setConversionData(data);
      }
    });

    const udlListener = appsFlyer.onDeepLink((res) => {
      console.log('UDL Result:', res);
      if (res.status === 'FOUND') {
        setDeepLinkData(res.deepLink);
      }
    });

    return () => {
      conversionListener();
      udlListener();
    };
  }, []);

  const handlePurchase = () => {
    const eventValues = {
      af_revenue: '50',
      af_currency: 'USD',
      af_content_type: 'product',
      af_content_id: '1234567',
    };

    appsFlyer.logEvent('af_purchase', eventValues,
      (res) => {
        console.log('Event logged:', res);
        Alert.alert('Purchase Event Sent', JSON.stringify(eventValues, null, 2));
      },
      (err) => {
        console.error('Event log error:', err);
        Alert.alert('Failed to log event.');
      }
    );
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, isDarkMode && styles.darkBackground]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      <Text style={styles.heading}>AppsFlyer Test App</Text>

      <Text style={styles.label}>AppsFlyer ID:</Text>
      <Text style={styles.value}>{afId || 'Loading...'}</Text>

      <Text style={styles.label}>Conversion Data:</Text>
      <Text style={styles.value}>{conversionData ? JSON.stringify(conversionData, null, 2) : 'No conversion data yet.'}</Text>

      <Text style={styles.label}>Deep Link Data:</Text>
      <Text style={styles.value}>{deepLinkData ? JSON.stringify(deepLinkData, null, 2) : 'No deep link data yet.'}</Text>

      <View style={styles.buttonContainer}>
        <Button title="Purchase event" onPress={handlePurchase} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  darkBackground: {
    backgroundColor: '#121212',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00A8E8',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontWeight: 'bold',
    marginTop: 15,
  },
  value: {
    fontSize: 14,
    marginTop: 5,
    marginBottom: 10,
    color: '#333333',
  },
  buttonContainer: {
    marginTop: 30,
    width: '100%',
  },
});

export default App;