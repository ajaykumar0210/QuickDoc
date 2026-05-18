import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  TextInput,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/authStore';
import { Colors } from '../../constants/colors';

// ─── Data ────────────────────────────────────────────────────────────────────

const SPECIALTIES = [
  { id: '1', label: 'General', icon: '🩺' },
  { id: '2', label: 'Dentist', icon: '🦷' },
  { id: '3', label: 'Cardiologist', icon: '❤️' },
  { id: '4', label: 'Orthopedic', icon: '🦴' },
  { id: '5', label: 'Dermatologist', icon: '🧴' },
  { id: '6', label: 'ENT', icon: '👂' },
  { id: '7', label: 'Pediatrics', icon: '👶' },
  { id: '8', label: 'Gynecology', icon: '🌸' },
];

const QUICK_ACTIONS = [
  { id: '1', label: 'Book Doctor', icon: '👨‍⚕️', color: '#E0F2FE', route: '/(patient)/search' },
  { id: '2', label: 'Lab Tests', icon: '🧪', color: '#F0FDF4', route: '/(patient)/search' },
  { id: '3', label: 'Emergency', icon: '🚨', color: '#FEF2F2', route: '/(patient)/emergency' },
  { id: '4', label: 'My Queue', icon: '⏱️', color: '#FFFBEB', route: '/(patient)/appointments' },
];

const MOCK_DOCTORS = [
  {
    id: '1',
    name: 'Dr. Priya Sharma',
    specialty: 'Cardiologist',
    rating: 4.9,
    reviews: 312,
    fee: 500,
    queueCount: 3,
    available: true,
    experience: '12 yrs',
    qualification: 'MD, DM Cardiology',
  },
  {
    id: '2',
    name: 'Dr. Rahul Mehta',
    specialty: 'General Physician',
    rating: 4.7,
    reviews: 580,
    fee: 200,
    queueCount: 7,
    available: true,
    experience: '8 yrs',
    qualification: 'MBBS, MD',
  },
  {
    id: '3',
    name: 'Dr. Anita Verma',
    specialty: 'Dermatologist',
    rating: 4.8,
    reviews: 204,
    fee: 400,
    queueCount: 0,
    available: false,
    experience: '10 yrs',
    qualification: 'MBBS, DVD',
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function QueueBadge({ count, available }: { count: number; available: boolean }) {
  if (!available) {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: Colors.offline, marginRight: 5 }} />
        <Text style={{ fontSize: 12, color: Colors.offline, fontWeight: '500' }}>Offline</Text>
      </View>
    );
  }
  if (count === 0) {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: Colors.available, marginRight: 5 }} />
        <Text style={{ fontSize: 12, color: Colors.available, fontWeight: '600' }}>Available Now</Text>
      </View>
    );
  }
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: Colors.waiting, marginRight: 5 }} />
      <Text style={{ fontSize: 12, color: Colors.waiting, fontWeight: '600' }}>{count} ahead in queue</Text>
    </View>
  );
}

