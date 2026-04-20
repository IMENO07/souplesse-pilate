/* ── Main App — Modern React Router ────────────────── */
const { createHashRouter, RouterProvider } = ReactRouterDOM;

const router = createHashRouter([
  { path: "/", element: <HomePage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/admin", element: <AdminPage /> }
]);

function App() {
  return <RouterProvider router={router} />;
}

/* ── Mount ──────────────────────────────────────── */
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>);
