import { HashRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { DotFlashPage } from './pages/DotFlashPage';
import { TenFramePage } from './pages/TenFramePage';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dots" element={<DotFlashPage />} />
        <Route path="/ten-frame" element={<TenFramePage />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
