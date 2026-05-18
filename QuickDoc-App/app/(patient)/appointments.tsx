import { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/colors';
import { listenToUserBookings, Booking } from '../../firebase/firestore';
import { useAuthStore } from '../../store/authStore';

function statusColor(status: Booking['status']) {
  if (status === 'confirmed') return Colors.primary;
  if (status === 'completed') return Colors.available;
  return Colors.offline;
}

function statusLabel(status: Booking['status']) {
  if (status === 'confirmed') return 'Upcoming';
  if (status === 'completed') return 'Completed';
  return 'Cancelled';
}

export default function AppointmentsScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;
    const unsub = listenToUserBookings(user.uid, (data) => {
      setBookings(data);
      setLoading(false);
    });
    return unsub;
  }, [user?.uid]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 }}>
        <Text style={{ fontSize: 24, fontWeight: '700', color: Colors.textMain }}>My Bookings</Text>
        <Text style={{ fontSize: 14, color: Colors.textSub, marginTop: 2 }}>
          Track your appointments & queue
        </Text>
      </View>

      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={Colors.primary} size="large" />
        </View>
      ) : bookings.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 48 }}>📅</Text>
          <Text style={{ fontSize: 18, fontWeight: '600', color: Colors.textMain, marginTop: 12 }}>
            No Bookings Yet
          </Text>
          <Text style={{ fontSize: 14, color: Colors.textSub, marginTop: 6, textAlign: 'center', paddingHorizontal: 40 }}>
            Your upcoming appointments will appear here
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/(patient)/search')}
            style={{
              marginTop: 24,
              backgroundColor: Colors.primary,
              paddingHorizontal: 28,
              paddingVertical: 14,
              borderRadius: 14,
            }}
          >
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>Find a Doctor</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, gap: 12 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                item.status === 'confirmed'
                  ? router.push(`/(patient)/queue/${item.id}` as any)
                  : null
              }
              style={{
                backgroundColor: Colors.card,
                borderRadius: 16,
                padding: 16,
                borderWidth: 1,
                borderColor: Colors.border,
              }}
              activeOpacity={item.status === 'confirmed' ? 0.75 : 1}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: '700', color: Colors.textMain }}>
                    {item.doctorName}
                  </Text>
                  <Text style={{ fontSize: 13, color: Colors.textSub, marginTop: 2 }}>
                    {item.doctorSpecialty}
                  </Text>
                </View>
                <View
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 20,
                    backgroundColor: statusColor(item.status) + '20',
                  }}
                >
                  <Text style={{ fontSize: 12, fontWeight: '600', color: statusColor(item.status) }}>
                    {statusLabel(item.status)}
                  </Text>
                </View>
              </View>

              <View style={{ flexDirection: 'row', gap: 16, marginTop: 12 }}>
                <Text style={{ fontSize: 13, color: Colors.textSub }}>📅 {item.date}</Text>
                <Text style={{ fontSize: 13, color: Colors.textSub }}>🕐 {item.timeSlot}</Text>
              </View>

              {item.status === 'confirmed' && (
                <View
                  style={{
                    marginTop: 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: Colors.primary50,
                    borderRadius: 10,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                  }}
                >
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary, marginRight: 8 }} />
                  <Text style={{ fontSize: 13, color: Colors.primary, fontWeight: '600' }}>
                    Tap to track live queue
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}
