/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Theory } from './pages/Theory';
import { Diagnostics } from './pages/Diagnostics';
import { Profile } from './pages/Profile';
import { Games } from './pages/Games';
import { Admin } from './pages/Admin';
import { SubjectDetail } from './pages/SubjectDetail';
import { Library } from './pages/Library';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="theory" element={<Theory />} />
          <Route path="diagnostics" element={<Diagnostics />} />
          <Route path="profile" element={<Profile />} />
          <Route path="games" element={<Games />} />
          <Route path="admin" element={<Admin />} />
          <Route path="subject/:subjectId" element={<SubjectDetail />} />
          <Route path="library" element={<Library />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
