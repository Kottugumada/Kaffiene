import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../theme';

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  maxRating?: number;
  size?: number;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  onRatingChange,
  maxRating = 5,
  size = 24,
}) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: maxRating }, (_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= rating;

        return (
          <TouchableOpacity
            key={starValue}
            onPress={() => onRatingChange(starValue)}
            style={styles.star}
            activeOpacity={0.7}
          >
            <Text style={[styles.starText, { fontSize: size }]}>
              {isFilled ? '★' : '☆'}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    padding: spacing.xs,
  },
  starText: {
    color: colors.star,
  },
});

