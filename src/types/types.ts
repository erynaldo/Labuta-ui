export type Page = "home" | "cadastro" | "login" | "dashboard" | "admin-login" | "admin";
export type DashModal = "saiba-mais" | "contratar" | "cadastro-prof" | "mensagens" | "avaliacao" | null;
export type AdminTab = "usuarios" | "profissionais" | "solicitacoes" | "auditoria";
export type MsgType = "orcamento" | "servico" | "avaliacao_cliente";
export type UserRole = "client" | "professional";

export interface Prof { id: number; name: string; profession: string; years: number; city: string; phone: string; available: boolean; summary: string; rating: number; }
export interface AppUser { name: string; email: string; phone?: string; city?: string; password?: string; role?: UserRole; }
export interface AdminUser { id: number; name: string; email: string; phone: string; city: string; role: "client" | "professional"; status: "active" | "banned"; joinDate: string; }
export interface ServiceRequest { id: number; client: string; professional: string; type: string; date: string; status: "Pendente" | "Aceito" | "Concluído" | "Recusado"; }
export interface AuditItem { id: number; user: string; action: string; date: string; flagged: boolean; resolved: boolean; }
export interface Mensagem { id: number; tipo: MsgType; remetente: string; telefone: string; data: string; hora: string; preview: string; conteudo: string; lida: boolean; nota?: number; }
