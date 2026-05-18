import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';

export default function AppointmentsScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <View className="px-5 pt-4 pb-2">
        <Text style={{ fontSize: 24, fontWeight: '700', color: Colors.textMain }}>
          My Bookings
        </Text>
        <Text style={{ fontSize: 14, color: Colors.textSub, marginTop: 2 }}>
          Track your appointments & queue
        </Text>
      </View>

      <View className="flex-1 items-center justify-center">
        <Text style={{ fontSize: 48 }}>📅</Text>
        <Text style={{ fontSize: 18, fontWeight: '600', color: Colors.textMain, marginTop: 12 }}>
          No Bookings Yet
        </Text>
        <Text style={{ fontSize: 14, color: Colors.textSub, marginTop: 6, textAlign: 'center', paddingHorizontal: 40 }}>
          Your upcoming appointments will appear here
        </Text>
      </View>
    </SafeAreaView>
  );
}
