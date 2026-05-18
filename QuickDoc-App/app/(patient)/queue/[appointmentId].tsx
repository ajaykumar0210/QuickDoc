import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors } from '../../../constants/colors';

const QUEUE_STAGES = [
  { id: 1, label: 'Booking Confirmed', done: true, icon: '✅' },
  { id: 2, label: 'Payment Received', done: true, icon: '💳' },
  { id: 3, label: 'You\'re in Queue', done: true, icon: '⏳' },
  { id: 4, label: 'Your Turn', done: false, icon: '🔔' },
  { id: 5, label: 'Consultation Done', done: false, icon: '🩺' },
];

export default function QueueScreen() {
  const router = useRouter();
  const { appointmentId } = useLocalSearchParams<{ appointmentId: string }>();
  const [queuePosition, setQueuePosition] = useState(3);
  const [estWait, setEstWait] = useState(30);
  const [pulseAnim] = useState(new Animated.Value(1));

  // Pulse animation for "live" indicator
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.15, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  // Simulate queue moving (demo only)
  useEffect(() => {
    if (queuePosition <= 0) return;
    const timer = setTimeout(() => {
      setQueuePosition((q) => Math.max(0, q - 1));
      setEstWait((w) => Math.max(0, w - 10));
    }, 8000);
    return () => clearTimeout(timer);
  }, [queuePosition]);

  const isYourTurn = queuePosition === 0;

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
        <Text style={{ fontSize: 18, fontWeight: '700', color: Colors.textMain }}>Live Queue</Text>
        <View style={{ flex: 1 }} />
        {/* Live indicator */}
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF2F2', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 }}>
          <Animated.View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.emergency, marginRight: 6, transform: [{ scale: pulseAnim }] }} />
          <Text style={{ fontSize: 12, fontWeight: '700', color: Colors.emergency }}>LIVE</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>

        {/* ── Main Queue Display ── */}
        <View style={{ alignItems: 'center', paddingVertical: 36 }}>
          <View
            style={{
              width: 160,
              height: 160,
              borderRadius: 80,
              borderWidth: 8,
              borderColor: isYourTurn ? Colors.available : Colors.primary,
              backgroundColor: isYourTurn ? '#F0FDF4' : Colors.primary50,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 20,
            }}
          >
            {isYourTurn ? (
              <>
                <Text style={{ fontSize: 48 }}>🔔</Text>
                <Text style={{ fontSize: 14, fontWeight: '700', color: Colors.available, marginTop: 4 }}>
                  Your Turn!
                </Text>
              </>
            ) : (
              <>
                <Text style={{ fontSize: 56, fontWeight: '900', color: Colors.primary }}>
                  {queuePosition}
                </Text>
                <Text style={{ fontSize: 14, color: Colors.textSub, fontWeight: '500' }}>
                  {queuePosition === 1 ? 'person' : 'people'} ahead
                </Text>
              </>
            )}
          </View>

          {isYourTurn ? (
            <>
              <Text style={{ fontSize: 24, fontWeight: '800', color: Colors.available }}>
                It's Your Turn! 🎉
              </Text>
              <Text style={{ fontSize: 15, color: Colors.textSub, marginTop: 8, textAlign: 'center' }}>
                Please proceed to the doctor's room
              </Text>
            </>
          ) : (
            <>
              <Text style={{ fontSize: 24, fontWeight: '800', color: Colors.textMain }}>
                {queuePosition} {queuePosition === 1 ? 'Person' : 'People'} Ahead
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                <Text style={{ fontSize: 28 }}>⏱️</Text>
                <Text style={{ fontSize: 18, fontWeight: '600', color: Colors.textSub, marginLeft: 8 }}>
                  ~{estWait} min estimated wait
                </Text>
              </View>
            </>
          )}
        </View>

        {/* ── Appointment Details ── */}
        <View
          style={{
            marginHorizontal: 16,
            marginBottom: 16,
            padding: 16,
            backgroundColor: Colors.card,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: Colors.border,
          }}
        >
          <Text style={{ fontSize: 15, fontWeight: '700', color: Colors.textMain, marginBottom: 14 }}>
            Appointment Details
          </Text>
          {[
            { icon: '👩‍⚕️', label: 'Doctor', value: 'Dr. Priya Sharma' },
            { icon: '🏥', label: 'Specialty', value: 'Cardiologist' },
            { icon: '📍', label: 'Clinic', value: 'HeartCare Clinic, Noida' },
            { icon: '🕐', label: 'Slot', value: 'Today, 11:00 AM' },
            { icon: '🎫', label: 'Token No.', value: `#QD${appointmentId?.slice(-4)?.toUpperCase() ?? '0012'}` },
          ].map((row, idx) => (
            <View
              key={idx}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: idx < 4 ? 10 : 0,
              }}
            >
              <Text style={{ fontSize: 18, marginRight: 12, width: 28 }}>{row.icon}</Text>
              <Text style={{ fontSize: 13, color: Colors.textSub, width: 80 }}>{row.label}</Text>
              <Text style={{ fontSize: 14, fontWeight: '600', color: Colors.textMain, flex: 1 }}>
                {row.value}
              </Text>
            </View>
          ))}
        </View>

        {/* ── Progress Steps ── */}
        <View style={{ marginHorizontal: 16, marginBottom: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: Colors.textMain, marginBottom: 14 }}>
            Progress
          </Text>
          {QUEUE_STAGES.map((stage, idx) => (
            <View key={stage.id} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: idx < QUEUE_STAGES.length - 1 ? 0 : 0 }}>
              {/* Left — icon + line */}
              <View style={{ alignItems: 'center', width: 36 }}>
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: stage.done ? Colors.available : Colors.muted,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ fontSize: 18 }}>{stage.icon}</Text>
                </View>
                {idx < QUEUE_STAGES.length - 1 && (
                  <View
                    style={{
                      width: 2,
                      height: 24,
                      backgroundColor: stage.done ? Colors.available : Colors.border,
                    }}
                  />
                )}
              </View>
              {/* Right — label */}
              <View style={{ flex: 1, paddingLeft: 14, paddingBottom: idx < QUEUE_STAGES.length - 1 ? 24 : 0, justifyContent: 'center', paddingTop: 6 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: stage.done ? '600' : '400',
                    color: stage.done ? Colors.textMain : Colors.textMuted,
                  }}
                >
                  {stage.label}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* ── Notify me button ── */}
        <View style={{ marginHorizontal: 16 }}>
          <TouchableOpacity
            style={{
              backgroundColor: Colors.primaryLight,
              borderRadius: 14,
              height: 52,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              gap: 8,
            }}
          >
            <Text style={{ fontSize: 18 }}>🔔</Text>
            <Text style={{ fontSize: 15, fontWeight: '700', color: Colors.primary }}>
              Notify me when 1 person is left
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}