import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./main/Main";
import SearchPage from "./pages/SearchPage";
import WithFriendPage from "./pages/WithFriendPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/searchpage" element={<SearchPage />} />
          <Route path="/withfriend" element={<WithFriendPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
