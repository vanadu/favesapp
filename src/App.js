import React from 'react';
// import './reset.scss';
import Faves from './components/Faves';
import './reset.scss';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import TopBanner from './components/TopBanner';
import Navbar from './routes/Navbar';
import ScrollToTop from './components/ScrollToTop';


const App = () => {
  return (
    <div className="app-container">
      <BrowserRouter>
        <ScrollToTop />
        <div className="header full">
          <TopBanner />
          <Navbar />
        </div>
        <>
        <div className="page-content">
        <Faves />
        
        </div>
        <Routes>
          <Route path="/" exact component={Faves} />
        </Routes>
        </>
      </BrowserRouter>
    </div>
  );
}



export default App;