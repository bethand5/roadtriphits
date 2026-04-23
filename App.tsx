import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { useStatsStore } from './store/statsStore'
import HomeScreen from './screens/HomeScreen'
import TurnIntroScreen from './screens/TurnIntroScreen'
import GameScreen from './screens/GameScreen'
import RoundResultScreen from './screens/RoundResultScreen'
import LeaderboardScreen from './screens/LeaderboardScreen'
import PartyGameScreen from './screens/PartyGameScreen'
import PartyResultScreen from './screens/PartyResultScreen'
import PartyFinalScreen from './screens/PartyFinalScreen'
import PrivacyPolicyScreen from './screens/PrivacyPolicyScreen'

const Stack = createStackNavigator()

export default function App() {
  const loadStats = useStatsStore(s => s.loadStats)

  useEffect(() => {
    loadStats()
  }, [])

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
            gestureEnabled: false,
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="TurnIntro" component={TurnIntroScreen} options={{ gestureEnabled: false }} />
          <Stack.Screen name="Game" component={GameScreen} options={{ gestureEnabled: false }} />
          <Stack.Screen name="RoundResult" component={RoundResultScreen} options={{ gestureEnabled: false }} />
          <Stack.Screen name="Leaderboard" component={LeaderboardScreen} options={{ gestureEnabled: false }} />
          <Stack.Screen name="PartyGame" component={PartyGameScreen} options={{ gestureEnabled: false }} />
          <Stack.Screen name="PartyResult" component={PartyResultScreen} options={{ gestureEnabled: false }} />
          <Stack.Screen name="PartyFinal" component={PartyFinalScreen} options={{ gestureEnabled: false }} />
          <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  )
}