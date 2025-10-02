import React, { useEffect, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { loadFavorites } from "../store/slices/favoritesSlice";
import { fetchUsers } from "../store/slices/usersSlice";
import { User } from "../types";
import FavoritesCard from "../components/FavoritesCard";
import { COLORS, TYPOGRAPHY, SPACING, ROUTES } from "../constants";

const FavoritesScreen = ({ navigation }: { navigation: any }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { favoriteUserIds, loading: favoritesLoading } = useSelector(
    (state: RootState) => state.favorites
  );
  const { users, loading: usersLoading } = useSelector(
    (state: RootState) => state.users
  );

  useEffect(() => {
    dispatch(loadFavorites());
    dispatch(fetchUsers({ skip: 0, limit: 30 }));
  }, [dispatch]);

  const favoriteUsers = useMemo(() => {
    return users.filter((user) => favoriteUserIds.includes(user.id));
  }, [users, favoriteUserIds]);

  const handleRefresh = async () => {
    await Promise.all([
      dispatch(loadFavorites()),
      dispatch(fetchUsers({ skip: 0, limit: 30 })),
    ]);
  };

  const handleContactPress = (user: User) => {
    navigation.navigate(ROUTES.CONTACT_DETAIL, { user });
  };

  const renderUser = ({ item }: { item: User }) => (
    <FavoritesCard user={item} onPress={() => handleContactPress(item)} />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Ionicons
          name="heart-outline"
          size={64}
          color={COLORS.TEXT_SECONDARY}
        />
      </View>
      <Text style={styles.emptyTitle}>No Favorites Yet</Text>
      <Text style={styles.emptyText}>
        Start adding contacts to your favorites by tapping the heart icon on any
        contact card.
      </Text>
    </View>
  );

  const loading = favoritesLoading || usersLoading;

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.titleContainer}>
            <Ionicons
              name="heart"
              size={28}
              color={COLORS.ERROR}
              style={styles.titleIcon}
            />
            <Text style={styles.title}>Favorites</Text>
          </View>
          <Text style={styles.subtitle}>
            {favoriteUsers.length} favorite
            {favoriteUsers.length !== 1 ? "s" : ""}
          </Text>
        </View>
        <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
          <Ionicons name="refresh" size={20} color={COLORS.PRIMARY} />
        </TouchableOpacity>
      </View>

      {loading && favoriteUsers.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.PRIMARY} />
          <Text style={styles.loadingText}>Loading favorites...</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={favoriteUsers}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            renderItem={renderUser}
            ListEmptyComponent={renderEmpty}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={handleRefresh}
                colors={[COLORS.PRIMARY]}
                tintColor={COLORS.PRIMARY}
              />
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </>
      )}
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
    paddingVertical: SPACING.LG,
    backgroundColor: COLORS.CARD_BACKGROUND,
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
  headerContent: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  titleIcon: {
    marginRight: SPACING.SM,
  },
  title: {
    fontSize: TYPOGRAPHY.FONT_SIZES.LARGE,
    fontWeight: TYPOGRAPHY.FONT_WEIGHTS.BOLD,
    color: COLORS.TEXT_PRIMARY,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.FONT_SIZES.SMALL,
    color: COLORS.TEXT_SECONDARY,
    marginTop: SPACING.XS,
  },
  refreshButton: {
    padding: SPACING.SM,
    borderRadius: 20,
    backgroundColor: COLORS.BACKGROUND,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  listContainer: {
    paddingHorizontal: SPACING.MD,
    paddingTop: SPACING.MD,
    paddingBottom: 100,
  },
  separator: {
    height: SPACING.SM,
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.XL,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.BACKGROUND,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.LG,
    borderWidth: 2,
    borderColor: COLORS.BORDER,
    borderStyle: "dashed",
  },
  emptyTitle: {
    fontSize: TYPOGRAPHY.FONT_SIZES.MEDIUM,
    fontWeight: TYPOGRAPHY.FONT_WEIGHTS.BOLD,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.SM,
  },
  emptyText: {
    fontSize: TYPOGRAPHY.FONT_SIZES.REGULAR,
    color: COLORS.TEXT_SECONDARY,
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 280,
  },
  // Removed FAB styles
});

export default FavoritesScreen;
