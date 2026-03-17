import { useMemo } from 'react';
import { useFundraisingData } from './hooks/useFundraisingData';
import { Navbar } from './components/Navbar';
import { ProgressHero } from './components/ProgressHero';
import { ContributionList } from './components/ContributionList';
import './styles/dashboard.css';

function App() {
  const { data, isLoading, error } = useFundraisingData();

  const derived = useMemo(() => {
    if (!data) {
      return null;
    }

    const totalRaised = data.accumulated ?? 0;  // 使用累積金額欄位
    const goal = data.goal ?? 0;

    let percentage = 0;
    if (goal > 0) {
      const rawPercentage = (totalRaised / goal) * 100;
      const flooredPercentage = Math.floor(rawPercentage);

      // 未達標前最高只顯示 99%，避免四捨五入提早顯示 100%
      percentage = totalRaised < goal
        ? Math.min(99, Math.max(0, flooredPercentage))
        : Math.min(100, Math.max(0, flooredPercentage));
    }

    return { totalRaised, goal, percentage };
  }, [data]);

  return (
    <div className="app-shell">
      <Navbar />

      {error && <p className="error">{error.message}</p>}

      <main>
        {isLoading && !data && <p className="muted">資料讀取中，請稍候…</p>}

        {derived && data && (
          <>
            <ProgressHero 
              percentage={derived.percentage} 
              raised={derived.totalRaised} 
              goal={derived.goal} 
              difference={data.difference}
              avgAmount={data.avgAmount}
              planQuota={data.planQuota}
              currentPeople={data.currentPeople}
              parkingStats={data.parkingStats}
              startDate={data.startDate}
              endDate={data.endDate}
            />
            <ContributionList entries={data.entries} avgAmount={data.avgAmount} />
          </>
        )}
      </main>
    </div>
  );
}

export default App;
