import { View, Text, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/colors';
import { Doctor } from '../firebase/firestore';

interface Props {
  doctor: Doctor;
  onPress: () => void;
}

export default function DoctorCard({ doctor, onPress }: Props) {
  const avatar = doctor.gender === 'female' ? '👩‍⚕️' : '👨‍⚕️';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={{
        backgroundColor: Colors.card,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: Colors.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
        flexDirection: 'row',
        alignItems: 'flex-start',
      }}
    >
      <View
        style={{
          width: 60,
          height: 60,
          borderRadius: 14,
          backgroundColor: Colors.primaryLight,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 12,
        }}
      >
        <Text style={{ fontSize: 28 }}>{avatar}</Text>
      </View>

      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 15, fontWeight: '700', color: Colors.textMain }}>{doctor.name}</Text>
        <Text style={{ fontSize: 13, color: Colors.textSub, marginTop: 1 }}>{doctor.specialty}</Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5, gap: 12 }}>
          <Text style={{ fontSize: 12, color: Colors.textMuted }}>⭐ {doctor.rating.toFixed(1)} ({doctor.reviewCount})</Text>
          <Text style={{ fontSize: 12, color: Colors.textMuted }}>{doctor.experience}</Text>
          <Text style={{ fontSize: 12, fontWeight: '700', color: Colors.primary }}>₹{doctor.fee}</Text>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
          {/* Queue chip */}
          {!doctor.available ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F5F9', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 }}>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.offline, marginRight: 4 }} />
              <Text style={{ fontSize: 11, color: Colors.offline, fontWeight: '500' }}>Offline</Text>
            </View>
          ) : doctor.queueCount === 0 ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0FDF4', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 }}>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.available, marginRight: 4 }} />
              <Text style={{ fontSize: 11, color: Colors.available, fontWeight: '600' }}>Available</Text>
            </View>
          ) : (
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFBEB', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 }}>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.waiting, marginRight: 4 }} />
              <Text style={{ fontSize: 11, color: Colors.waiting, fontWeight: '600' }}>{doctor.queueCount} in queue</Text>
            </View>
          )}

          <TouchableOpacity
            onPress={onPress}
            style={{
              backgroundColor: doctor.available ? Colors.primary : Colors.border,
              paddingHorizontal: 16,
              paddingVertical: 7,
              borderRadius: 10,
            }}
          >
            <Text style={{ fontSize: 13, fontWeight: '700', color: doctor.available ? '#fff' : Colors.textMuted }}>
              {doctor.available ? `Book ₹${doctor.fee}` : 'Notify Me'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}