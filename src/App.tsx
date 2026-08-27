import { useState } from "react";
import type { AppUser, Page } from "../src/types/types";

import { HomePage } from "./pages/HomePage";
import { CadastroPage } from "./pages/CadastrarUsuario";
import { LoginPage } from "./pages/LoginUsuario";
import { DashboardUsuario } from "./pages/DashboardUsuario";
import { AdminLoginPage } from "./pages/LoginAdmin";
import { DashboardAdmin } from "./pages/DashboardAdmin";

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [user, setUser] = useState<AppUser | null>(null);
  const navigate = (nextPage: Page) => setPage(nextPage);

  return (
    <div className="font-[Inter,sans-serif]">
      {page === "home" && <HomePage navigate={navigate} />}
      {page === "cadastro" && <CadastroPage navigate={navigate} />}
      {page === "login" && <LoginPage navigate={navigate} onLogin={(loggedUser) => { setUser(loggedUser); navigate("dashboard"); }} />}
      {page === "dashboard" && <DashboardUsuario navigate={navigate} user={user} onUserUpdate={setUser} onLogout={() => { setUser(null); navigate("home"); }} />}
      {page === "admin-login" && <AdminLoginPage navigate={navigate} />}
      {page === "admin" && <DashboardAdmin navigate={navigate} />}
    </div>
  );
}
