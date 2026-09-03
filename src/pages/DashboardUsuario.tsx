import { useState } from "react";
import { Briefcase, ChevronDown, Hammer, LogOut, MessageSquare, Settings, Star, User } from "lucide-react";
import type { AppUser, DashModal, Page, Prof, UserRole } from "../types/types";
import { btnBlueW, Field, inputClass, ModalHeader, ModalOverlay, ProfessionalsSection } from "../components/shared/others";
import { AvaliacaoModal, CadastroProfModal, ContratarModal, MensagensModal, SaibaMaisModal } from "./modals/modals";

// Página Dashboard - Página do Usuário Logado
export function DashboardUsuario({ navigate, user, onLogout, onUserUpdate }: { navigate: (p: Page) => void; user: AppUser | null; onLogout: () => void; onUserUpdate: (updatedUser: AppUser) => void }) {
  const [dashModal, setDashModal] = useState<DashModal>(null);
  const [selectedProf, setSelectedProf] = useState<Prof | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(() => {
    const savedRole = localStorage.getItem("labuta-user-role");
    return savedRole === "professional" ? "professional" : "client";
  });
  const [dropOpen, setDropOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editError, setEditError] = useState("");
  const [editForm, setEditForm] = useState(() => ({ name: user?.name ?? "", email: user?.email ?? "", phone: user?.phone ?? "", city: user?.city ?? "", password: user?.password ?? "", role: user?.role ?? (localStorage.getItem("labuta-user-role") === "professional" ? "professional" : "client") as UserRole }));
  const canRegisterAsProfessional = userRole === "professional";

  const closeModal = () => { setDashModal(null); setSelectedProf(null); };
  const openSaibaMais = (p: Prof) => { setSelectedProf(p); setDashModal("saiba-mais"); };
  const openContratar = () => setDashModal("contratar");
  const updateEditField = (field: keyof typeof editForm, value: string) => setEditForm((current) => ({ ...current, [field]: value }));
  const updateEditPhone = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    const masked = digits.length <= 2 ? `(${digits}` : `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}${digits.length > 7 ? `-${digits.slice(7)}` : ""}`;
    updateEditField("phone", masked);
  };
  const saveAccount = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (Object.values(editForm).some((value) => !String(value).trim())) { setEditError("Preencha todos os campos."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email)) { setEditError("Digite um e-mail válido."); return; }
    if (editForm.phone.replace(/\D/g, "").length !== 11) { setEditError("Digite um telefone celular com 11 números."); return; }
    const updatedUser: AppUser = { ...editForm };
    localStorage.setItem("labuta-user", JSON.stringify(updatedUser));
    localStorage.setItem("labuta-user-role", editForm.role);
    onUserUpdate(updatedUser);
    setUserRole(editForm.role);
    setEditError("");
    setEditOpen(false);
  };

  const featureCards = [
    { key: "cadastro-prof" as DashModal, label: "Cadastro Profissional", desc: "Cadastre-se como prestador de serviço.", icon: <Briefcase className="w-5 h-5" />, badge: 0 },
    { key: "mensagens" as DashModal, label: "Caixa de Mensagens", desc: "Veja suas mensagens e solicitações.", icon: <MessageSquare className="w-5 h-5" />, badge: 2 },
    { key: "avaliacao" as DashModal, label: "Avaliar Profissional", desc: "Avalie o serviço que você contratou.", icon: <Star className="w-5 h-5" />, badge: 0 },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">

      {/* Nav Header Cabeçalho */}
      <header className="bg-[#f6f6f6] text-white shadow-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

          <div className="flex items-center gap-2">
            {/* Imagem para Computador (Desktop) - Aparece em telas md (médias) ou maiores */}
            <img
              src="/logo-labuta.png"
              alt="Labuta"
              className="w-45 hidden md:block"
            />

            {/* Imagem para Smartphone (Mobile) - Aparece apenas em telas menores que md */}
            <img
              src="/favicon.ico"
              alt="Labuta"
              className="block md:hidden"
            />
            <span className="text-xl text-[#1D4ED8] font-bold tracking-tight md:hidden">Labuta</span>
          </div>

          <div className="relative">
            <button
              onClick={() => setDropOpen(!dropOpen)}
              className="flex items-center gap-2 bg-[#2257e8] hover:bg-[#1D4ED8] rounded-xl px-4 py-2 transition-colors"
            >
              <span className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
              <div className="w-6 h-6 rounded-full bg-white text-[#1D4ED8] flex items-center justify-center text-xs font-bold">
                {user?.name?.charAt(0) ?? "U"}
              </div>
              <span className="text-sm font-medium">{user?.name ?? "Usuário"}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${dropOpen ? "rotate-180" : ""}`} />
            </button>
            {dropOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setDropOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-40">
                  <button onClick={() => { setEditForm({ name: user?.name ?? "", email: user?.email ?? "", phone: user?.phone ?? "", city: user?.city ?? "", password: user?.password ?? "", role: userRole }); setEditError(""); setEditOpen(true); setDropOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                    <Settings className="w-4 h-4 text-gray-400" />
                    Editar sua conta
                  </button>
                  <div className="border-t border-gray-100 my-1" />
                  <button onClick={() => { setDropOpen(false); onLogout(); }} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer">
                    <LogOut className="w-4 h-4" />
                    Sair
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-10">

        <div className="mb-8">
          <p className="text-sm">Responsável pelo desenvolvimento dessa página, cards, funcionalidades:</p>
          <p className="text-sm text-blue-600">Ramnsés</p>
          <br/>
          <p className="text-sm">Responsável pelos modais nessa página (Cadastro do Perfil Profissional, Contratar o Profissional, Avaliação do Serviço):</p>
          <p className="text-sm text-blue-600">Fabio, David</p>
        </div>
      </main>
    </div>
  );
}