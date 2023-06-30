import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Linking } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default function App() {
  const [hasPermission, setHasPermission] = useState(false);
  const [scanData, setScanData] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanData(data);
    console.log(`Data: ${data}`);
    console.log(`Type: ${type}`);
    openLink(data);
  };

  const openLink = async (url) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    }
  };

  const handleScanAgain = () => {
    setScanData(null);
  };

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>Please grant camera permissions to the app.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        style={StyleSheet.absoluteFillObject}
        onBarCodeScanned={scanData ? undefined : handleBarCodeScanned}
      />
      <View style={styles.overlay}>
        <View style={styles.scanArea} />
      </View>
      {scanData ? (
        <View style={styles.scanResultContainer}>
          <Text style={styles.scanResultText}>{scanData}</Text>
          <TouchableOpacity style={styles.scanAgainButton} onPress={handleScanAgain}>
            <Text style={styles.scanAgainButtonText}>Scan Again?</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.scanPromptContainer}>
          <Text style={styles.scanPromptText}>Scan a barcode or QR code</Text>
        </View>
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: 200,
    height: 200,
    borderWidth: 2,
    borderColor: '#FFF',
    borderRadius: 10,
  },
  scanResultContainer: {
    position: 'absolute',
    bottom: 40,
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
  },
  scanResultText: {
    fontSize: 16,
    marginBottom: 10,
  },
  scanAgainButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  scanAgainButtonText: {
    color: '#FFF',
    fontSize: 14,
  },
  scanPromptContainer: {
    position: 'absolute',
    bottom: 40,
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
  },
  scanPromptText: {
    fontSize: 16,
  },
  permissionText: {
    color: '#FFF',
    fontSize: 18,
    textAlign: 'center',
  },
});
