import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import AdScreen from './screens/AdScreen';

function App() {
  return (
    <BrowserRouter>
      <div>
        <header>
          <Link to="/">Altizachen</Link>
        </header>
        <main>
          <Routes>
            <Route path="/ad/:slug" element={<AdScreen />} />
            <Route path="/" element={<HomeScreen />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
