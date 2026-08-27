import { useState } from "react";
import { AlertTriangle, Ban, CheckCircle, Eye, FileText, LogOut, Shield, UserCheck, Users } from "lucide-react";
import type { AdminTab, AdminUser, AuditItem, Page } from "../types/types";
import { initialAdminUsers, initialAuditItems, professionalsData, serviceRequestsData } from "../data/data";
import { AvailBadge, RatingStars } from "../components/shared/others";

// Página Dashboard do Administrador
export function DashboardAdmin({ navigate }: { navigate: (p: Page) => void }) {
  const [tab, setTab] = useState<AdminTab>("usuarios");
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(initialAdminUsers);
  const [auditItems, setAuditItems] = useState<AuditItem[]>(initialAuditItems);

  const toggleBan = (id: number) =>
    setAdminUsers((prev) => prev.map((u) => u.id === id ? { ...u, status: u.status === "active" ? "banned" : "active" } : u));

  const resolveFlag = (id: number) =>
    setAuditItems((prev) => prev.map((a) => a.id === id ? { ...a, flagged: false, resolved: true } : a));

  const stats = [
    { label: "Usuários totais", value: adminUsers.length, icon: <Users className="w-5 h-5" />, red: false },
    { label: "Profissionais", value: adminUsers.filter((u) => u.role === "professional").length, icon: <UserCheck className="w-5 h-5" />, red: false },
    { label: "Solicitações", value: serviceRequestsData.length, icon: <FileText className="w-5 h-5" />, red: false },
    { label: "Sinalizados", value: auditItems.filter((a) => a.flagged).length, icon: <AlertTriangle className="w-5 h-5" />, red: true },
  ];

  const tabs: { key: AdminTab; label: string; icon: React.ReactNode }[] = [
    { key: "usuarios", label: "Usuários", icon: <Users className="w-4 h-4" /> },
    { key: "profissionais", label: "Profissionais", icon: <UserCheck className="w-4 h-4" /> },
    { key: "solicitacoes", label: "Solicitações", icon: <FileText className="w-4 h-4" /> },
    { key: "auditoria", label: "Auditoria", icon: <Shield className="w-4 h-4" /> },
  ];

  const statusColor: Record<string, string> = {
    "Pendente": "bg-amber-50 text-amber-700 border-amber-200",
    "Aceito": "bg-green-50 text-green-700 border-green-200",
    "Concluído": "bg-blue-50 text-blue-700 border-blue-200",
    "Recusado": "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-gray-900 text-white border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-blue-400" />
            <span className="font-bold text-base">Labuta Admin</span>
            <span className="text-xs bg-blue-900/60 text-blue-300 border border-blue-800 px-2 py-0.5 rounded-full">Painel administrativo</span>
          </div>
          <button onClick={() => navigate("home")} className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer">
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4 shadow-sm">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.red ? "bg-red-50 text-red-500" : "bg-blue-50 text-[#1D4ED8]"}`}>
                {s.icon}
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{s.value}</div>
                <div className="text-xs text-gray-500">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${tab === t.key ? "border-[#1D4ED8] text-[#1D4ED8] bg-blue-50/50" : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>

          {/* Users */}
          {tab === "usuarios" && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[700px]">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {["#", "Nome", "E-mail", "Cidade", "Tipo", "Status", "Desde", "Ações"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {adminUsers.map((u) => (
                    <tr key={u.id} className={`hover:bg-gray-50 transition-colors ${u.status === "banned" ? "opacity-60" : ""}`}>
                      <td className="px-4 py-3 text-gray-400 text-xs">{u.id}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{u.name}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{u.email}</td>
                      <td className="px-4 py-3 text-gray-500">{u.city}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${u.role === "professional" ? "bg-purple-50 text-purple-700 border-purple-200" : "bg-blue-50 text-blue-700 border-blue-200"}`}>
                          {u.role === "professional" ? "Profissional" : "Cliente"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${u.status === "active" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${u.status === "active" ? "bg-green-500" : "bg-red-500"}`} />
                          {u.status === "active" ? "Ativo" : "Banido"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{u.joinDate}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <button className="w-16 border border-gray-300 rounded-md px-2 py-1 text-xs bg-blue-300 text-blue-800 hover:text-black flex items-center gap-1 transition-colors font-bold">
                            <Eye className="w-3.5 h-3.5" /> Ver
                          </button>
                          <button
                            onClick={() => toggleBan(u.id)}
                            className={`w-20 border border-gray-300 rounded-md px-2 py-1 text-xs flex items-center gap-1 transition-colors font-bold ${u.status === "active" ? "text-red-500 hover:text-red-700 bg-red-300" : "text-black bg-green-300"}`}
                          >
                            <Ban className="w-3.5 h-3.5" />
                            {u.status === "active" ? "Banir" : "Desbanir"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Professionals */}
          {tab === "profissionais" && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[600px]">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {["#", "Nome", "Profissão", "Cidade", "Avaliação", "Status", "Ações"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {professionalsData.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-gray-400 text-xs">{p.id}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>
                      <td className="px-4 py-3 text-gray-600">{p.profession}</td>
                      <td className="px-4 py-3 text-gray-500">{p.city}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <RatingStars rating={p.rating} />
                          <span className="text-xs text-gray-500">{p.rating}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <AvailBadge available={p.available} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <button className="border rounded-md px-2 py-1 text-xs bg-blue-300 text-blue-800 hover:text-black flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5" /> Auditar
                          </button>
                          <button className="border rounded-md px-2 py-1 text-xs bg-amber-200 text-amber-700 hover:text-black flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" /> Sinalizar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Requests */}
          {tab === "solicitacoes" && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[600px]">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {["#", "Cliente", "Profissional", "Tipo", "Data", "Status", "Ações"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {serviceRequestsData.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-gray-400 text-xs">{r.id}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{r.client}</td>
                      <td className="px-4 py-3 text-gray-600">{r.professional}</td>
                      <td className="px-4 py-3 text-gray-500">{r.type}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{r.date}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${statusColor[r.status]}`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button className="border rounded-md px-2 py-1 text-xs bg-blue-300 text-blue-800 hover:text-black flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" /> Detalhes
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Audit */}
          {tab === "auditoria" && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[640px]">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {["#", "Usuário", "Ação registrada", "Data / Hora", "Status", "Ações"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {auditItems.map((a) => (
                    <tr key={a.id} className={`hover:bg-gray-50 transition-colors ${a.flagged ? "bg-red-50/30" : ""}`}>
                      <td className="px-4 py-3 text-gray-400 text-xs">{a.id}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{a.user}</td>
                      <td className="px-4 py-3 text-gray-600 max-w-[200px] truncate">{a.action}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{a.date}</td>
                      <td className="px-4 py-3">
                        {a.resolved ? (
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full border bg-green-50 text-green-700 border-green-200">Resolvido</span>
                        ) : a.flagged ? (
                          <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border bg-red-50 text-red-700 border-red-200">
                            <AlertTriangle className="w-3 h-3" /> Sinalizado
                          </span>
                        ) : (
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full border bg-gray-100 text-gray-600 border-gray-200">Normal</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {a.flagged && !a.resolved && (
                          <button onClick={() => resolveFlag(a.id)} className="border rounded-md px-2 py-1 text-xs bg-blue-300 text-blue-800 hover:text-black flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" /> Resolver
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}