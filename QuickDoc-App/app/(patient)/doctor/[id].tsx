import { useState, useEffect } from 'react';
import { ScrollView, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors } from '../../../constants/colors';
import { getDoctor, Doctor } from '../../../firebase/firestore';

const STATIC_REVIEWS = [
  { id: '1', name: 'Rohit K.', rating: 5, text: 'Very thorough doctor, explained everything clearly. Queue system is great!', date: '2 days ago' },
  { id: '2', name: 'Sana M.', rating: 5, text: 'Best doctor in the area. Waited only 10 mins thanks to QuickDoc queue.', date: '1 week ago' },
  { id: '3', name: 'Anil S.', rating: 4, text: 'Good doctor, a bit rushed but very knowledgeable.', date: '2 weeks ago' },
];

export default function DoctorDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) getDoctor(id).then((d) => { setDoctor(d); setLoading(false); });
  }, [id]);

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
        <Text style={{ fontSize: 18, fontWeight: '700', color: Colors.textMain }}>Doctor Profile</Text>
        <View style={{ flex: 1 }} />
        <TouchableOpacity style={{ padding: 4 }}>
          <Text style={{ fontSize: 22 }}>♡</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={Colors.primary} size="large" />
        </View>
      ) : !doctor ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 16, color: Colors.textSub }}>Doctor not found.</Text>
        </View>
      ) : (
        <>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
            {/* Doctor Card */}
            <View style={{ backgroundColor: Colors.card, margin: 16, borderRadius: 20, padding: 20, elevation: 4 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 80, height: 80, borderRadius: 20, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginRight: 16, borderWidth: 2, borderColor: Colors.primary }}>
                  <Text style={{ fontSize: 40 }}>{doctor.gender === 'female' ? '👩‍⚕️' : '👨‍⚕️'}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 18, fontWeight: '800', color: Colors.textMain }}>{doctor.name}</Text>
                    {doctor.verified && <Text style={{ fontSize: 16, marginLeft: 6 }}>✅</Text>}
                  </View>
                  <Text style={{ fontSize: 14, color: Colors.primary, fontWeight: '600', marginTop: 2 }}>{doctor.specialty}</Text>
                  <Text style={{ fontSize: 12, color: Colors.textSub, marginTop: 2 }}>{doctor.qualification}</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', marginTop: 20, paddingTop: 16, borderTopWidth: 1, borderTopColor: Colors.divider }}>
                {[
                  { label: 'Experience', value: doctor.experience },
                  { label: 'Rating', value: `${doctor.rating} ⭐` },
                  { label: 'Reviews', value: `${doctor.reviewCount}` },
                ].map((stat, idx) => (
                  <View key={idx} style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, fontWeight: '800', color: Colors.textMain }}>{stat.value}</Text>
                    <Text style={{ fontSize: 11, color: Colors.textSub, marginTop: 2 }}>{stat.label}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Live Queue */}
            <View style={{ marginHorizontal: 16, marginBottom: 16, padding: 16, borderRadius: 16, backgroundColor: doctor.available ? Colors.primary50 : '#F1F5F9', borderWidth: 1.5, borderColor: doctor.available ? Colors.primaryLight : Colors.border }}>
              <Text style={{ fontSize: 13, color: Colors.textSub, fontWeight: '500' }}>⏱️ LIVE QUEUE STATUS</Text>
              <Text style={{ fontSize: 22, fontWeight: '800', color: Colors.textMain, marginTop: 4 }}>
                {!doctor.available ? 'Currently Unavailable' : doctor.queueCount === 0 ? 'No waiting — Book now!' : `${doctor.queueCount} patients ahead`}
              </Text>
              {doctor.available && (
                <Text style={{ fontSize: 13, color: Colors.textSub, marginTop: 2 }}>Est. wait: ~{doctor.queueCount * 10} minutes</Text>
              )}
            </View>

            {/* Clinic Info */}
            <View style={{ marginHorizontal: 16, marginBottom: 16, padding: 16, backgroundColor: Colors.card, borderRadius: 16, borderWidth: 1, borderColor: Colors.border }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: Colors.textMain, marginBottom: 12 }}>Clinic Info</Text>
              {[
                { icon: '📍', label: `${doctor.clinicName}, ${doctor.clinicAddress}` },
                { icon: '🕐', label: doctor.timings },
                { icon: '🌐', label: doctor.languages.join(', ') },
              ].map((item, idx) => (
                <View key={idx} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 }}>
                  <Text style={{ fontSize: 16, marginRight: 10, marginTop: 1 }}>{item.icon}</Text>
                  <Text style={{ fontSize: 14, color: Colors.textSub, flex: 1, lineHeight: 20 }}>{item.label}</Text>
                </View>
              ))}
            </View>

            {/* About */}
            <View style={{ marginHorizontal: 16, marginBottom: 16 }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: Colors.textMain, marginBottom: 8 }}>About</Text>
              <Text style={{ fontSize: 14, color: Colors.textSub, lineHeight: 22 }}>{doctor.about}</Text>
            </View>

            {/* Services */}
            <View style={{ marginHorizontal: 16, marginBottom: 16 }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: Colors.textMain, marginBottom: 10 }}>Services</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {doctor.services.map((s, idx) => (
                  <View key={idx} style={{ paddingHorizontal: 12, paddingVertical: 6, backgroundColor: Colors.primaryLight, borderRadius: 999 }}>
                    <Text style={{ fontSize: 13, color: Colors.primaryDark, fontWeight: '500' }}>{s}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Reviews */}
            <View style={{ marginHorizontal: 16, marginBottom: 16 }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: Colors.textMain, marginBottom: 12 }}>Patient Reviews</Text>
              {STATIC_REVIEWS.map((review) => (
                <View key={review.id} style={{ backgroundColor: Colors.card, borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: Colors.border }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <Text style={{ fontSize: 14, fontWeight: '700', color: Colors.textMain }}>{review.name}</Text>
                    <Text style={{ fontSize: 11, color: Colors.textMuted }}>{review.date}</Text>
                  </View>
                  <Text style={{ fontSize: 13, color: Colors.textSub, lineHeight: 18 }}>{review.text}</Text>
                </View>
              ))}
            </View>
          </ScrollView>

          {/* Fixed CTA */}
          <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: Colors.card, paddingHorizontal: 20, paddingVertical: 16, borderTopWidth: 1, borderTopColor: Colors.border, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View>
              <Text style={{ fontSize: 12, color: Colors.textSub }}>Consultation Fee</Text>
              <Text style={{ fontSize: 20, fontWeight: '800', color: Colors.textMain }}>
                ₹{doctor.fee}
                <Text style={{ fontSize: 13, fontWeight: '400', color: Colors.textSub }}> + ₹12 booking</Text>
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push(`/(patient)/book/${id}` as any)}
              disabled={!doctor.available}
              style={{ flex: 1, backgroundColor: doctor.available ? Colors.primary : Colors.border, borderRadius: 14, height: 52, alignItems: 'center', justifyContent: 'center', elevation: 6 }}
            >
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#fff' }}>
                {doctor.available ? 'Book Appointment' : 'Currently Unavailable'}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const MOCK_DOCTOR = {
  id: '1',
  name: 'Dr. Priya Sharma',
  specialty: 'Cardiologist',
  qualification: 'MD, DM Cardiology — AIIMS Delhi',
  experience: '12 years',
  rating: 4.9,
  reviews: 312,
  fee: 500,
  bookingFee: 12,
  queueCount: 3,
  available: true,
  clinic: 'HeartCare Clinic, Sector 18, Noida',
  about:
    'Dr. Priya Sharma is a senior Cardiologist with 12+ years of experience. She specializes in interventional cardiology and heart failure management. She has treated 5000+ patients and is known for her patient-first approach.',
  services: ['ECG', 'Echo', 'Stress Test', 'Heart Failure', 'Hypertension', 'Chest Pain'],
  timings: 'Mon–Sat: 10:00 AM – 2:00 PM, 5:00 PM – 8:00 PM',
  languages: 'Hindi, English',
  verified: true,
};

const REVIEWS = [
  { id: '1', name: 'Rohit K.', rating: 5, text: 'Very thorough doctor, explained everything clearly. Queue system is great!', date: '2 days ago' },
  { id: '2', name: 'Sana M.', rating: 5, text: 'Best cardiologist in the area. Waited only 10 mins thanks to QuickDoc queue.', date: '1 week ago' },
  { id: '3', name: 'Anil S.', rating: 4, text: 'Good doctor, a bit rushed but very knowledgeable.', date: '2 weeks ago' },
];

export default function DoctorDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) getDoctor(id).then((d) => { setDoctor(d); setLoading(false); });
  }, [id]);

  const d = doctor;
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
        <Text style={{ fontSize: 18, fontWeight: '700', color: Colors.textMain }}>Doctor Profile</Text>
        <View style={{ flex: 1 }} />
        <TouchableOpacity style={{ padding: 4 }}>
          <Text style={{ fontSize: 22 }}>♡</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>

        {/* ── Doctor Card ── */}
        <View
          style={{
            backgroundColor: Colors.card,
            margin: 16,
            borderRadius: 20,
            padding: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.07,
            shadowRadius: 10,
            elevation: 4,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 20,
                backgroundColor: Colors.primaryLight,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 16,
                borderWidth: 2,
                borderColor: Colors.primary,
              }}
            >
              <Text style={{ fontSize: 40 }}>👩‍⚕️</Text>
            </View>

            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 18, fontWeight: '800', color: Colors.textMain }}>{MOCK_DOCTOR.name}</Text>
                {MOCK_DOCTOR.verified && (
                  <Text style={{ fontSize: 16, marginLeft: 6 }}>✅</Text>
                )}
              </View>
              <Text style={{ fontSize: 14, color: Colors.primary, fontWeight: '600', marginTop: 2 }}>
                {MOCK_DOCTOR.specialty}
              </Text>
              <Text style={{ fontSize: 12, color: Colors.textSub, marginTop: 2 }}>
                {MOCK_DOCTOR.qualification}
              </Text>
            </View>
          </View>

          {/* Stats row */}
          <View
            style={{
              flexDirection: 'row',
              marginTop: 20,
              paddingTop: 16,
              borderTopWidth: 1,
              borderTopColor: Colors.divider,
            }}
          >
            {[
              { label: 'Experience', value: MOCK_DOCTOR.experience, icon: '🎓' },
              { label: 'Rating', value: `${MOCK_DOCTOR.rating} ⭐`, icon: '' },
              { label: 'Reviews', value: `${MOCK_DOCTOR.reviews}`, icon: '💬' },
            ].map((stat, idx) => (
              <View key={idx} style={{ flex: 1, alignItems: 'center' }}>
                <Text style={{ fontSize: 16, fontWeight: '800', color: Colors.textMain }}>{stat.value}</Text>
                <Text style={{ fontSize: 11, color: Colors.textSub, marginTop: 2 }}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Live Queue Status ── */}
        <View
          style={{
            marginHorizontal: 16,
            marginBottom: 16,
            padding: 16,
            borderRadius: 16,
            backgroundColor: MOCK_DOCTOR.available ? Colors.primary50 : '#F1F5F9',
            borderWidth: 1.5,
            borderColor: MOCK_DOCTOR.available ? Colors.primaryLight : Colors.border,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View>
              <Text style={{ fontSize: 13, color: Colors.textSub, fontWeight: '500' }}>
                ⏱️ LIVE QUEUE STATUS
              </Text>
              <Text style={{ fontSize: 22, fontWeight: '800', color: Colors.textMain, marginTop: 4 }}>
                {MOCK_DOCTOR.queueCount === 0
                  ? 'No waiting — Book now!'
                  : `${MOCK_DOCTOR.queueCount} patients ahead`}
              </Text>
              <Text style={{ fontSize: 13, color: Colors.textSub, marginTop: 2 }}>
                Est. wait: ~{MOCK_DOCTOR.queueCount * 10} minutes
              </Text>
            </View>
            <View
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                backgroundColor: MOCK_DOCTOR.available ? Colors.primary : Colors.border,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 24 }}>⏱️</Text>
            </View>
          </View>
        </View>

        {/* ── Clinic Info ── */}
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
          <Text style={{ fontSize: 16, fontWeight: '700', color: Colors.textMain, marginBottom: 12 }}>
            Clinic Info
          </Text>
          {[
            { icon: '📍', label: MOCK_DOCTOR.clinic },
            { icon: '🕐', label: MOCK_DOCTOR.timings },
            { icon: '🌐', label: MOCK_DOCTOR.languages },
          ].map((item, idx) => (
            <View key={idx} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 }}>
              <Text style={{ fontSize: 16, marginRight: 10, marginTop: 1 }}>{item.icon}</Text>
              <Text style={{ fontSize: 14, color: Colors.textSub, flex: 1, lineHeight: 20 }}>{item.label}</Text>
            </View>
          ))}
        </View>

        {/* ── About ── */}
        <View style={{ marginHorizontal: 16, marginBottom: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: Colors.textMain, marginBottom: 8 }}>About</Text>
          <Text style={{ fontSize: 14, color: Colors.textSub, lineHeight: 22 }}>{MOCK_DOCTOR.about}</Text>
        </View>

        {/* ── Services ── */}
        <View style={{ marginHorizontal: 16, marginBottom: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: Colors.textMain, marginBottom: 10 }}>Services</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {MOCK_DOCTOR.services.map((s, idx) => (
              <View
                key={idx}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  backgroundColor: Colors.primaryLight,
                  borderRadius: 999,
                }}
              >
                <Text style={{ fontSize: 13, color: Colors.primaryDark, fontWeight: '500' }}>{s}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Reviews ── */}
        <View style={{ marginHorizontal: 16, marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: Colors.textMain }}>Patient Reviews</Text>
            <Text style={{ fontSize: 13, color: Colors.primary, fontWeight: '600' }}>See all</Text>
          </View>
          {REVIEWS.map((review) => (
            <View
              key={review.id}
              style={{
                backgroundColor: Colors.card,
                borderRadius: 14,
                padding: 14,
                marginBottom: 10,
                borderWidth: 1,
                borderColor: Colors.border,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: Colors.textMain }}>{review.name}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ fontSize: 12, color: Colors.waiting, marginRight: 4 }}>
                    {'⭐'.repeat(review.rating)}
                  </Text>
                  <Text style={{ fontSize: 11, color: Colors.textMuted }}>{review.date}</Text>
                </View>
              </View>
              <Text style={{ fontSize: 13, color: Colors.textSub, lineHeight: 18 }}>{review.text}</Text>
            </View>
          ))}
        </View>

      </ScrollView>

      {/* ── Fixed bottom CTA ── */}
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
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <View>
          <Text style={{ fontSize: 12, color: Colors.textSub }}>Consultation Fee</Text>
          <Text style={{ fontSize: 20, fontWeight: '800', color: Colors.textMain }}>
            ₹{MOCK_DOCTOR.fee}
            <Text style={{ fontSize: 13, fontWeight: '400', color: Colors.textSub }}> + ₹12 booking</Text>
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push(`/(patient)/book/${id}` as any)}
          disabled={!MOCK_DOCTOR.available}
          style={{
            flex: 1,
            backgroundColor: MOCK_DOCTOR.available ? Colors.primary : Colors.border,
            borderRadius: 14,
            height: 52,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: Colors.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: 6,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#fff' }}>
            {MOCK_DOCTOR.available ? 'Book Appointment' : 'Currently Unavailable'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}