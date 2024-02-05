import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import HomePage from "./pages/HomePage";
import CreateAccount from "./pages/CreateAccount";
import Login from "./pages/Login";
import Chat from "./pages/Chat";

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/createaccount" element={<CreateAccount />} />
          <Route path="/login" element={<Login />} />
          <Route path="/chat" element={<Chat/>} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