function DoctorCard({ doctor, onPress }: { doctor: typeof MOCK_DOCTORS[0]; onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: Colors.card,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: Colors.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
      }}
      activeOpacity={0.85}
    >
      <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
        {/* Avatar */}
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 14,
            backgroundColor: Colors.primaryLight,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 14,
          }}
        >
          <Text style={{ fontSize: 30 }}>👨‍⚕️</Text>
        </View>

        {/* Info */}
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: Colors.textMain, flex: 1 }} numberOfLines={1}>
              {doctor.name}
            </Text>
            <TouchableOpacity style={{ padding: 4 }}>
              <Text style={{ fontSize: 18, color: Colors.border }}>♡</Text>
            </TouchableOpacity>
          </View>

          <Text style={{ fontSize: 13, color: Colors.textSub, marginTop: 2 }}>{doctor.specialty}</Text>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <Text style={{ fontSize: 12, color: Colors.waiting, marginRight: 4 }}>⭐</Text>
            <Text style={{ fontSize: 13, fontWeight: '600', color: Colors.textMain }}>{doctor.rating}</Text>
            <Text style={{ fontSize: 12, color: Colors.textMuted, marginLeft: 3 }}>({doctor.reviews} reviews)</Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
            <Text style={{ fontSize: 12, color: Colors.textSub, marginRight: 12 }}>🎓 {doctor.qualification}</Text>
            <Text style={{ fontSize: 12, color: Colors.textSub }}>{doctor.experience}</Text>
          </View>
        </View>
      </View>

      {/* Bottom row */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 14,
          paddingTop: 12,
          borderTopWidth: 1,
          borderTopColor: Colors.divider,
        }}
      >
        <QueueBadge count={doctor.queueCount} available={doctor.available} />

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 15, fontWeight: '700', color: Colors.textMain, marginRight: 12 }}>
            ₹{doctor.fee}
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: doctor.available ? Colors.primary : Colors.border,
              paddingHorizontal: 18,
              paddingVertical: 8,
              borderRadius: 10,
            }}
          >
            <Text style={{ fontSize: 13, fontWeight: '700', color: doctor.available ? '#fff' : Colors.textMuted }}>
              {doctor.available ? 'Book Now' : 'Notify Me'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [selectedSpecialty, setSelectedSpecialty] = useState('1');

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const firstName = user?.displayName?.split(' ')[0] ?? 'there';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>

        {/* ── Header ── */}
        <View style={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View>
              <Text style={{ fontSize: 14, color: Colors.textSub }}>{greeting()} 👋</Text>
              <Text style={{ fontSize: 22, fontWeight: '800', color: Colors.textMain, marginTop: 2 }}>
                {firstName}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              {/* Notification bell */}
              <TouchableOpacity
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  backgroundColor: Colors.card,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 1,
                  borderColor: Colors.border,
                }}
              >
                <Text style={{ fontSize: 20 }}>🔔</Text>
              </TouchableOpacity>
              {/* Avatar */}
              <TouchableOpacity
                onPress={() => router.push('/(patient)/profile')}
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 21,
                  backgroundColor: Colors.primaryLight,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 2,
                  borderColor: Colors.primary,
                }}
              >
                <Text style={{ fontSize: 18 }}>👤</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Location */}
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
            <Text style={{ fontSize: 13, marginRight: 4 }}>📍</Text>
            <Text style={{ fontSize: 13, color: Colors.primary, fontWeight: '600' }}>
              Detecting location...
            </Text>
            <Text style={{ fontSize: 13, color: Colors.textMuted }}> ▾</Text>
          </TouchableOpacity>
        </View>

        {/* ── Search Bar ── */}
        <TouchableOpacity
          onPress={() => router.push('/(patient)/search')}
          style={{ marginHorizontal: 20, marginBottom: 20 }}
          activeOpacity={0.8}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: Colors.card,
              borderRadius: 14,
              paddingHorizontal: 16,
              height: 52,
              borderWidth: 1.5,
              borderColor: Colors.border,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.04,
              shadowRadius: 6,
              elevation: 2,
            }}
          >
            <Text style={{ fontSize: 18, marginRight: 10, color: Colors.textMuted }}>🔍</Text>
            <Text style={{ flex: 1, fontSize: 15, color: Colors.textMuted }}>
              Search doctors, specialties...
            </Text>
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                backgroundColor: Colors.primary,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 16 }}>🎙️</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* ── Quick Actions ── */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            marginBottom: 24,
          }}
        >
          {QUICK_ACTIONS.map((action) => (
            <TouchableOpacity
              key={action.id}
              onPress={() => router.push(action.route as any)}
              style={{ alignItems: 'center', flex: 1 }}
              activeOpacity={0.75}
            >
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  backgroundColor: action.color,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 6,
                }}
              >
                <Text style={{ fontSize: 24 }}>{action.icon}</Text>
              </View>
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: '600',
                  color: Colors.textSub,
                  textAlign: 'center',
                }}
              >
                {action.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Live Queue Banner ── */}
        <TouchableOpacity
          style={{
            marginHorizontal: 20,
            marginBottom: 24,
            borderRadius: 16,
            overflow: 'hidden',
          }}
          activeOpacity={0.9}
        >
          <View
            style={{
              backgroundColor: Colors.primary,
              padding: 18,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View>
              <Text style={{ fontSize: 12, color: Colors.primaryLight, fontWeight: '500' }}>
                QUICKDOC LIVE QUEUE
              </Text>
              <Text style={{ fontSize: 18, fontWeight: '800', color: '#fff', marginTop: 4 }}>
                Know your wait time 📍
              </Text>
              <Text style={{ fontSize: 13, color: Colors.primaryLight, marginTop: 4 }}>
                Track queue before leaving home
              </Text>
            </View>
            <Text style={{ fontSize: 44 }}>⏱️</Text>
          </View>
        </TouchableOpacity>

        {/* ── Specialties ── */}
        <View style={{ marginBottom: 20 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 20,
              marginBottom: 12,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: '700', color: Colors.textMain }}>
              Find Specialist
            </Text>
            <TouchableOpacity onPress={() => router.push('/(patient)/search')}>
              <Text style={{ fontSize: 14, color: Colors.primary, fontWeight: '600' }}>See all →</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}
          >
            {SPECIALTIES.map((spec) => {
              const isSelected = selectedSpecialty === spec.id;
              return (
                <TouchableOpacity
                  key={spec.id}
                  onPress={() => setSelectedSpecialty(spec.id)}
                  style={{
                    alignItems: 'center',
                    paddingHorizontal: 14,
                    paddingVertical: 10,
                    borderRadius: 14,
                    backgroundColor: isSelected ? Colors.primary : Colors.card,
                    borderWidth: 1.5,
                    borderColor: isSelected ? Colors.primary : Colors.border,
                    minWidth: 72,
                  }}
                >
                  <Text style={{ fontSize: 22 }}>{spec.icon}</Text>
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: '600',
                      marginTop: 4,
                      color: isSelected ? '#fff' : Colors.textSub,
                    }}
                  >
                    {spec.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* ── Doctors Near You ── */}
        <View style={{ paddingHorizontal: 20 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 14,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: '700', color: Colors.textMain }}>
              Doctors Near You
            </Text>
            <TouchableOpacity onPress={() => router.push('/(patient)/search')}>
              <Text style={{ fontSize: 14, color: Colors.primary, fontWeight: '600' }}>See all →</Text>
            </TouchableOpacity>
          </View>

          {MOCK_DOCTORS.map((doctor) => (
            <DoctorCard
              key={doctor.id}
              doctor={doctor}
              onPress={() => router.push(`/(patient)/doctor/${doctor.id}` as any)}
            />
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}