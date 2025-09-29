import { Toaster } from 'sonner';
import { BrowserRouter, Routes, Route } from 'react-router';
import NotFound from './pages/NotFound';
import Login from './pages/AuthPages/LoginPage';

function App() {

  return (
    <div>
   
      <Toaster/>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
