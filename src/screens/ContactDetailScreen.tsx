import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Linking,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { User } from "../types";
import {
  addToFavorites,
  removeFromFavorites,
} from "../store/slices/favoritesSlice";
import { COLORS, TYPOGRAPHY, SPACING } from "../constants";

interface ContactDetailScreenProps {
  route: {
    params: {
      user: User;
    };
  };
  navigation: any;
}

const ContactDetailScreen: React.FC<ContactDetailScreenProps> = ({
  route,
  navigation,
}) => {
  const { user } = route.params;
  const dispatch = useDispatch<AppDispatch>();
  const favoriteUserIds = useSelector(
    (state: RootState) => state.favorites.favoriteUserIds
  );

  const isFavorite = favoriteUserIds.includes(user.id);

  const handleFavoritePress = async () => {
    try {
      if (isFavorite) {
        await dispatch(removeFromFavorites(user.id)).unwrap();
      } else {
        await dispatch(addToFavorites(user.id)).unwrap();
      }
    } catch (error) {
      Alert.alert("Error", error as string);
    }
  };

  const handleCall = () => {
    if (Platform.OS === "web") {
      Alert.alert("Call", `Would call: ${user.phone}`);
    } else {
      Linking.openURL(`tel:${user.phone}`);
    }
  };

  const handleMessage = () => {
    if (Platform.OS === "web") {
      Alert.alert("Message", `Would send SMS to: ${user.phone}`);
    } else {
      Linking.openURL(`sms:${user.phone}`);
    }
  };

  const handleEmail = () => {
    if (Platform.OS === "web") {
      Alert.alert("Email", `Would open email to: ${user.email}`);
    } else {
      Linking.openURL(`mailto:${user.email}`);
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      "#FF6B6B",
      "#4ECDC4",
      "#45B7D1",
      "#96CEB4",
      "#FFEAA7",
      "#DDA0DD",
      "#98D8C8",
      "#F7DC6F",
      "#BB8FCE",
      "#85C1E9",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.TEXT_PRIMARY} />
        </TouchableOpacity>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleFavoritePress}
          >
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={24}
              color={isFavorite ? COLORS.ERROR : COLORS.TEXT_PRIMARY}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons
              name="create-outline"
              size={24}
              color={COLORS.TEXT_PRIMARY}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons
              name="ellipsis-horizontal"
              size={24}
              color={COLORS.TEXT_PRIMARY}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            {user.image ? (
              <Image source={{ uri: user.image }} style={styles.avatar} />
            ) : (
              <View
                style={[
                  styles.avatarPlaceholder,
                  { backgroundColor: getAvatarColor(user.firstName) },
                ]}
              >
                <Text style={styles.avatarText}>
                  {getInitials(user.firstName, user.lastName)}
                </Text>
              </View>
            )}
          </View>

          <Text style={styles.contactName}>
            {user.firstName} {user.lastName}
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButtonLarge}
            onPress={handleCall}
          >
            <View style={styles.actionIconContainer}>
              <Ionicons name="call" size={24} color="white" />
            </View>
            <Text style={styles.actionButtonText}>Call</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButtonLarge}
            onPress={handleMessage}
          >
            <View style={styles.actionIconContainer}>
              <Ionicons name="chatbubble" size={24} color="white" />
            </View>
            <Text style={styles.actionButtonText}>Message</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButtonLarge}>
            <View style={styles.actionIconContainer}>
              <Ionicons name="videocam" size={24} color="white" />
            </View>
            <Text style={styles.actionButtonText}>Video</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButtonLarge}
            onPress={handleEmail}
          >
            <View style={styles.actionIconContainer}>
              <Ionicons name="mail" size={24} color="white" />
            </View>
            <Text style={styles.actionButtonText}>Email</Text>
          </TouchableOpacity>
        </View>

        {/* Contact Information */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Contact Information</Text>

          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <Ionicons name="call" size={20} color={COLORS.PRIMARY} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>{user.phone}</Text>
            </View>
            <TouchableOpacity onPress={handleCall}>
              <Ionicons
                name="videocam-outline"
                size={20}
                color={COLORS.TEXT_SECONDARY}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <Ionicons name="mail" size={20} color={COLORS.PRIMARY} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{user.email}</Text>
            </View>
            <TouchableOpacity onPress={handleMessage}>
              <Ionicons
                name="chatbubble-outline"
                size={20}
                color={COLORS.TEXT_SECONDARY}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <Ionicons name="location" size={20} color={COLORS.PRIMARY} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Address</Text>
              <Text style={styles.infoValue}>
                {user.address.address}, {user.address.city},{" "}
                {user.address.state} {user.address.postalCode}
              </Text>
            </View>
          </View>
        </View>

        {/* Work Information */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Work Information</Text>

          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <Ionicons name="business" size={20} color={COLORS.PRIMARY} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Company</Text>
              <Text style={styles.infoValue}>{user.company.name}</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <Ionicons name="briefcase" size={20} color={COLORS.PRIMARY} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Title</Text>
              <Text style={styles.infoValue}>{user.company.title}</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <Ionicons name="people" size={20} color={COLORS.PRIMARY} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Department</Text>
              <Text style={styles.infoValue}>{user.company.department}</Text>
            </View>
          </View>
        </View>

        {/* Personal Information */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <Ionicons name="calendar" size={20} color={COLORS.PRIMARY} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Birth Date</Text>
              <Text style={styles.infoValue}>{user.birthDate}</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <Ionicons name="person" size={20} color={COLORS.PRIMARY} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Age</Text>
              <Text style={styles.infoValue}>{user.age} years old</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <Ionicons name="school" size={20} color={COLORS.PRIMARY} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>University</Text>
              <Text style={styles.infoValue}>{user.university}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.BORDER,
  },
  backButton: {
    padding: SPACING.SM,
  },
  headerActions: {
    flexDirection: "row",
    gap: SPACING.SM,
  },
  actionButton: {
    padding: SPACING.SM,
  },
  content: {
    flex: 1,
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: SPACING.XL,
  },
  avatarContainer: {
    marginBottom: SPACING.MD,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "white",
    fontSize: 48,
    fontWeight: TYPOGRAPHY.FONT_WEIGHTS.BOLD,
  },
  contactName: {
    fontSize: TYPOGRAPHY.FONT_SIZES.LARGE,
    fontWeight: TYPOGRAPHY.FONT_WEIGHTS.BOLD,
    color: COLORS.TEXT_PRIMARY,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.LG,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.BORDER,
  },
  actionButtonLarge: {
    alignItems: "center",
    gap: SPACING.SM,
  },
  actionIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: "center",
    alignItems: "center",
  },
  actionButtonText: {
    fontSize: TYPOGRAPHY.FONT_SIZES.SMALL,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: TYPOGRAPHY.FONT_WEIGHTS.MEDIUM,
  },
  infoSection: {
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.LG,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.FONT_SIZES.MEDIUM,
    fontWeight: TYPOGRAPHY.FONT_WEIGHTS.BOLD,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.MD,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.MD,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.BORDER,
  },
  infoIcon: {
    width: 40,
    alignItems: "center",
  },
  infoContent: {
    flex: 1,
    marginLeft: SPACING.MD,
  },
  infoLabel: {
    fontSize: TYPOGRAPHY.FONT_SIZES.SMALL,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: TYPOGRAPHY.FONT_SIZES.REGULAR,
    color: COLORS.TEXT_PRIMARY,
  },
});

export default ContactDetailScreen;
