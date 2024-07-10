import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from './main/Main';
import SearchPage from './pages/SearchPage';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/searchpage" element={<SearchPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
