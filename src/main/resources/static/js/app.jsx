const { createHashRouter, RouterProvider, Navigate } = ReactRouterDOM;

const router = createHashRouter([
  { path: "/", element: <HomePage /> },
  { path: "/about", element: <AboutPage /> },
  { path: "/pricing", element: <PricingPage /> },
  { path: "/terms", element: <TermsPage /> },
  { path: "/privacy", element: <PrivacyPage /> },
  { path: "/login", element: <LoginPage /> },
  { 
    path: "/admin", 
    element: <AdminLayout />,
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <AdminDashboardPage /> },
      { path: "classes", element: <AdminClassesPage /> },
      { path: "instructors", element: <AdminInstructorsPage /> },
      { path: "clients", element: <AdminClientsPage /> },
      { path: "content", element: <AdminContentPage /> },
      { path: "settings", element: <AdminSettingsPage /> }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

/* ── Mount ──────────────────────────────────────── */
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>);
