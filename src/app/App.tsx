import type { ReactNode } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import type { OnboardingStage } from '../domain/access';
import { selectOnboardingStage } from '../data/selectors';
import { useAppStore } from '../data/store';
import { AppLayout } from './AppLayout';
import { ThemeProvider } from './ThemeProvider';
import { AccessScreen } from '../screens/onboarding/AccessScreen';
import { ConsentScreen } from '../screens/onboarding/ConsentScreen';
import { WelcomeCarouselScreen } from '../screens/onboarding/WelcomeCarouselScreen';
import { ProfileScreen } from '../screens/onboarding/ProfileScreen';
import { QuestionnaireScreen } from '../screens/onboarding/QuestionnaireScreen';
import { PlanScreen } from '../screens/onboarding/PlanScreen';
import { TodayScreen } from '../screens/heute/TodayScreen';
import { CheckinScreen } from '../screens/heute/CheckinScreen';
import { InstructionScreen } from '../screens/heute/InstructionScreen';
import { TimerScreen } from '../screens/heute/TimerScreen';
import { FeedbackScreen } from '../screens/heute/FeedbackScreen';
import { ProgressScreen } from '../screens/fortschritt/ProgressScreen';
import { LearningScreen } from '../screens/lernen/LearningScreen';
import { LearningCardScreen } from '../screens/lernen/LearningCardScreen';
import { BloodPressureScreen } from '../screens/blutdruck/BloodPressureScreen';
import { BpFormScreen } from '../screens/blutdruck/BpFormScreen';
import { BpInfoScreen } from '../screens/blutdruck/BpInfoScreen';
import { SettingsScreen } from '../screens/einstellungen/SettingsScreen';
import { SettingsPlanScreen } from '../screens/einstellungen/SettingsPlanScreen';
import { SettingsProfileScreen } from '../screens/einstellungen/SettingsProfileScreen';
import { SettingsDataScreen } from '../screens/einstellungen/SettingsDataScreen';
import { SettingsLegalScreen } from '../screens/einstellungen/SettingsLegalScreen';
import { AdminScreen } from '../screens/admin/AdminScreen';
import { NotFoundScreen } from '../screens/NotFoundScreen';

const stageRoutes: Record<OnboardingStage, string> = {
  access: '/zugang',
  consent: '/onboarding/einwilligung',
  welcome: '/onboarding/willkommen',
  profile: '/onboarding/profil',
  questionnaire: '/onboarding/fragebogen',
  plan: '/onboarding/plan',
  done: '/heute',
};

const stageOrder: OnboardingStage[] = [
  'access',
  'consent',
  'welcome',
  'profile',
  'questionnaire',
  'plan',
  'done',
];

function useStage(): OnboardingStage {
  return useAppStore(selectOnboardingStage);
}

/** Laesst den Screen nur zu, wenn das Onboarding weit genug fortgeschritten ist. */
function RequireStage({ stage, children }: { stage: OnboardingStage; children: ReactNode }) {
  const current = useStage();
  if (stageOrder.indexOf(current) < stageOrder.indexOf(stage)) {
    return <Navigate to={stageRoutes[current]} replace />;
  }
  return <>{children}</>;
}

/** Onboarding-Schritt: bereits erledigte Schritte leiten nach vorne weiter. */
function OnboardingStep({ stage, children }: { stage: OnboardingStage; children: ReactNode }) {
  const current = useStage();
  if (stageOrder.indexOf(current) < stageOrder.indexOf(stage)) {
    return <Navigate to={stageRoutes[current]} replace />;
  }
  return <>{children}</>;
}

function StartRedirect() {
  const stage = useStage();
  return <Navigate to={stageRoutes[stage]} replace />;
}

export function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ThemeProvider>
        <Routes>
          <Route path="/" element={<StartRedirect />} />
          <Route path="/zugang" element={<AccessScreen />} />

          <Route
            path="/onboarding/einwilligung"
            element={
              <OnboardingStep stage="consent">
                <ConsentScreen />
              </OnboardingStep>
            }
          />
          <Route
            path="/onboarding/willkommen"
            element={
              <OnboardingStep stage="welcome">
                <WelcomeCarouselScreen />
              </OnboardingStep>
            }
          />
          <Route
            path="/onboarding/profil"
            element={
              <OnboardingStep stage="profile">
                <ProfileScreen />
              </OnboardingStep>
            }
          />
          <Route
            path="/onboarding/fragebogen"
            element={
              <OnboardingStep stage="questionnaire">
                <QuestionnaireScreen />
              </OnboardingStep>
            }
          />
          <Route
            path="/onboarding/plan"
            element={
              <OnboardingStep stage="plan">
                <PlanScreen />
              </OnboardingStep>
            }
          />

          <Route
            element={
              <RequireStage stage="done">
                <AppLayout />
              </RequireStage>
            }
          >
            <Route path="/heute" element={<TodayScreen />} />
            <Route path="/heute/checkin" element={<CheckinScreen />} />
            <Route path="/heute/anleitung" element={<InstructionScreen />} />
            <Route path="/heute/training" element={<TimerScreen />} />
            <Route path="/heute/rueckmeldung" element={<FeedbackScreen />} />
            <Route path="/fortschritt" element={<ProgressScreen />} />
            <Route path="/lernen" element={<LearningScreen />} />
            <Route path="/lernen/:cardId" element={<LearningCardScreen />} />
            <Route path="/blutdruck" element={<BloodPressureScreen />} />
            <Route path="/blutdruck/neu" element={<BpFormScreen />} />
            <Route path="/blutdruck/:entryId/bearbeiten" element={<BpFormScreen />} />
            <Route path="/blutdruck/hinweise" element={<BpInfoScreen />} />
            <Route path="/einstellungen" element={<SettingsScreen />} />
            <Route path="/einstellungen/plan" element={<SettingsPlanScreen />} />
            <Route path="/einstellungen/profil" element={<SettingsProfileScreen />} />
            <Route path="/einstellungen/daten" element={<SettingsDataScreen />} />
            <Route path="/einstellungen/rechtliches" element={<SettingsLegalScreen />} />
          </Route>

          <Route path="/admin" element={<AdminScreen />} />
          <Route path="*" element={<NotFoundScreen />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}
