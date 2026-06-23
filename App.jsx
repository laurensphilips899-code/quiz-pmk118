import { HashRouter, Routes, Route } from 'react-router-dom'
import JoinPage from './pages/JoinPage'
import QuizPage from './pages/QuizPage'
import ResultsPage from './pages/ResultsPage'
import LeaderboardPage from './pages/LeaderboardPage'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<JoinPage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
      </Routes>
    </HashRouter>
  )
}
