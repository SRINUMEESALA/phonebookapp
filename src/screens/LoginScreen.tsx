import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { loginUser } from "../store/slices/authSlice";
import { COLORS, TYPOGRAPHY, SPACING } from "../constants";

const LoginScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleLogin = async () => {
    setLocalError("");

    if (!username.trim() || !password.trim()) {
      setLocalError("Please enter both username and password");
      triggerShake();
      return;
    }

    try {
      await dispatch(
        loginUser({ username: username.trim(), password: password.trim() })
      ).unwrap();
    } catch (error) {
      setLocalError(error as string);
      triggerShake();
    }
  };

  const handleUsernameChange = (text: string) => {
    setUsername(text);
    if (localError) setLocalError("");
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (localError) setLocalError("");
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <View style={styles.logo}>
                <Ionicons name="people" size={40} color="white" />
              </View>
            </View>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to your account</Text>
          </View>

          {/* Form Section */}
          <Animated.View
            style={[
              styles.formCard,
              { transform: [{ translateX: shakeAnimation }] },
            ]}
          >
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Username</Text>
              <View
                style={[
                  styles.inputWrapper,
                  localError && styles.inputWrapperError,
                ]}
              >
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={localError ? COLORS.ERROR : COLORS.TEXT_SECONDARY}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter username"
                  placeholderTextColor={COLORS.TEXT_SECONDARY}
                  value={username}
                  onChangeText={handleUsernameChange}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <View
                style={[
                  styles.inputWrapper,
                  localError && styles.inputWrapperError,
                ]}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={localError ? COLORS.ERROR : COLORS.TEXT_SECONDARY}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter password"
                  placeholderTextColor={COLORS.TEXT_SECONDARY}
                  value={password}
                  onChangeText={handlePasswordChange}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color={COLORS.TEXT_SECONDARY}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Ionicons
                    name="log-in-outline"
                    size={20}
                    color="white"
                    style={styles.buttonIcon}
                  />
                  <Text style={styles.buttonText}>Sign In</Text>
                </>
              )}
            </TouchableOpacity>
          </Animated.View>

          {/* Demo Credentials Section */}
          <View style={styles.credentialsCard}>
            <View style={styles.credentialsHeader}>
              <Ionicons
                name="information-circle"
                size={20}
                color={COLORS.PRIMARY}
              />
              <Text style={styles.credentialsTitle}>Demo Credentials</Text>
            </View>
            <View style={styles.credentialsContent}>
              <TouchableOpacity
                style={styles.credentialRow}
                onPress={() => setUsername("emilys")}
              >
                <Ionicons
                  name="person"
                  size={16}
                  color={COLORS.TEXT_SECONDARY}
                />
                <Text style={styles.credentialLabel}>Username:</Text>
                <Text style={styles.credentialValue}>emilys</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.credentialRow}
                onPress={() => setPassword("emilyspass")}
              >
                <Ionicons name="key" size={16} color={COLORS.TEXT_SECONDARY} />
                <Text style={styles.credentialLabel}>Password:</Text>
                <Text style={styles.credentialValue}>emilyspass</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: SPACING.MD,
  },
  header: {
    alignItems: "center",
    paddingVertical: SPACING.XL,
    marginBottom: SPACING.LG,
  },
  logoContainer: {
    marginBottom: SPACING.LG,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.SHADOW,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: TYPOGRAPHY.FONT_SIZES.LARGE,
    fontWeight: TYPOGRAPHY.FONT_WEIGHTS.BOLD,
    color: COLORS.TEXT_PRIMARY,
    textAlign: "center",
    marginBottom: SPACING.SM,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.FONT_SIZES.REGULAR,
    color: COLORS.TEXT_SECONDARY,
    textAlign: "center",
  },
  formCard: {
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderRadius: 16,
    padding: SPACING.LG,
    marginBottom: SPACING.LG,
    shadowColor: COLORS.SHADOW,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  inputContainer: {
    marginBottom: SPACING.LG,
  },
  label: {
    fontSize: TYPOGRAPHY.FONT_SIZES.SMALL,
    fontWeight: TYPOGRAPHY.FONT_WEIGHTS.SEMIBOLD,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.SM,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    paddingHorizontal: SPACING.MD,
  },
  inputWrapperError: {
    borderColor: COLORS.ERROR,
    backgroundColor: "#FEF2F2",
  },
  inputIcon: {
    marginRight: SPACING.SM,
  },
  input: {
    flex: 1,
    paddingVertical: SPACING.MD,
    fontSize: TYPOGRAPHY.FONT_SIZES.REGULAR,
    color: COLORS.TEXT_PRIMARY,
  },
  eyeIcon: {
    padding: SPACING.SM,
  },
  button: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.LG,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.SHADOW,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonIcon: {
    marginRight: SPACING.SM,
  },
  buttonText: {
    color: "white",
    fontSize: TYPOGRAPHY.FONT_SIZES.MEDIUM,
    fontWeight: TYPOGRAPHY.FONT_WEIGHTS.BOLD,
  },
  credentialsCard: {
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderRadius: 16,
    padding: SPACING.LG,
    marginBottom: SPACING.XL,
    shadowColor: COLORS.SHADOW,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  credentialsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.MD,
  },
  credentialsTitle: {
    fontSize: TYPOGRAPHY.FONT_SIZES.MEDIUM,
    fontWeight: TYPOGRAPHY.FONT_WEIGHTS.BOLD,
    color: COLORS.TEXT_PRIMARY,
    marginLeft: SPACING.SM,
  },
  credentialsContent: {
    gap: SPACING.SM,
  },
  credentialRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.SM,
    paddingHorizontal: SPACING.SM,
    borderRadius: 8,
    backgroundColor: "transparent",
  },
  credentialLabel: {
    fontSize: TYPOGRAPHY.FONT_SIZES.SMALL,
    color: COLORS.TEXT_SECONDARY,
    marginLeft: SPACING.SM,
    marginRight: SPACING.SM,
    minWidth: 80,
  },
  credentialValue: {
    fontSize: TYPOGRAPHY.FONT_SIZES.SMALL,
    fontWeight: TYPOGRAPHY.FONT_WEIGHTS.SEMIBOLD,
    color: COLORS.PRIMARY,
    backgroundColor: COLORS.BACKGROUND,
    paddingHorizontal: SPACING.SM,
    paddingVertical: SPACING.XS,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
});

export default LoginScreen;
