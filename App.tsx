
import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import RootNavigator from './src/navigation/RootNavigator';
import { AuthProvider } from './src/contexts/AuthContext';
import { initDatabase } from './src/database/initDatabase';

const App = () => {
  const [dbReady, setDbReady] = useState(false);
  const [dbError, setDbError] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      try {
        await initDatabase();
        setDbReady(true);
        console.log('Database is ready!');
      } catch (error) {
        console.error('Database initialization failed:', error);
        setDbError(true);
      }
    };

    initialize();
  }, []);

  if (dbError) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          Không thể khởi tạo cơ sở dữ liệu.
        </Text>
        <Text>Vui lòng kiểm tra lại cấu hình database.</Text>
      </View>
    );
  }

  if (!dbReady) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#287A50" />
        <Text style={styles.loadingText}>
          Đang khởi tạo dữ liệu...
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666666',
  },
  errorText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E53935',
    marginBottom: 8,
  },
});

export default App;
