import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/authStore';
import { updateUser } from '../../firebase/firestore';
import { Colors } from '../../constants/colors';

const GENDERS = [
  { id: 'male', label: 'Male', icon: '👨' },
  { id: 'female', label: 'Female', icon: '👩' },
  { id: 'other', label: 'Other', icon: '🧑' },
] as const;

export default function OnboardingScreen() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other' | null>(null);
  const [loading, setLoading] = useState(false);

  const isValid =
    name.trim().length >= 2 &&
    Number(age) >= 1 &&
    Number(age) <= 120 &&
    gender !== null;

  async function handleContinue() {
    if (!user) return;
    setLoading(true);
    try {
      await updateUser(user.uid, {
        displayName: name.trim(),
        age: Number(age),
        gender,
        profileComplete: true,
      });
      setUser({ ...user, displayName: name.trim(), profileComplete: true });
      router.replace('/(patient)/home');
    } catch (err: any) {
      Alert.alert('Error', err?.message ?? 'Failed to save profile. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingVertical: 32 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={{ marginBottom: 36 }}>
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 20,
              backgroundColor: Colors.primaryLight,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 20,
            }}
          >
            <Text style={{ fontSize: 30 }}>👋</Text>
          </View>
          <Text style={{ fontSize: 26, fontWeight: '800', color: Colors.textMain }}>
            Welcome to QuickDoc
          </Text>
          <Text style={{ fontSize: 15, color: Colors.textSub, marginTop: 6, lineHeight: 22 }}>
            Just 3 quick details to personalise your experience
          </Text>
        </View>

        {/* Name */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: Colors.textMain, marginBottom: 8 }}>
            Your Name
          </Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="e.g. Ajay Kumar"
            placeholderTextColor={Colors.textMuted}
            autoCapitalize="words"
            style={{
              backgroundColor: Colors.card,
              borderRadius: 14,
              paddingHorizontal: 16,
              paddingVertical: 14,
              fontSize: 16,
              color: Colors.textMain,
              borderWidth: 1.5,
              borderColor: name.length >= 2 ? Colors.primary : Colors.border,
            }}
          />
        </View>

        {/* Age */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: Colors.textMain, marginBottom: 8 }}>
            Your Age
          </Text>
          <TextInput
            value={age}
            onChangeText={(v) => setAge(v.replace(/\D/g, ''))}
            placeholder="e.g. 25"
            placeholderTextColor={Colors.textMuted}
            keyboardType="number-pad"
            maxLength={3}
            style={{
              backgroundColor: Colors.card,
              borderRadius: 14,
              paddingHorizontal: 16,
              paddingVertical: 14,
              fontSize: 16,
              color: Colors.textMain,
              borderWidth: 1.5,
              borderColor:
                age.length > 0 && Number(age) >= 1 && Number(age) <= 120
                  ? Colors.primary
                  : Colors.border,
            }}
          />
        </View>

        {/* Gender */}
        <View style={{ marginBottom: 40 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: Colors.textMain, marginBottom: 12 }}>
            Gender
          </Text>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            {GENDERS.map((g) => {
              const isSelected = gender === g.id;
              return (
                <TouchableOpacity
                  key={g.id}
                  onPress={() => setGender(g.id)}
                  style={{
                    flex: 1,
                    paddingVertical: 16,
                    borderRadius: 16,
                    alignItems: 'center',
                    backgroundColor: isSelected ? Colors.primary : Colors.card,
                    borderWidth: 2,
                    borderColor: isSelected ? Colors.primary : Colors.border,
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={{ fontSize: 24, marginBottom: 4 }}>{g.icon}</Text>
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: '600',
                      color: isSelected ? '#fff' : Colors.textSub,
                    }}
                  >
                    {g.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Continue button */}
        <TouchableOpacity
          onPress={handleContinue}
          disabled={!isValid || loading}
          style={{
            backgroundColor: isValid ? Colors.primary : Colors.border,
            borderRadius: 16,
            paddingVertical: 18,
            alignItems: 'center',
          }}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ fontSize: 17, fontWeight: '700', color: '#fff' }}>
              Continue →
            </Text>
          )}
        </TouchableOpacity>

        {/* Skip */}
        <TouchableOpacity
          onPress={() => router.replace('/(patient)/home')}
          style={{ marginTop: 16, alignItems: 'center', paddingVertical: 8 }}
        >
          <Text style={{ fontSize: 14, color: Colors.textMuted }}>
            Skip for now
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
