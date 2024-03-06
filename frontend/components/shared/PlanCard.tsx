import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';
import Typography from '../../constants/Typography';
import PrimaryButton from './PrimaryButton';

type Price = {
  currency: string; // e.g. USD
  amount: number; // in minor units e.g. 990
  interval?: 'month' | 'year' | 'once';
};

type Props = {
  name: string;
  price: Price;
  originalPrice?: Price;
  perLabel?: string; // e.g. "/user/mo."
  subtitleNote?: string; // e.g. "$6/mo if you sign up now"
  bullets?: string[]; // optional bullet list like the business plan card
  buttonTitle?: string; // default: "Subscribe"
  introText?: string; // optional lead-in line above bullets
  showCheckIcons?: boolean; // render check icons for bullets (default true)
  onSubscribe: () => void;
  footer?: React.ReactNode;
  highlight?: boolean;
  showCurrentPlanBadge?: boolean; // show "Current Plan" badge
};

function formatPrice(p: Price) {
  const symbol = p.currency === 'USD' ? '$' : p.currency === 'GBP' ? '£' : p.currency === 'EUR' ? '€' : '';
  const value = (p.amount / 100).toFixed(2);
  const suffix = p.interval && p.interval !== 'once' ? `/${p.interval}` : '';
  return `${symbol}${value}${suffix}`;
}

export default function PlanCard({
  name,
  price,
  originalPrice,
  perLabel,
  subtitleNote,
  bullets,
  buttonTitle,
  introText,
  showCheckIcons = true,
  onSubscribe,
  footer,
  highlight,
  showCurrentPlanBadge = false,
}: Props) {
  return (
    <View style={[styles.card, highlight && styles.highlight]}>
      <View style={styles.headerRow}>
        <Text style={styles.name}>{name}</Text>
        {showCurrentPlanBadge && (
          <View style={styles.currentPlanBadge}>
            <Text style={styles.currentPlanBadgeText}>Current Plan</Text>
          </View>
        )}
      </View>
      <View style={styles.priceRow}>
        {originalPrice && <Text style={styles.original}>{formatPrice(originalPrice)}</Text>}
        <Text style={styles.price}>
          {formatPrice(price)}
          {perLabel ? <Text style={styles.perLabel}>{perLabel}</Text> : null}
        </Text>
      </View>
      {subtitleNote ? <Text style={styles.subtitleNote}>{subtitleNote}</Text> : null}
      {introText ? <Text style={styles.introText}>{introText}</Text> : null}
      {bullets && bullets.length > 0 ? (
        <View style={styles.bulletsContainer}>
          {bullets.map((item) => (
            <View key={item} style={styles.bulletRow}>
              {showCheckIcons ? (
                <Ionicons name="checkmark" size={16} color={Colors.text.primary} />
              ) : (
                <Text style={styles.bulletMarker}>•</Text>
              )}
              <Text style={styles.bulletText}>{item}</Text>
            </View>
          ))}
        </View>
      ) : null}
      <PrimaryButton title={buttonTitle ?? 'Subscribe'} onPress={onSubscribe} />
      {footer && <View style={{ marginTop: Layout.spacing.sm }}>{footer}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.neutral.white,
    borderRadius: Layout.borderRadius.lg,
    padding: Layout.spacing.md,
    marginBottom: Layout.spacing.lg,
  },
  highlight: {
    borderWidth: 2,
    borderColor: Colors.primary.goldenYellow,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.sm,
  },
  name: {
    fontSize: Typography.fontSize.lg,
    color: Colors.text.primary,
    fontWeight: Typography.fontWeight.semibold,
    flex: 1,
  },
  currentPlanBadge: {
    backgroundColor: Colors.primary.goldenYellow,
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: Layout.spacing.xs,
    borderRadius: Layout.borderRadius.full,
  },
  currentPlanBadgeText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.primary,
    fontWeight: Typography.fontWeight.semibold,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginBottom: Layout.spacing.md,
  },
  perLabel: {
    color: Colors.text.secondary,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.normal,
  },
  original: {
    textDecorationLine: 'line-through',
    color: Colors.text.secondary,
  },
  price: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  subtitleNote: {
    color: Colors.text.secondary,
    marginTop: 2,
    marginBottom: Layout.spacing.sm,
  },
  introText: {
    color: Colors.text.primary,
    marginBottom: 6,
  },
  bulletsContainer: {
    marginBottom: Layout.spacing.md,
    gap: 6,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  bulletMarker: {
    color: Colors.text.primary,
    marginTop: 2,
  },
  bulletText: {
    color: Colors.text.primary,
    flex: 1,
  },
});


