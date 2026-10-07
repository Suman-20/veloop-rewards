import Hero from "../components/Hero";
import Statistics from "../components/Statistics";
import StreakCard from "../components/StreakCard";
import RewardCard from "../components/RewardCard";
import UltimateReward from "../components/UltimateReward";
import TransactionHistory from "../components/TransactionHistory";

function Dashboard() {
  return (
    <main>
      <Hero />

      <Statistics />

      <StreakCard />

      <RewardCard />

      <UltimateReward />

      <TransactionHistory />
    </main>
  );
}

export default Dashboard;