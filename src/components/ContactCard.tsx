import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { User } from "../types";
import {
  addToFavorites,
  removeFromFavorites,
} from "../store/slices/favoritesSlice";
import { COLORS, TYPOGRAPHY, SPACING } from "../constants";

interface ContactCardProps {
  user: User;
  onPress?: () => void;
}

const ContactCard: React.FC<ContactCardProps> = ({ user, onPress }) => {
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
    <TouchableOpacity
      style={styles.contactItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
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

      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>
          {user.firstName} {user.lastName}
        </Text>
        <Text style={styles.contactPhone}>{user.phone}</Text>
      </View>

      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={handleFavoritePress}
        activeOpacity={0.7}
      >
        <Ionicons
          name={isFavorite ? "heart" : "heart-outline"}
          size={20}
          color={isFavorite ? COLORS.ERROR : COLORS.TEXT_SECONDARY}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.MD,
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.BORDER,
    marginHorizontal: SPACING.SM,
    marginVertical: 1,
    borderRadius: 12,
    shadowColor: COLORS.SHADOW,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 1,
  },
  avatarContainer: {
    marginRight: SPACING.MD,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: COLORS.BORDER,
  },
  avatarPlaceholder: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.BORDER,
  },
  avatarText: {
    color: "white",
    fontSize: TYPOGRAPHY.FONT_SIZES.MEDIUM,
    fontWeight: TYPOGRAPHY.FONT_WEIGHTS.BOLD,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: TYPOGRAPHY.FONT_SIZES.REGULAR,
    fontWeight: TYPOGRAPHY.FONT_WEIGHTS.MEDIUM,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 2,
  },
  contactPhone: {
    fontSize: TYPOGRAPHY.FONT_SIZES.SMALL,
    color: COLORS.TEXT_SECONDARY,
  },
  favoriteButton: {
    padding: SPACING.SM,
    borderRadius: 20,
    backgroundColor: "transparent",
  },
});

export default ContactCard;
