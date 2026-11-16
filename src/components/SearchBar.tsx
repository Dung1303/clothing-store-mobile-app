
import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';

type SearchBarProps = {
  keyword: string;
  onChangeKeyword: (keyword: string) => void;
};

const SearchBar = ({
  keyword,
  onChangeKeyword,
}: SearchBarProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.searchIcon}>⌕</Text>

      <TextInput
        style={styles.input}
        placeholder="Tìm theo tên hoặc danh mục..."
        placeholderTextColor="#999999"
        value={keyword}
        onChangeText={onChangeKeyword}
        autoCapitalize="none"
        returnKeyType="search"
      />

      {keyword.length > 0 && (
        <TouchableOpacity
          onPress={() => onChangeKeyword('')}
          style={styles.clearButton}
        >
          <Text style={styles.clearText}>×</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 48,
    marginHorizontal: 15,
    marginVertical: 10,
  },

  searchIcon: {
    fontSize: 25,
    color: '#777777',
    marginRight: 10,
  },

  input: {
    flex: 1,
    fontSize: 14,
    color: '#333333',
    paddingVertical: 0,
  },

  clearButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  clearText: {
    fontSize: 22,
    color: '#777777',
  },
});

export default SearchBar;
