import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import {
  fetchUsers,
  searchUsers,
  loadMoreUsers,
  setSearchQuery,
  clearUsers,
} from "../store/slices/usersSlice";
import { User } from "../types";
import ContactCard from "../components/ContactCard";
import { COLORS, TYPOGRAPHY, SPACING, ROUTES } from "../constants";

const AddressBookScreen = ({ navigation }: { navigation: any }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading, hasMore, searchQuery, total, skip } = useSelector(
    (state: RootState) => state.users
  );

  const [searchText, setSearchText] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    dispatch(fetchUsers({ skip: 0, limit: 30 }));
  }, [dispatch]);

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!loading && isSearching) {
      setIsSearching(false);
    }
  }, [loading, isSearching]);

  const handleSearch = useCallback(
    (text: string) => {
      setSearchText(text);
      dispatch(setSearchQuery(text));

      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      if (!text.trim()) {
        setIsSearching(false);
        dispatch(clearUsers());
        dispatch(fetchUsers({ skip: 0, limit: 30 }));
        return;
      }

      searchTimeoutRef.current = setTimeout(() => {
        setIsSearching(true);
        dispatch(searchUsers({ query: text.trim(), skip: 0, limit: 30 }));
      }, 300);
    },
    [dispatch]
  );

  const handleLoadMore = useCallback(() => {
    if (hasMore && !loading) {
      if (searchQuery.trim()) {
        dispatch(
          searchUsers({
            query: searchQuery.trim(),
            skip: users.length,
          })
        );
      } else {
        dispatch(loadMoreUsers({ skip }));
      }
    }
  }, [dispatch, hasMore, loading, searchQuery, skip, users.length]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    dispatch(clearUsers());
    if (searchQuery.trim()) {
      await dispatch(
        searchUsers({ query: searchQuery.trim(), skip: 0, limit: 30 })
      );
    } else {
      await dispatch(fetchUsers({ skip: 0, limit: 30 }));
    }
    setRefreshing(false);
  }, [dispatch, searchQuery]);

  const handleContactPress = (user: User) => {
    navigation.navigate(ROUTES.CONTACT_DETAIL, { user });
  };

  const renderUser = ({ item }: { item: User }) => (
    <ContactCard user={item} onPress={() => handleContactPress(item)} />
  );

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={COLORS.PRIMARY} />
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {searchQuery
          ? "No contacts found matching your search"
          : "No contacts available"}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Address Book</Text>
        <Text style={styles.subtitle}>{total} contacts</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          {isSearching ? (
            <ActivityIndicator
              size="small"
              color={COLORS.PRIMARY}
              style={styles.searchIcon}
            />
          ) : (
            <Ionicons
              name="search"
              size={20}
              color={COLORS.TEXT_SECONDARY}
              style={styles.searchIcon}
            />
          )}
          <TextInput
            style={styles.searchInput}
            placeholder="Search contacts..."
            placeholderTextColor={COLORS.TEXT_SECONDARY}
            value={searchText}
            onChangeText={handleSearch}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchText.length > 0 && !isSearching && (
            <TouchableOpacity
              onPress={() => handleSearch("")}
              style={styles.clearButton}
            >
              <Ionicons
                name="close-circle"
                size={20}
                color={COLORS.TEXT_SECONDARY}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={users}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={renderUser}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.PRIMARY]}
            tintColor={COLORS.PRIMARY}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        style={{ opacity: isSearching ? 0.7 : 1 }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  header: {
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.LG,
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.BORDER,
    shadowColor: COLORS.SHADOW,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 2,
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
  searchContainer: {
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    backgroundColor: COLORS.CARD_BACKGROUND,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: 25,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    shadowColor: COLORS.SHADOW,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: SPACING.SM,
  },
  searchInput: {
    flex: 1,
    fontSize: TYPOGRAPHY.FONT_SIZES.REGULAR,
    color: COLORS.TEXT_PRIMARY,
    paddingVertical: SPACING.SM,
  },
  clearButton: {
    marginLeft: SPACING.SM,
    padding: SPACING.XS,
  },
  filterContainer: {
    padding: SPACING.MD,
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  listContainer: {
    paddingBottom: 80,
  },
  footerLoader: {
    padding: SPACING.MD,
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.XL,
  },
  emptyText: {
    fontSize: TYPOGRAPHY.FONT_SIZES.REGULAR,
    color: COLORS.TEXT_SECONDARY,
    textAlign: "center",
  },
});

export default AddressBookScreen;
