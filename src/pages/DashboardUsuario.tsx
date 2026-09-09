import { useState } from "react";
import { Briefcase, ChevronDown, ClipboardList, Hammer, LogOut, MapPin, MessageSquare, Search, Settings, Star, User } from "lucide-react";
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
        <section className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-[#1D4ED8]">Área do usuário</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">Olá, {user?.name?.split(" ")[0] ?? "usuário"}!</h1>
            <p className="mt-2 text-sm text-gray-500">Encontre profissionais confiáveis para resolver o que você precisa.</p>
          </div>
          <div className="flex items-center gap-2 self-start rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 sm:self-auto">
            <span className="h-2 w-2 rounded-full bg-green-500" /> Conta ativa
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3" aria-label="Resumo da conta">
          {[
            { label: "Profissionais disponíveis", value: "4", icon: <User className="h-5 w-5" /> },
            { label: "Solicitações abertas", value: "1", icon: <ClipboardList className="h-5 w-5" /> },
            { label: "Mensagens não lidas", value: "2", icon: <MessageSquare className="h-5 w-5" /> },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#1D4ED8]">{item.icon}</div>
              <div><p className="text-2xl font-bold text-gray-900">{item.value}</p><p className="text-xs text-gray-500">{item.label}</p></div>
            </div>
          ))}
        </section>

        <section className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3" aria-label="Ações rápidas">
          {featureCards.map((card) => (
            <button key={card.key} onClick={() => setDashModal(card.key)} className="group flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1D4ED8] text-white">{card.icon}</div>
              <div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-2"><h2 className="text-sm font-semibold text-gray-900">{card.label}</h2>{card.badge > 0 && <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-600">{card.badge}</span>}</div><p className="mt-1 text-xs leading-relaxed text-gray-500">{card.desc}</p><span className="mt-3 inline-block text-xs font-semibold text-[#1D4ED8] group-hover:underline">Abrir</span></div>
            </button>
          ))}
        </section>

        <section className="mt-10" >
          <div className="mb-5 flex items-center justify-between gap-4"><div><h2 className="text-xl font-bold text-gray-900">Encontre um profissional</h2><p className="mt-1 text-sm text-gray-500">Compare avaliações, experiência e disponibilidade.</p></div><Search className="hidden h-5 w-5 text-gray-300 sm:block" /></div>
          <ProfessionalsSection onSaibaMais={openSaibaMais} />
        </section>
      </main>

      {dashModal && (
        <ModalOverlay onClose={closeModal} wide={dashModal === "mensagens"}>
          {dashModal === "saiba-mais" && selectedProf && <SaibaMaisModal prof={selectedProf} onClose={closeModal} onContratar={openContratar} />}
          {dashModal === "contratar" && selectedProf && <ContratarModal prof={selectedProf} onClose={closeModal} />}
          {dashModal === "cadastro-prof" && <CadastroProfModal onClose={closeModal} />}
          {dashModal === "mensagens" && <MensagensModal onClose={closeModal} />}
          {dashModal === "avaliacao" && <AvaliacaoModal onClose={closeModal} />}
        </ModalOverlay>
      )}

      {editOpen && (
        <ModalOverlay onClose={() => setEditOpen(false)}>
          <ModalHeader title="Editar sua conta" onClose={() => setEditOpen(false)} />
          <form className="flex flex-col gap-4 px-7 py-6" onSubmit={saveAccount}>
            {editError && <p className="rounded-lg border border-red-200 bg-red-50 p-2 text-center text-xs text-red-600">{editError}</p>}
            <Field label="Nome completo"><input className={inputClass} value={editForm.name} onChange={(event) => updateEditField("name", event.target.value)} /></Field>
            <Field label="E-mail"><input type="email" className={inputClass} value={editForm.email} onChange={(event) => updateEditField("email", event.target.value)} /></Field>
            <Field label="Telefone"><input className={inputClass} value={editForm.phone} onChange={(event) => updateEditPhone(event.target.value)} placeholder="(00) 00000-0000" /></Field>
            <Field label="Cidade"><input className={inputClass} value={editForm.city} onChange={(event) => updateEditField("city", event.target.value)} /></Field>
            <Field label="Senha"><input type="password" className={inputClass} value={editForm.password} onChange={(event) => updateEditField("password", event.target.value)} /></Field>
            <Field label="Quero atuar como"><select className={`${inputClass} bg-white`} value={editForm.role} onChange={(event) => updateEditField("role", event.target.value)}><option value="client">Contratante</option><option value="professional">Prestador de serviço</option></select></Field>
            <button type="submit" className={btnBlueW}><Settings className="h-4 w-4" />Salvar alterações</button>
          </form>
        </ModalOverlay>
      )}
    </div>
  );
}