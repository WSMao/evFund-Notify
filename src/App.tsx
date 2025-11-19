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
    const percentage = goal ? Math.min(100, Math.round((totalRaised / goal) * 100)) : 0;

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
              peopleCount={data.entries.length}
              parkingStats={data.parkingStats}
              startDate={data.startDate}
              endDate={data.endDate}
            />
            <ContributionList entries={data.entries} />
          </>
        )}
      </main>
    </div>
  );
}

export default App;
