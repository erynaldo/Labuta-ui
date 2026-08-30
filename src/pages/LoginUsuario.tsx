import { useState } from "react";
import type { AppUser, Page } from "../types/types";
import { btnBlueW, Field, inputClass, ModalHeader, ModalOverlay } from "../components/shared/others";
import { PublicNav } from "../components/shared/header";
import { SiteFooter } from "../components/shared/footer";


// Página de Login do Usuário
export function LoginPage({ navigate, onLogin }: { navigate: (p: Page) => void; onLogin: (u: AppUser) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [recoveryOpen, setRecoveryOpen] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoveryMessage, setRecoveryMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError("Preencha todos os campos."); return; }
    const namePart = email.split("@")[0].replace(/[._-]/g, " ");
    const name = namePart.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");


    const savedUser = JSON.parse(localStorage.getItem("labuta-user") ?? "null") as AppUser | null;
    const validSavedUser = savedUser && savedUser.email === email && savedUser.password === password;

    if (validSavedUser || (email === "usuario@email.com" && password === "123789")) {
      onLogin(savedUser ?? { name, email, role: "client" });
    } else {
      setError("Credenciais inválidas. Tente novamente.");
    }

    // onLogin({ name, email });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <PublicNav navigate={navigate} />
      <main className="flex-1 flex items-center justify-center px-4 py-16 bg-gray-50">
        <div className="bg-white rounded-2xl shadow-[0_2px_32px_rgba(0,0,0,0.10)] w-full max-w-sm p-8">
          <div className="mb-7">
            <div className="flex items-center justify-center gap-2 mb-1">
              <img src="public/favicon-32.png" alt="Labuta" className="w-7" />
              <span className="text-1xs font-bold text-[#1D4ED8] uppercase tracking-wide">Labuta</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mt-2">Entrar</h2>
            <p className="text-sm text-gray-500 mt-1">Acesse sua conta.</p>
          </div>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <span className="text-sm">Responsável pelo desenvolvimento do formulário de login e janela modal de recuperar senha:</span>
            <span className="text-sm text-blue-600">Vanessa</span>
            <button
              onClick={() => navigate("dashboard")}
              className="bg-[#1D4ED8] text-white text-sm font-medium border px-4 py-2 rounded-lg hover:bg-[#0d3cbe] transition-colors cursor-pointer"
            >
              Entrar
            </button>
          </form>
        </div>
      </main>
      <SiteFooter navigate={navigate} />
      {recoveryOpen && <ModalOverlay onClose={() => setRecoveryOpen(false)}><ModalHeader title="Recuperar senha" onClose={() => setRecoveryOpen(false)} /><form className="px-7 py-6 flex flex-col gap-4" onSubmit={(event) => { event.preventDefault(); if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recoveryEmail)) { setRecoveryMessage("Digite um e-mail válido."); return; } setRecoveryMessage("Se o e-mail estiver cadastrado, enviaremos as instruções para recuperar sua senha."); }}><Field label="E-mail"><input type="email" value={recoveryEmail} onChange={(event) => setRecoveryEmail(event.target.value)} className={inputClass} placeholder="seu@email.com" required /></Field>{recoveryMessage && <p role="status" className="text-xs text-green-700 bg-green-50 border border-green-100 rounded-lg px-3 py-2">{recoveryMessage}</p>}<button type="submit" className={btnBlueW}>Recuperar senha</button></form></ModalOverlay>}
    </div>
  );
}