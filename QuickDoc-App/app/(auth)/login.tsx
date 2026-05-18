import { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { sendOTP } from '../../firebase/auth';
import { Colors } from '../../constants/colors';

export default function LoginScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const isValidPhone = phone.length === 10 && /^[6-9]\d{9}$/.test(phone);

  async function handleSendOTP() {
    if (!isValidPhone) {
      Alert.alert('Invalid Number', 'Please enter a valid 10-digit Indian mobile number.');
      return;
    }
    setLoading(true);
    try {
      const fullPhone = `+91${phone}`;
      await sendOTP(fullPhone); // stores confirmation in module memory
      router.push({
        pathname: '/(auth)/otp',
        params: { phone: fullPhone },
      });
    } catch (error: any) {
      Alert.alert('Error', error?.message ?? 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Top section — logo + illustration area */}
          <View
            style={{
              backgroundColor: Colors.primary50,
              paddingTop: 48,
              paddingBottom: 40,
              alignItems: 'center',
              borderBottomLeftRadius: 32,
              borderBottomRightRadius: 32,
            }}
          >
            {/* Logo */}
            <View
              style={{
                width: 72,
                height: 72,
                borderRadius: 20,
                backgroundColor: Colors.primary,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
                ...Colors,
              }}
              className="shadow-btn"
            >
              <Text style={{ fontSize: 36 }}>🩺</Text>
            </View>
            <Text
              style={{
                fontSize: 28,
                fontWeight: '800',
                color: Colors.textMain,
                letterSpacing: -0.5,
              }}
            >
              QuickDoc
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: Colors.textSub,
                marginTop: 6,
                textAlign: 'center',
                paddingHorizontal: 32,
              }}
            >
              Book doctors near you.{'\n'}Know your queue before you leave home.
            </Text>
          </View>

          {/* Form section */}
          <View style={{ paddingHorizontal: 24, paddingTop: 36 }}>
            <Text
              style={{ fontSize: 22, fontWeight: '700', color: Colors.textMain, marginBottom: 4 }}
            >
              Login / Sign Up
            </Text>
            <Text style={{ fontSize: 14, color: Colors.textSub, marginBottom: 28 }}>
              We'll send a 6-digit OTP to verify your number
            </Text>

            {/* Phone input */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: Colors.card,
                borderRadius: 14,
                borderWidth: 1.5,
                borderColor: phone.length > 0 ? Colors.primary : Colors.border,
                paddingHorizontal: 16,
                height: 56,
                marginBottom: 20,
              }}
            >
              {/* +91 prefix */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingRight: 12,
                  borderRightWidth: 1,
                  borderRightColor: Colors.border,
                  marginRight: 12,
                }}
              >
                <Text style={{ fontSize: 16, marginRight: 4 }}>🇮🇳</Text>
                <Text style={{ fontSize: 16, fontWeight: '600', color: Colors.textMain }}>
                  +91
                </Text>
              </View>

              <TextInput
                ref={inputRef}
                value={phone}
                onChangeText={(t) => setPhone(t.replace(/\D/g, '').slice(0, 10))}
                placeholder="Enter mobile number"
                placeholderTextColor={Colors.textMuted}
                keyboardType="phone-pad"
                style={{
                  flex: 1,
                  fontSize: 16,
                  color: Colors.textMain,
                  fontWeight: '500',
                  letterSpacing: 1,
                }}
                maxLength={10}
                returnKeyType="done"
                onSubmitEditing={handleSendOTP}
              />

              {/* Clear button */}
              {phone.length > 0 && (
                <TouchableOpacity onPress={() => setPhone('')} style={{ padding: 4 }}>
                  <Text style={{ fontSize: 18, color: Colors.textMuted }}>✕</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Phone validation hint */}
            {phone.length > 0 && !isValidPhone && (
              <Text style={{ fontSize: 12, color: Colors.emergency, marginTop: -14, marginBottom: 14, marginLeft: 4 }}>
                Enter a valid 10-digit number starting with 6, 7, 8, or 9
              </Text>
            )}

            {/* Send OTP Button */}
            <TouchableOpacity
              onPress={handleSendOTP}
              disabled={!isValidPhone || loading}
              style={{
                backgroundColor: isValidPhone ? Colors.primary : Colors.muted,
                borderRadius: 14,
                height: 54,
                alignItems: 'center',
                justifyContent: 'center',
                opacity: isValidPhone ? 1 : 0.6,
                ...(isValidPhone
                  ? {
                      shadowColor: Colors.primary,
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.3,
                      shadowRadius: 12,
                      elevation: 6,
                    }
                  : {}),
              }}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={{ fontSize: 16, fontWeight: '700', color: '#fff', letterSpacing: 0.3 }}>
                  Send OTP →
                </Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginVertical: 24,
              }}
            >
              <View style={{ flex: 1, height: 1, backgroundColor: Colors.border }} />
              <Text style={{ paddingHorizontal: 12, color: Colors.textMuted, fontSize: 13 }}>
                or continue as
              </Text>
              <View style={{ flex: 1, height: 1, backgroundColor: Colors.border }} />
            </View>

            {/* Guest option */}
            <TouchableOpacity
              style={{
                borderWidth: 1.5,
                borderColor: Colors.border,
                borderRadius: 14,
                height: 52,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: Colors.card,
              }}
            >
              <Text style={{ fontSize: 15, fontWeight: '600', color: Colors.textSub }}>
                Browse as Guest
              </Text>
            </TouchableOpacity>
          </View>

          {/* Terms */}
          <Text
            style={{
              textAlign: 'center',
              fontSize: 12,
              color: Colors.textMuted,
              paddingHorizontal: 32,
              paddingTop: 24,
              paddingBottom: 16,
              lineHeight: 18,
            }}
          >
            By continuing, you agree to our{' '}
            <Text style={{ color: Colors.primary }}>Terms of Service</Text> and{' '}
            <Text style={{ color: Colors.primary }}>Privacy Policy</Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}