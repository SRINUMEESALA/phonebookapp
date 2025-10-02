import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { getProfile, logoutUser } from "../store/slices/authSlice";
import { COLORS, TYPOGRAPHY, SPACING } from "../constants";

const ProfileScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading } = useSelector((state: RootState) => state.auth);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (!user) {
      dispatch(getProfile());
    }
    setImageError(false);
  }, [dispatch, user]);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => dispatch(logoutUser()),
      },
    ]);
  };

  if (loading && !user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load profile</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => dispatch(getProfile())}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            {user.image && user.image.trim() !== "" && !imageError ? (
              <Image
                source={{ uri: user.image }}
                style={styles.avatar}
                onError={() => setImageError(true)}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>
                  {user.firstName.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            <TouchableOpacity style={styles.editAvatarButton}>
              <Ionicons name="camera" size={16} color="white" />
            </TouchableOpacity>
          </View>
          <Text style={styles.name}>
            {user.firstName} {user.lastName}
          </Text>
          <Text style={styles.username}>@{user.username}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="mail" size={20} color={COLORS.PRIMARY} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{user.email}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="person" size={20} color={COLORS.PRIMARY} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Gender</Text>
                <Text style={styles.infoValue}>{user.gender}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Settings</Text>

          <View style={styles.settingsCard}>
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingIconContainer}>
                <Ionicons name="create" size={20} color={COLORS.PRIMARY} />
              </View>
              <Text style={styles.settingText}>Edit Profile</Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={COLORS.TEXT_SECONDARY}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingIconContainer}>
                <Ionicons
                  name="shield-checkmark"
                  size={20}
                  color={COLORS.PRIMARY}
                />
              </View>
              <Text style={styles.settingText}>Privacy Settings</Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={COLORS.TEXT_SECONDARY}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingIconContainer}>
                <Ionicons
                  name="notifications"
                  size={20}
                  color={COLORS.PRIMARY}
                />
              </View>
              <Text style={styles.settingText}>Notifications</Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={COLORS.TEXT_SECONDARY}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>

          <View style={styles.settingsCard}>
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingIconContainer}>
                <Ionicons name="help-circle" size={20} color={COLORS.PRIMARY} />
              </View>
              <Text style={styles.settingText}>Help Center</Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={COLORS.TEXT_SECONDARY}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingIconContainer}>
                <Ionicons name="chatbubble" size={20} color={COLORS.PRIMARY} />
              </View>
              <Text style={styles.settingText}>Contact Support</Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={COLORS.TEXT_SECONDARY}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingIconContainer}>
                <Ionicons
                  name="information-circle"
                  size={20}
                  color={COLORS.PRIMARY}
                />
              </View>
              <Text style={styles.settingText}>About</Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={COLORS.TEXT_SECONDARY}
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons
            name="log-out"
            size={20}
            color="white"
            style={styles.logoutIcon}
          />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Address Book App v1.0.0</Text>
        </View>
      </ScrollView>

      {/* Floating Action Buttons */}
      <View style={styles.fabContainer}>
        <TouchableOpacity
          style={styles.fab}
          onPress={() => dispatch(getProfile())}
        >
          <Ionicons name="refresh" size={20} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.fab, styles.fabSecondary]}>
          <Ionicons
            name="ellipsis-horizontal"
            size={20}
            color={COLORS.PRIMARY}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.XL,
  },
  loadingText: {
    fontSize: TYPOGRAPHY.FONT_SIZES.REGULAR,
    color: COLORS.TEXT_SECONDARY,
    marginTop: SPACING.MD,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.XL,
  },
  errorText: {
    fontSize: TYPOGRAPHY.FONT_SIZES.REGULAR,
    color: COLORS.ERROR,
    marginBottom: SPACING.MD,
  },
  retryButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    borderRadius: SPACING.SM,
  },
  retryButtonText: {
    color: "white",
    fontSize: TYPOGRAPHY.FONT_SIZES.REGULAR,
    fontWeight: TYPOGRAPHY.FONT_WEIGHTS.SEMIBOLD,
  },
  header: {
    backgroundColor: COLORS.CARD_BACKGROUND,
    alignItems: "center",
    paddingVertical: SPACING.XL,
    paddingHorizontal: SPACING.MD,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
    shadowColor: COLORS.SHADOW,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: SPACING.MD,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: COLORS.PRIMARY,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: COLORS.PRIMARY,
  },
  avatarText: {
    color: "white",
    fontSize: TYPOGRAPHY.FONT_SIZES.LARGE,
    fontWeight: TYPOGRAPHY.FONT_WEIGHTS.BOLD,
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.CARD_BACKGROUND,
  },
  name: {
    fontSize: TYPOGRAPHY.FONT_SIZES.LARGE,
    fontWeight: TYPOGRAPHY.FONT_WEIGHTS.BOLD,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.XS,
  },
  username: {
    fontSize: TYPOGRAPHY.FONT_SIZES.REGULAR,
    color: COLORS.TEXT_SECONDARY,
  },
  section: {
    marginTop: SPACING.MD,
    paddingHorizontal: SPACING.MD,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.FONT_SIZES.MEDIUM,
    fontWeight: TYPOGRAPHY.FONT_WEIGHTS.BOLD,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.MD,
  },
  infoCard: {
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderRadius: 12,
    padding: SPACING.MD,
    shadowColor: COLORS.SHADOW,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.SM,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.BACKGROUND,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.MD,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: TYPOGRAPHY.FONT_SIZES.SMALL,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: TYPOGRAPHY.FONT_SIZES.REGULAR,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: TYPOGRAPHY.FONT_WEIGHTS.SEMIBOLD,
  },
  settingsCard: {
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderRadius: 12,
    shadowColor: COLORS.SHADOW,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.MD,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.BACKGROUND,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.MD,
  },
  settingText: {
    flex: 1,
    fontSize: TYPOGRAPHY.FONT_SIZES.REGULAR,
    color: COLORS.TEXT_PRIMARY,
  },
  logoutButton: {
    backgroundColor: COLORS.ERROR,
    margin: SPACING.MD,
    padding: SPACING.MD,
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
  logoutIcon: {
    marginRight: SPACING.SM,
  },
  logoutButtonText: {
    color: "white",
    fontSize: TYPOGRAPHY.FONT_SIZES.MEDIUM,
    fontWeight: TYPOGRAPHY.FONT_WEIGHTS.BOLD,
  },
  footer: {
    alignItems: "center",
    padding: SPACING.XL,
  },
  footerText: {
    fontSize: TYPOGRAPHY.FONT_SIZES.SMALL,
    color: COLORS.TEXT_SECONDARY,
  },
  fabContainer: {
    position: "absolute",
    right: SPACING.MD,
    bottom: 100,
    alignItems: "center",
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.SM,
    shadowColor: COLORS.SHADOW,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabSecondary: {
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
});

export default ProfileScreen;
