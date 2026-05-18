import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { verifyOTP, sendOTP, getPendingConfirmation } from '../../firebase/auth';
import { useAuthStore } from '../../store/authStore';
import { Colors } from '../../constants/colors';

const OTP_LENGTH = 6;

export default function OTPScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ phone: string }>();
  const { setUser } = useAuthStore();

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  // Initialized from module memory — set by sendOTP() in login screen
  const [confirmation, setConfirmation] = useState<{ confirm: (code: string) => Promise<any> } | null>(
    () => getPendingConfirmation()
  );

  const inputRefs = useRef<(TextInput | null)[]>(Array(OTP_LENGTH).fill(null));

  // Resend countdown
  useEffect(() => {
    if (resendTimer <= 0) return;
    const timer = setTimeout(() => setResendTimer((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendTimer]);

  function handleOtpChange(value: string, index: number) {
    const digit = value.replace(/\D/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyPress(key: string, index: number) {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = '';
      setOtp(newOtp);
      inputRefs.current[index - 1]?.focus();
    }
  }

  async function handleVerify() {
    const code = otp.join('');
    if (code.length !== OTP_LENGTH) {
      Alert.alert('Enter OTP', 'Please enter the complete 6-digit OTP.');
      return;
    }
    if (!confirmation) {
      Alert.alert('Error', 'Session expired. Please go back and resend OTP.');
      return;
    }
    setLoading(true);
    try {
      const credential = await verifyOTP(confirmation, code);
      const firebaseUser = credential.user;
      setUser({
        uid: firebaseUser.uid,
        phoneNumber: firebaseUser.phoneNumber,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
      });
      router.replace('/(patient)/home');
    } catch (error: any) {
      Alert.alert('Invalid OTP', 'The OTP you entered is incorrect. Please try again.');
      setOtp(Array(OTP_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (resendTimer > 0 || !params.phone) return;
    try {
      const newConfirmation = await sendOTP(params.phone); // also updates module memory
      setConfirmation(newConfirmation);
      setOtp(Array(OTP_LENGTH).fill(''));
      setResendTimer(30);
      inputRefs.current[0]?.focus();
    } catch (error: any) {
      Alert.alert('Error', 'Could not resend OTP. Please try again.');
    }
  }

  const isComplete = otp.every((d) => d !== '');
  const maskedPhone = params.phone
    ? `${params.phone.slice(0, 3)} XXXXX ${params.phone.slice(-2)}`
    : '';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* Back button */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ padding: 16, paddingBottom: 8 }}
        >
          <Text style={{ fontSize: 24, color: Colors.textMain }}>←</Text>
        </TouchableOpacity>

        <View style={{ paddingHorizontal: 24, paddingTop: 20 }}>
          {/* Header */}
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              backgroundColor: Colors.primaryLight,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 20,
            }}
          >
            <Text style={{ fontSize: 30 }}>📱</Text>
          </View>

          <Text style={{ fontSize: 24, fontWeight: '700', color: Colors.textMain, marginBottom: 6 }}>
            Verify OTP
          </Text>
          <Text style={{ fontSize: 14, color: Colors.textSub, lineHeight: 20, marginBottom: 36 }}>
            Enter the 6-digit code sent to{'\n'}
            <Text style={{ fontWeight: '600', color: Colors.textMain }}>{maskedPhone}</Text>
          </Text>

          {/* OTP input boxes */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 36 }}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => { inputRefs.current[index] = ref; }}
                value={digit}
                onChangeText={(v) => handleOtpChange(v, index)}
                onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                keyboardType="number-pad"
                maxLength={1}
                textAlign="center"
                style={{
                  width: 48,
                  height: 56,
                  borderRadius: 12,
                  borderWidth: 2,
                  borderColor: digit ? Colors.primary : Colors.border,
                  backgroundColor: digit ? Colors.primaryLight : Colors.card,
                  fontSize: 22,
                  fontWeight: '700',
                  color: Colors.textMain,
                }}
                autoFocus={index === 0}
              />
            ))}
          </View>

          {/* Verify button */}
          <TouchableOpacity
            onPress={handleVerify}
            disabled={!isComplete || loading}
            style={{
              backgroundColor: isComplete ? Colors.primary : Colors.border,
              borderRadius: 14,
              height: 54,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 24,
              ...(isComplete
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
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#fff' }}>
                Verify & Continue
              </Text>
            )}
          </TouchableOpacity>

          {/* Resend OTP */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 14, color: Colors.textSub }}>Didn't receive the OTP? </Text>
            <TouchableOpacity onPress={handleResend} disabled={resendTimer > 0}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: resendTimer > 0 ? Colors.textMuted : Colors.primary,
                }}
              >
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}