import { View, Text, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';

const EMERGENCY_NUMBERS = [
  { id: '1', label: 'Ambulance', number: '108', icon: '🚑', color: '#FEF2F2', borderColor: Colors.emergency },
  { id: '2', label: 'Police', number: '100', icon: '👮', color: '#EFF6FF', borderColor: '#3B82F6' },
  { id: '3', label: 'Fire Brigade', number: '101', icon: '🚒', color: '#FFF7ED', borderColor: '#F97316' },
  { id: '4', label: 'Women Helpline', number: '1091', icon: '🆘', color: '#FDF4FF', borderColor: '#A855F7' },
];

const NEARBY_ER = [
  { id: '1', name: 'Metro Hospital ER', distance: '0.8 km', available: true, wait: '5 min' },
  { id: '2', name: 'City Medical Center', distance: '1.4 km', available: true, wait: '15 min' },
  { id: '3', name: 'Apollo Emergency', distance: '2.2 km', available: true, wait: '8 min' },
];

function callNumber(number: string) {
  Linking.openURL(`tel:${number}`).catch(() =>
    Alert.alert('Cannot Call', 'Unable to make a call from this device.')
  );
}

export default function EmergencyScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FEF2F2' }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Header */}
        <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16 }}>
          <Text style={{ fontSize: 22, fontWeight: '800', color: Colors.textMain }}>🚨 Emergency</Text>
          <Text style={{ fontSize: 14, color: Colors.textSub, marginTop: 4 }}>
            Quick access to emergency services
          </Text>
        </View>

        {/* SOS Button */}
        <View style={{ alignItems: 'center', marginBottom: 28 }}>
          <TouchableOpacity
            onPress={() => callNumber('108')}
            style={{
              width: 140,
              height: 140,
              borderRadius: 70,
              backgroundColor: Colors.emergency,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: Colors.emergency,
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.4,
              shadowRadius: 20,
              elevation: 12,
            }}
            activeOpacity={0.85}
          >
            <Text style={{ fontSize: 40 }}>🆘</Text>
            <Text style={{ fontSize: 16, fontWeight: '900', color: '#fff', marginTop: 4 }}>SOS</Text>
            <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)' }}>Call 108</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 13, color: Colors.textSub, marginTop: 12 }}>
            Tap SOS to call Ambulance (108)
          </Text>
        </View>

        {/* Emergency Numbers */}
        <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: Colors.textMain, marginBottom: 12 }}>
            Emergency Numbers
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {EMERGENCY_NUMBERS.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => callNumber(item.number)}
                style={{
                  width: '47%',
                  padding: 16,
                  borderRadius: 16,
                  backgroundColor: item.color,
                  borderWidth: 1.5,
                  borderColor: item.borderColor,
                  alignItems: 'center',
                }}
                activeOpacity={0.8}
              >
                <Text style={{ fontSize: 32, marginBottom: 6 }}>{item.icon}</Text>
                <Text style={{ fontSize: 24, fontWeight: '900', color: Colors.textMain }}>
                  {item.number}
                </Text>
                <Text style={{ fontSize: 13, color: Colors.textSub, marginTop: 2 }}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Nearby ERs */}
        <View style={{ paddingHorizontal: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: Colors.textMain, marginBottom: 12 }}>
            Nearest Emergency Rooms
          </Text>
          {NEARBY_ER.map((er) => (
            <View
              key={er.id}
              style={{
                backgroundColor: Colors.card,
                borderRadius: 14,
                padding: 14,
                marginBottom: 10,
                flexDirection: 'row',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: Colors.border,
              }}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: '700', color: Colors.textMain }}>{er.name}</Text>
                <Text style={{ fontSize: 13, color: Colors.textSub, marginTop: 2 }}>📍 {er.distance}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                  <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: Colors.available, marginRight: 5 }} />
                  <Text style={{ fontSize: 12, color: Colors.available, fontWeight: '600' }}>Open</Text>
                </View>
                <Text style={{ fontSize: 12, color: Colors.textSub }}>~{er.wait} wait</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}