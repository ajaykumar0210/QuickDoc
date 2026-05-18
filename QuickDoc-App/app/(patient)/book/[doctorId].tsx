import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors } from '../../../constants/colors';

const TIME_SLOTS = [
  { id: '1', time: '10:00 AM', available: true },
  { id: '2', time: '10:30 AM', available: false },
  { id: '3', time: '11:00 AM', available: true },
  { id: '4', time: '11:30 AM', available: true },
  { id: '5', time: '12:00 PM', available: false },
  { id: '6', time: '12:30 PM', available: true },
  { id: '7', time: '05:00 PM', available: true },
  { id: '8', time: '05:30 PM', available: true },
  { id: '9', time: '06:00 PM', available: true },
  { id: '10', time: '06:30 PM', available: false },
  { id: '11', time: '07:00 PM', available: true },
  { id: '12', time: '07:30 PM', available: true },
];

const VISIT_TYPES = [
  { id: 'new', label: 'New Patient', desc: 'First visit to this doctor', icon: '🆕' },
  { id: 'follow', label: 'Follow Up', desc: 'Existing patient returning', icon: '🔄' },
];

const DAYS = [
  { id: '0', label: 'Today', day: 'Sat', date: '17' },
  { id: '1', label: 'Tomorrow', day: 'Sun', date: '18' },
  { id: '2', label: '', day: 'Mon', date: '19' },
  { id: '3', label: '', day: 'Tue', date: '20' },
  { id: '4', label: '', day: 'Wed', date: '21' },
];

