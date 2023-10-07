import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, TouchableOpacity, TouchableWithoutFeedback, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';
import Typography from '../constants/Typography';
import { Accordion, PlanCard, PrimaryButton, SecondaryButton } from '../components/shared';
import { useRouter } from 'expo-router';

const STRIPE_URLS = {
  FREE: 'https://buy.stripe.com/test_free_trial',
  EXPLORE: 'https://buy.stripe.com/test_explore',
  DEVELOP: 'https://buy.stripe.com/test_develop',
  MASTER: 'https://buy.stripe.com/test_master',
};

export default function Subscription() {
  const router = useRouter();
  const [showFreeWarning, setShowFreeWarning] = useState(false);

  // Plans content (Business cards-style)
  const explorePoints = [
    'Centralized team billing (per user/month)',
    'Usage analytics and reporting',
    'Org-wide privacy mode controls',
    'Role-based access control',
    'SAML/OIDC SSO',
  ];

  const developPoints = [
    'Everything in Explore, plus:',
    'Curated X Feed (daily insights)',
    'Job Aspiration Matching',
    'Job Application Creator — 8/month (2/week)',
  ];

  const masterPoints = [
    'Everything in Develop, plus:',
    'Unlimited Development Activities',
    'Priority support and account management',
  ];

  const openStripe = async (url: string) => {
    try {
      await Linking.openURL(url);
      router.replace({ pathname: '/welcome', params: { authMode: 'register' } });
    } catch (e) {
      console.error('Failed to open Stripe URL', e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Choose your plan</Text>
        <View style={styles.section}>

          <PlanCard
            name="Explore"
            originalPrice={{ currency: 'USD', amount: 1999, interval: 'month' }}
            price={{ currency: 'USD', amount: Math.round(1999 * 0.75), interval: 'month' }}
            perLabel="/user/mo."
            subtitleNote="$6/mo if you sign up now"
            bullets={explorePoints}
            buttonTitle="Get Explore"
            onSubscribe={() => openStripe(STRIPE_URLS.EXPLORE)}
            highlight
          />
          <PlanCard
            name="Develop"
            originalPrice={{ currency: 'USD', amount: 3999, interval: 'month' }}
            price={{ currency: 'USD', amount: Math.round(3999 * 0.75), interval: 'month' }}
            perLabel="/user/mo."
            subtitleNote="$9/mo if you sign up now"
            bullets={developPoints}
            buttonTitle="Get Develop"
            onSubscribe={() => openStripe(STRIPE_URLS.DEVELOP)}
          />
          <PlanCard
            name="Master"
            originalPrice={{ currency: 'USD', amount: 6999, interval: 'month' }}
            price={{ currency: 'USD', amount: Math.round(6999 * 0.63), interval: 'month' }}
            perLabel="/user/mo."
            subtitleNote="$15/mo if you sign up now"
            bullets={masterPoints}
            buttonTitle="Get Master"
            onSubscribe={() => openStripe(STRIPE_URLS.MASTER)}
          />
        </View>

        <SecondaryButton title="Continue with Free 12 hour trial" onPress={() => setShowFreeWarning(true)} />
      </ScrollView>

      <Modal visible={showFreeWarning} transparent animationType="fade" onRequestClose={() => setShowFreeWarning(false)}>
        <TouchableWithoutFeedback onPress={() => setShowFreeWarning(false)}>
          <View style={styles.modalBackdrop}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Are you sure?</Text>
            <Text style={styles.modalText}>
              You can take advantage of a 25% discount in the Explore and Develop subscriptions and a 37% discount in the Master subscription if you sign up now
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setShowFreeWarning(false)}>
                <Text style={styles.cancelText}>Keep browsing</Text>
              </TouchableOpacity>
              <PrimaryButton title="Continue with Free 12 hour trial" onPress={() => {
                setShowFreeWarning(false);
                router.replace({ pathname: '/welcome', params: { authMode: 'register' } });
              }} />
            </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary.navyBlue,
  },
  content: {
    flexGrow: 1,
    padding: Layout.spacing.lg,
    gap: Layout.spacing.lg,
  },
  title: {
    color: Colors.primary.goldenYellow,
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.semibold,
    textAlign: 'center',
  },
  section: {
    marginTop: Layout.spacing.md,
  },
  featureText: {
    color: Colors.text.primary,
  },
  planCard: {
    backgroundColor: Colors.neutral.white,
    borderRadius: Layout.borderRadius.lg,
    padding: Layout.spacing.lg,
    marginBottom: Layout.spacing.lg,
  },
  planTitle: {
    color: Colors.text.primary,
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
  },
  planPrice: {
    color: Colors.text.primary,
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    marginTop: 2,
  },
  per: {
    color: Colors.text.secondary,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.normal,
  },
  dimNote: {
    color: Colors.text.secondary,
    marginTop: 4,
    marginBottom: Layout.spacing.sm,
  },
  bullets: {
    marginVertical: Layout.spacing.sm,
    gap: 8,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bulletText: {
    color: Colors.text.primary,
  },
  matrixRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: Layout.spacing.sm,
  },
  matrixCell: {
    backgroundColor: '#F5F5F5',
    borderRadius: Layout.borderRadius.md,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
  },
  matrixPlan: {
    color: Colors.text.secondary,
    fontSize: Typography.fontSize.xs ?? 12,
    marginBottom: 2,
  },
  matrixValue: {
    color: Colors.text.primary,
    fontWeight: Typography.fontWeight.medium,
  },
  noteText: {
    color: Colors.text.secondary,
    marginTop: 6,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: Layout.spacing.lg,
  },
  modalContent: {
    backgroundColor: Colors.neutral.white,
    borderRadius: Layout.borderRadius.lg,
    padding: Layout.spacing.lg,
  },
  modalTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.sm,
  },
  modalText: {
    color: Colors.text.primary,
  },
  modalActions: {
    marginTop: Layout.spacing.md,
    gap: Layout.spacing.sm,
  },
  cancelText: {
    textAlign: 'center',
    color: Colors.text.secondary,
    marginBottom: Layout.spacing.sm,
  },
});


