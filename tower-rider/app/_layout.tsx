import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack  >
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen name="screen/game" options={{ title: "Game" }} />
      <Stack.Screen name="screen/score" options={{ title: "Leaderboard" }} />
      <Stack.Screen name="screen/settings" options={{ title: "Settings" }} />
      <Stack.Screen name="screen/inventory" options={{ title: "Inventory" }} />
      <Stack.Screen name="screen/contact" options={{ title: "Contact" }} />
    </Stack>
  );
}