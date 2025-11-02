import Inventory from "./pages/Inventory";
import Home from "./pages/Home";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
export default function App() { return (
    <Router>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/inventory" element={<Inventory />} />
        </Routes>
    </Router>
); }