export default function BookingScreen() {
  const router = useRouter();
  const { doctorId } = useLocalSearchParams<{ doctorId: string }>();
  const [selectedDay, setSelectedDay] = useState('0');
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [visitType, setVisitType] = useState('new');
  const [loading, setLoading] = useState(false);

  async function handleConfirmBooking() {
    if (!selectedSlot) {
      Alert.alert('Select Time', 'Please select an appointment time slot.');
      return;
    }
    setLoading(true);
    // Simulate booking API call
    setTimeout(() => {
      setLoading(false);
      const appointmentId = `apt_${Date.now()}`;
      router.replace(`/(patient)/queue/${appointmentId}` as any);
    }, 1500);
  }

  const selectedSlotData = TIME_SLOTS.find((s) => s.id === selectedSlot);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingTop: 8,
          paddingBottom: 12,
          backgroundColor: Colors.card,
          borderBottomWidth: 1,
          borderBottomColor: Colors.border,
        }}
      >
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16, padding: 4 }}>
          <Text style={{ fontSize: 22, color: Colors.textMain }}>←</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '700', color: Colors.textMain }}>Book Appointment</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 140 }}>
        {/* Doctor summary */}
        <View
          style={{
            margin: 16,
            padding: 16,
            backgroundColor: Colors.card,
            borderRadius: 16,
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: Colors.border,
          }}
        >
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              backgroundColor: Colors.primaryLight,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 14,
            }}
          >
            <Text style={{ fontSize: 26 }}>👩‍⚕️</Text>
          </View>
          <View>
            <Text style={{ fontSize: 16, fontWeight: '700', color: Colors.textMain }}>Dr. Priya Sharma</Text>
            <Text style={{ fontSize: 13, color: Colors.primary, fontWeight: '500' }}>Cardiologist</Text>
            <Text style={{ fontSize: 12, color: Colors.textSub, marginTop: 2 }}>📍 HeartCare Clinic, Noida</Text>
          </View>
        </View>

        {/* Visit Type */}
        <View style={{ marginHorizontal: 16, marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: Colors.textMain, marginBottom: 12 }}>
            Visit Type
          </Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            {VISIT_TYPES.map((type) => {
              const isSelected = visitType === type.id;
              return (
                <TouchableOpacity
                  key={type.id}
                  onPress={() => setVisitType(type.id)}
                  style={{
                    flex: 1,
                    padding: 14,
                    borderRadius: 14,
                    borderWidth: 2,
                    borderColor: isSelected ? Colors.primary : Colors.border,
                    backgroundColor: isSelected ? Colors.primary50 : Colors.card,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ fontSize: 24, marginBottom: 4 }}>{type.icon}</Text>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: isSelected ? Colors.primary : Colors.textMain }}>
                    {type.label}
                  </Text>
                  <Text style={{ fontSize: 11, color: Colors.textSub, textAlign: 'center', marginTop: 2 }}>
                    {type.desc}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Day Selector */}
        <View style={{ marginHorizontal: 16, marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: Colors.textMain, marginBottom: 12 }}>
            Select Date
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
            {DAYS.map((day) => {
              const isSelected = selectedDay === day.id;
              return (
                <TouchableOpacity
                  key={day.id}
                  onPress={() => { setSelectedDay(day.id); setSelectedSlot(null); }}
                  style={{
                    width: 60,
                    height: 72,
                    borderRadius: 14,
                    borderWidth: 2,
                    borderColor: isSelected ? Colors.primary : Colors.border,
                    backgroundColor: isSelected ? Colors.primary : Colors.card,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {day.label ? (
                    <Text style={{ fontSize: 10, color: isSelected ? Colors.primaryLight : Colors.primary, fontWeight: '600', marginBottom: 2 }}>
                      {day.label}
                    </Text>
                  ) : null}
                  <Text style={{ fontSize: 22, fontWeight: '800', color: isSelected ? '#fff' : Colors.textMain }}>
                    {day.date}
                  </Text>
                  <Text style={{ fontSize: 12, color: isSelected ? Colors.primaryLight : Colors.textSub }}>
                    {day.day}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Time Slots */}
        <View style={{ marginHorizontal: 16, marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: Colors.textMain, marginBottom: 12 }}>
            Select Time Slot
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {TIME_SLOTS.map((slot) => {
              const isSelected = selectedSlot === slot.id;
              return (
                <TouchableOpacity
                  key={slot.id}
                  onPress={() => slot.available && setSelectedSlot(slot.id)}
                  disabled={!slot.available}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    borderRadius: 12,
                    borderWidth: 2,
                    borderColor: isSelected
                      ? Colors.primary
                      : slot.available
                      ? Colors.border
                      : Colors.divider,
                    backgroundColor: isSelected
                      ? Colors.primary
                      : slot.available
                      ? Colors.card
                      : Colors.muted,
                    opacity: slot.available ? 1 : 0.5,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: '600',
                      color: isSelected ? '#fff' : slot.available ? Colors.textMain : Colors.textMuted,
                    }}
                  >
                    {slot.time}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Booking fee info */}
        <View
          style={{
            marginHorizontal: 16,
            padding: 16,
            backgroundColor: Colors.primary50,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: Colors.primaryLight,
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: '700', color: Colors.textMain, marginBottom: 8 }}>
            💳 Booking Summary
          </Text>
          {[
            { label: 'Consultation Fee', value: '₹500' },
            { label: 'Platform Fee (QuickDoc)', value: '₹10' },
            { label: 'Convenience Fee', value: '₹2' },
          ].map((row, idx) => (
            <View
              key={idx}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: idx < 2 ? 6 : 0,
              }}
            >
              <Text style={{ fontSize: 13, color: Colors.textSub }}>{row.label}</Text>
              <Text style={{ fontSize: 13, fontWeight: '600', color: Colors.textMain }}>{row.value}</Text>
            </View>
          ))}
          <View style={{ height: 1, backgroundColor: Colors.primaryLight, marginVertical: 10 }} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 15, fontWeight: '700', color: Colors.textMain }}>Total (booking only)</Text>
            <Text style={{ fontSize: 15, fontWeight: '800', color: Colors.primary }}>₹12</Text>
          </View>
          <Text style={{ fontSize: 11, color: Colors.textSub, marginTop: 6 }}>
            * Consultation fee (₹500) payable directly at the clinic
          </Text>
        </View>
      </ScrollView>

      {/* Fixed CTA */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: Colors.card,
          paddingHorizontal: 20,
          paddingVertical: 16,
          borderTopWidth: 1,
          borderTopColor: Colors.border,
        }}
      >
        {selectedSlotData && (
          <Text style={{ fontSize: 13, color: Colors.textSub, textAlign: 'center', marginBottom: 10 }}>
            Selected: <Text style={{ fontWeight: '700', color: Colors.textMain }}>{selectedSlotData.time}</Text>{' '}
            — {DAYS.find((d) => d.id === selectedDay)?.label || `May ${DAYS.find((d) => d.id === selectedDay)?.date}`}
          </Text>
        )}
        <TouchableOpacity
          onPress={handleConfirmBooking}
          disabled={loading}
          style={{
            backgroundColor: Colors.primary,
            borderRadius: 14,
            height: 54,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: Colors.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: 6,
          }}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#fff' }}>
              Confirm & Pay ₹12
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}