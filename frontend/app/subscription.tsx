import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, TouchableOpacity, TouchableWithoutFeedback, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';
import Typography from '../constants/Typography';
import { Accordion, PlanCard, PrimaryButton, SecondaryButton } from '../components/shared';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../store/useAuthStore';
import { AlertService } from '../services/alertService';
import { SUBSCRIPTION_PLANS } from '../services/mockApi';
import { Ionicons } from '@expo/vector-icons';

const STRIPE_URLS = {
  FREE: 'https://buy.stripe.com/test_free_trial',
  EXPLORE: 'https://buy.stripe.com/test_explore',
  DEVELOP: 'https://buy.stripe.com/test_develop',
  MASTER: 'https://buy.stripe.com/test_master',
};

export default function Subscription() {
  const router = useRouter();
  const { user, updateUser } = useAuthStore();
  const [showFreeWarning, setShowFreeWarning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Get current subscription or default to free
  const currentSubscription = user?.subscription || SUBSCRIPTION_PLANS.FREE;

  // Plans content (Business cards-style) - using centralized subscription plans
  const explorePoints = SUBSCRIPTION_PLANS.EXPLORE.features;
  const developPoints = SUBSCRIPTION_PLANS.DEVELOP.features;
  const masterPoints = SUBSCRIPTION_PLANS.MASTER.features;

  const openStripe = async (url: string) => {
    try {
      await Linking.openURL(url);
      router.replace({ pathname: '/welcome', params: { authMode: 'register' } });
    } catch (e) {
      console.error('Failed to open Stripe URL', e);
    }
  };

  const handleUnsubscribe = () => {
    AlertService.confirm({
      title: 'Cancel Subscription',
      message: 'Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your current billing period.',
      confirmText: 'Cancel Subscription',
      cancelText: 'Keep Subscription',
      onConfirm: async () => {
        setIsLoading(true);
        try {
          // In real app, this would call an API
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const updatedSubscription = {
            ...currentSubscription,
            status: 'cancelled' as const,
            autoRenew: false,
            startDate: currentSubscription.startDate,
          };
          
          await updateUser({
            subscription: updatedSubscription,
          });
          
          AlertService.success('Your subscription has been cancelled. You will retain access until the end of your current billing period.', 'Subscription Cancelled');
        } catch (error) {
          AlertService.error('Failed to cancel subscription. Please try again.');
        } finally {
          setIsLoading(false);
        }
      },
    });
  };

  const handleReactivate = async () => {
    setIsLoading(true);
    try {
      // In real app, this would call an API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedSubscription = {
        ...currentSubscription,
        status: 'active' as const,
        autoRenew: true,
        startDate: currentSubscription.startDate,
      };
      
      await updateUser({
        subscription: updatedSubscription,
      });
      
      AlertService.success('Your subscription has been reactivated!', 'Subscription Reactivated');
    } catch (error) {
      AlertService.error('Failed to reactivate subscription. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.primary.goldenYellow} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Subscription</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <Text style={styles.title}>Choose your plan</Text>
        <View style={styles.section}>

          <PlanCard
            name={SUBSCRIPTION_PLANS.EXPLORE.name}
            originalPrice={{ currency: 'USD', amount: Math.round(SUBSCRIPTION_PLANS.EXPLORE.originalPrice! * 100), interval: 'month' }}
            price={{ currency: 'USD', amount: Math.round(SUBSCRIPTION_PLANS.EXPLORE.price * 100), interval: 'month' }}
            perLabel="/user/mo."
            subtitleNote={`$${SUBSCRIPTION_PLANS.EXPLORE.price}/mo if you sign up now`}
            bullets={explorePoints}
            buttonTitle={currentSubscription.type === 'explore' ? 'Unsubscribe' : `Get ${SUBSCRIPTION_PLANS.EXPLORE.name}`}
            onSubscribe={currentSubscription.type === 'explore' ? handleUnsubscribe : () => openStripe(STRIPE_URLS.EXPLORE)}
            highlight={currentSubscription.type === 'explore'}
            showCurrentPlanBadge={currentSubscription.type === 'explore'}
          />
          <PlanCard
            name={SUBSCRIPTION_PLANS.DEVELOP.name}
            originalPrice={{ currency: 'USD', amount: Math.round(SUBSCRIPTION_PLANS.DEVELOP.originalPrice! * 100), interval: 'month' }}
            price={{ currency: 'USD', amount: Math.round(SUBSCRIPTION_PLANS.DEVELOP.price * 100), interval: 'month' }}
            perLabel="/user/mo."
            subtitleNote={`$${SUBSCRIPTION_PLANS.DEVELOP.price}/mo if you sign up now`}
            bullets={developPoints}
            buttonTitle={currentSubscription.type === 'develop' ? 'Unsubscribe' : `Get ${SUBSCRIPTION_PLANS.DEVELOP.name}`}
            onSubscribe={currentSubscription.type === 'develop' ? handleUnsubscribe : () => openStripe(STRIPE_URLS.DEVELOP)}
            highlight={currentSubscription.type === 'develop'}
            showCurrentPlanBadge={currentSubscription.type === 'develop'}
          />
          <PlanCard
            name={SUBSCRIPTION_PLANS.MASTER.name}
            originalPrice={{ currency: 'USD', amount: Math.round(SUBSCRIPTION_PLANS.MASTER.originalPrice! * 100), interval: 'month' }}
            price={{ currency: 'USD', amount: Math.round(SUBSCRIPTION_PLANS.MASTER.price * 100), interval: 'month' }}
            perLabel="/user/mo."
            subtitleNote={`$${SUBSCRIPTION_PLANS.MASTER.price}/mo if you sign up now`}
            bullets={masterPoints}
            buttonTitle={currentSubscription.type === 'master' ? 'Unsubscribe' : `Get ${SUBSCRIPTION_PLANS.MASTER.name}`}
            onSubscribe={currentSubscription.type === 'master' ? handleUnsubscribe : () => openStripe(STRIPE_URLS.MASTER)}
            highlight={currentSubscription.type === 'master'}
            showCurrentPlanBadge={currentSubscription.type === 'master'}
          />
        </View>

        {currentSubscription.type === 'free' && (
          <SecondaryButton title="Continue with Free 12 hour trial" onPress={() => setShowFreeWarning(true)} />
        )}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
  },
  headerTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.primary.goldenYellow,
  },
  content: {
    flexGrow: 1,
    padding: Layout.spacing.lg,
    gap: Layout.spacing.lg,
  },
  cancelButton: {
    backgroundColor: Colors.error + '20',
    borderWidth: 1,
    borderColor: Colors.error,
    paddingVertical: Layout.spacing.sm,
    paddingHorizontal: Layout.spacing.md,
    borderRadius: Layout.borderRadius.md,
    flex: 1,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.error,
  },
  reactivateButton: {
    backgroundColor: Colors.success + '20',
    borderWidth: 1,
    borderColor: Colors.success,
    paddingVertical: Layout.spacing.sm,
    paddingHorizontal: Layout.spacing.md,
    borderRadius: Layout.borderRadius.md,
    flex: 1,
    alignItems: 'center',
  },
  reactivateButtonText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.success,
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


