import { useState } from "react";
import { CheckCircle, ChevronDown, ChevronRight, DollarSign, FileText, Hammer, Paperclip, Phone, Send, Star, Upload, XCircle, Clock, MapPin } from "lucide-react";
import type { Mensagem, Prof } from "../../types/types";
import { btnBlueW, Field, fileClass, inputClass, ModalHeader, RatingStars } from "../../components/shared/others";
import { extraProfessions, mensagensData, professionalsData } from "../../data/data";


// Modal Saiba Mais - Abrir perfil do Profissional - Página do Usuario Logado
export function SaibaMaisModal({ prof, onClose, onContratar }: { prof: Prof; onClose: () => void; onContratar: (() => void) | null }) {
	return <><ModalHeader title="Perfil Profissional" onClose={onClose} />
		<div className="px-7 py-6 flex flex-col gap-5">
			<div className="flex items-start gap-4">
				<div className="w-16 h-16 rounded-2xl bg-[#1D4ED8] text-white flex items-center justify-center text-2xl font-bold">
					{prof.name.charAt(0)}
				</div>
				<div className="flex-1"><h3 className="text-xl font-bold text-gray-900">{prof.name}</h3>
					<p className="text-[#1D4ED8] font-medium text-sm">{prof.profession}</p>
					<div className="flex items-center gap-2 mt-1.5">
						<RatingStars rating={prof.rating} size="md" />{prof.rating.toFixed(1)}
					</div>
				</div>
			</div>
			<div className="grid grid-cols-3 gap-3">
				{[[Clock, "Experiência", `${prof.years} anos`], [MapPin, "Cidade", prof.city], [Phone, "Telefone", prof.phone]].map(([Icon, label, value]) => <div key={String(label)} className="bg-[#F9FAFB] border border-gray-200 rounded-xl p-3"><Icon className="w-4 h-4 text-[#1D4ED8] mb-1" />
					<p className="text-xs text-gray-400">{String(label)}</p>
					<p className="text-sm font-semibold text-gray-800">{String(value)}</p>
				</div>)}</div><p className="text-sm text-gray-600 leading-relaxed bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">{prof.summary}</p>
			{onContratar ? <button onClick={onContratar} className={btnBlueW}>
				<Hammer className="w-4 h-4" />Contratar</button> : <p className="text-center text-xs text-gray-500">Para contratar este profissional é necessário fazer login.</p>}
		</div>
	</>;
}


// Modal de Contratar o Profissional - Página do Usuario Logado
export function ContratarModal({ prof, onClose }: { prof: Prof; onClose: () => void }) {
	const [orcamento, setOrcamento] = useState(false);

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		onClose();
	};

	return (
		<>
			<ModalHeader title={`Contratar - ${prof.name}`} onClose={onClose} />
			<form className="px-7 py-6 flex flex-col gap-5" onSubmit={handleSubmit}>
				<Field label="Breve descrição do serviço">
					<textarea className={`${inputClass} resize-none h-28`} />
				</Field>
				<Field label="Anexar foto do local / problema">
					<label className={fileClass}>
						<Upload className="w-4 h-4" />
						Clique para selecionar uma foto
						<input type="file" className="hidden" />
					</label>
				</Field>
				<Field label="Data desejada para o serviço">
					<input type="date" className={inputClass} />
				</Field>
				<label className="flex items-center gap-3 bg-[#EFF6FF] border border-[#DBEAFE] rounded-xl px-4 py-4 text-sm">
					<input
						type="checkbox"
						checked={orcamento}
						onChange={(event) => setOrcamento(event.target.checked)}
					/>
					Solicitar orçamento primeiro
				</label>
				<button type="submit" className={btnBlueW}>
					<Send className="w-4 h-4" />
					Enviar solicitação
				</button>
			</form>
		</>
	);
}


// Modal Cadastro Profissional - Página do Usuario Logado
export function CadastroProfModal({ onClose }: { onClose: () => void }) {
	const [extras, setExtras] = useState<string[]>([]);
	const [profession, setProfession] = useState("");
	const [years, setYears] = useState("");
	const [summary, setSummary] = useState("");

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		localStorage.setItem("labuta-professional-data", JSON.stringify({ profession, years, extras, summary }));
		onClose();
	};

	return <><ModalHeader title="Cadastro Profissional" onClose={onClose} /><form className="px-7 py-6 flex flex-col gap-5" onSubmit={handleSubmit}><div className="grid grid-cols-2 gap-4"><Field label="Profissão principal"><input value={profession} onChange={(e) => setProfession(e.target.value)} className={inputClass} required /></Field><Field label="Anos de experiência"><input type="number" value={years} onChange={(e) => setYears(e.target.value)} className={inputClass} required /></Field></div><Field label="Outras profissões / funções"><div className="bg-[#F9FAFB] border border-gray-200 rounded-xl p-4 grid grid-cols-2 gap-y-3">{extraProfessions.map((p) => <label key={p} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={extras.includes(p)} onChange={() => setExtras((v) => v.includes(p) ? v.filter((x) => x !== p) : [...v, p])} />{p}</label>)}</div></Field><Field label="Resumo de experiência"><textarea value={summary} onChange={(e) => setSummary(e.target.value)} className={`${inputClass} resize-none h-24`} required /></Field><button type="submit" className={btnBlueW}><Send className="w-4 h-4" />Enviar Cadastro</button></form></>;
}


const tipoConfig = {
	orcamento: {
		label: "Orçamento",
		color: "text-amber-700",
		bg: "bg-amber-50 border-amber-200",
		icon: <DollarSign className="w-3.5 h-3.5" />,
	},
	servico: {
		label: "Serviço",
		color: "text-blue-700",
		bg: "bg-blue-50 border-blue-200",
		icon: <FileText className="w-3.5 h-3.5" />,
	},
	avaliacao_cliente: {
		label: "Avaliação",
		color: "text-green-700",
		bg: "bg-green-50 border-green-200",
		icon: <Star className="w-3.5 h-3.5" />,
	},
} as const;


// Modal Caixa de Mensagens - Página do Usuario Logado
export function MensagensModal({ onClose }: { onClose: () => void }) {
	const [mensagens, setMensagens] = useState<Mensagem[]>(mensagensData);
	const [selecionada, setSelecionada] = useState<Mensagem | null>(null);
	const [decisao, setDecisao] = useState<"aceitar" | "recusar" | "">("");
	const [valor, setValor] = useState("");
	const [fileName, setFileName] = useState("");

	const naoLidas = mensagens.filter((m) => !m.lida).length;
	const precisaResposta = selecionada && (selecionada.tipo === "orcamento" || selecionada.tipo === "servico");

	const abrirMensagem = (msg: Mensagem) => {
		setMensagens((prev) => prev.map((m) => m.id === msg.id ? { ...m, lida: true } : m));
		setSelecionada({ ...msg, lida: true });
		setDecisao(""); setValor(""); setFileName("");
	};

	const voltar = () => { setSelecionada(null); setDecisao(""); setValor(""); setFileName(""); };

	return (
		<>
			<ModalHeader
				title={selecionada ? "Mensagem" : `Caixa de Mensagens${naoLidas > 0 ? ` (${naoLidas} não lidas)` : ""}`}
				onClose={onClose}
			/>
			{!selecionada ? (
				<div className="divide-y divide-gray-100">
					{mensagens.map((msg) => {
						const cfg = tipoConfig[msg.tipo];
						return (
							<button key={msg.id} onClick={() => abrirMensagem(msg)} className={`w-full text-left px-6 py-4 hover:bg-[#EFF6FF] transition-colors flex items-start gap-4 ${!msg.lida ? "bg-blue-50/40" : ""}`}>
								<div className="w-10 h-10 rounded-full bg-[#1D4ED8] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
									{msg.remetente.charAt(0)}
								</div>
								<div className="flex-1 min-w-0">
									<div className="flex items-center justify-between gap-2 mb-1">
										<span className={`text-sm font-semibold truncate ${!msg.lida ? "text-gray-900" : "text-gray-700"}`}>{msg.remetente}</span>
										<span className="text-xs text-gray-400 flex-shrink-0">{msg.hora} · {msg.data}</span>
									</div>
									<div className="flex items-center gap-2 mb-1">
										<span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.color}`}>{cfg.icon}{cfg.label}</span>
										{!msg.lida && <span className="w-2 h-2 rounded-full bg-[#1D4ED8] flex-shrink-0" />}
									</div>
									<p className="text-xs text-gray-500 truncate">{msg.preview}</p>
								</div>
								<ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0 mt-3" />
							</button>
						);
					})}
				</div>
			) : (
				<div className="flex flex-col">
					<div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
						<button onClick={voltar} className="text-sm text-[#1D4ED8] font-medium hover:underline">← Voltar</button>
						<span className="text-gray-300">|</span>
						<div className="flex items-center gap-2">
							<div className="w-8 h-8 rounded-full bg-[#1D4ED8] text-white flex items-center justify-center text-xs font-bold">
								{selecionada.remetente.charAt(0)}
							</div>
							<div>
								<p className="text-sm font-semibold text-gray-900">
									{selecionada.remetente} · {selecionada.telefone}
								</p>
								<p className="text-xs text-gray-400">{selecionada.hora} · {selecionada.data}</p>
							</div>
						</div>
						<span className={`ml-auto inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border ${tipoConfig[selecionada.tipo].bg} ${tipoConfig[selecionada.tipo].color}`}>
							{tipoConfig[selecionada.tipo].icon}
							{tipoConfig[selecionada.tipo].label}
						</span>
					</div>
					<div className="px-6 py-5">
						<div className="flex items-start gap-3">
							<div className="w-9 h-9 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
								{selecionada.remetente.charAt(0)}
							</div>
							<div className="bg-gray-100 rounded-2xl rounded-tl-none px-4 py-3 max-w-sm">
								<p className="text-sm text-gray-800 leading-relaxed">{selecionada.conteudo}</p>
							</div>
						</div>
						{selecionada.tipo === "avaliacao_cliente" && selecionada.nota && (
							<div className="mt-4 ml-12 flex items-center gap-2">
								<RatingStars rating={selecionada.nota} size="md" />
								<span className="text-xs text-gray-500">{selecionada.nota}/5</span>
							</div>
						)}
						{selecionada.tipo === "avaliacao_cliente" && (
							<div className="mt-5 ml-12 bg-green-50 border border-green-100 rounded-xl px-4 py-3 flex items-center gap-2">
								<CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
								<p className="text-xs text-green-700">Esta é uma avaliação do cliente. Nenhuma resposta é necessária.</p>
							</div>
						)}
					</div>
					{precisaResposta && (
						<form onSubmit={(e) => e.preventDefault()} className="border-t border-gray-100 px-6 py-5 flex flex-col gap-4 bg-gray-50/50">
							<p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Sua resposta ao cliente</p>
							<div className="flex flex-col gap-2">
								<label className="text-sm font-medium text-gray-700">Decisão sobre o serviço</label>
								<div className="flex gap-3">
									{[
										{ val: "aceitar" as const, label: "Aceitar", Icon: CheckCircle, active: "border-[#1D4ED8] bg-[#EFF6FF]", activeText: "text-[#1D4ED8]", activeIcon: "text-[#1D4ED8]" },
										{ val: "recusar" as const, label: "Não aceitar", Icon: XCircle, active: "border-red-400 bg-red-50", activeText: "text-red-600", activeIcon: "text-red-500" },
									].map(({ val, label, Icon, active, activeText, activeIcon }) => (
										<label key={val} className={`flex-1 flex items-center gap-2.5 border rounded-xl px-4 py-3 cursor-pointer select-none transition-all ${decisao === val ? active : "border-gray-200 bg-white hover:border-gray-300"}`}>
											<input type="radio" name="decisao" value={val} checked={decisao === val} onChange={() => setDecisao(val)} className="w-4 h-4 accent-[#1D4ED8]" />
											<Icon className={`w-4 h-4 ${decisao === val ? activeIcon : "text-gray-400"}`} />
											<span className={`text-sm font-medium ${decisao === val ? activeText : "text-gray-700"}`}>{label}</span>
										</label>
									))}
								</div>
							</div>
							{decisao === "aceitar" && (
								<>
									<div className="flex flex-col gap-1.5">
										<label className="text-sm font-medium text-gray-700">Valor do serviço (R$)</label>
										<div className="relative">
											<span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">R$</span>
											<input type="number" min={0} step="0.01" value={valor} onChange={(e) => setValor(e.target.value)} className={`${inputClass} pl-9`} placeholder="0,00" />
										</div>
									</div>
									<div className="flex flex-col gap-1.5">
										<label className="text-sm font-medium text-gray-700">Anexar arquivo (opcional)</label>
										<label className={fileClass}>
											<Paperclip className="w-4 h-4 text-gray-400" />
											<span className="truncate">{fileName || "Clique para anexar orçamento em PDF ou imagem"}</span>
											<input type="file" accept=".pdf,image/*" className="hidden" onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")} />
										</label>
									</div>
								</>
							)}
							<button type="submit" disabled={!decisao} className={btnBlueW}>
								<Send className="w-4 h-4" />
								Responder ao Cliente
							</button>
						</form>
					)}
				</div>
			)}
		</>
	);
}


// Modal Avaliação do Profissional - Página do Usuario Logado
export function AvaliacaoModal({ onClose }: { onClose: () => void }) {
	const [selected, setSelected] = useState<number | null>(null);
	const [nota, setNota] = useState("");
	const prof = professionalsData.find((p) => p.id === selected);

	return (
		<>
			<ModalHeader title="Avaliação do Profissional" onClose={onClose} />
			<form className="px-7 py-6 flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
				<Field label="Selecione o prestador de serviço">
					<div className="relative">
						<select className={`${inputClass} appearance-none pr-10`} value={selected ?? ""} onChange={(e) => setSelected(Number(e.target.value) || null)}>
							<option value="">— Escolha um profissional —</option>
							{professionalsData.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
						</select>
						<ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
					</div>
				</Field>
				<Field label="Profissão">
					<input type="text" className={`${inputClass} text-gray-500`} value={prof?.profession ?? ""} readOnly placeholder="Preenchido automaticamente" />
				</Field>
				<Field label="Nota do serviço prestado">
					<div className="bg-[#F9FAFB] border border-gray-200 rounded-xl px-5 py-4 flex flex-col gap-3">
						{[{ val: "5", label: "Excelente" }, { val: "4", label: "Muito bom" }, { val: "3", label: "Bom" }, { val: "2", label: "Regular" }, { val: "1", label: "Ruim" }].map(({ val, label }) => (
							<label key={val} className="flex items-center gap-3 cursor-pointer select-none">
								<input type="radio" name="nota" value={val} checked={nota === val} onChange={() => setNota(val)} className="w-4 h-4 accent-[#1D4ED8]" />
								<div className="flex items-center gap-2">
									<RatingStars rating={Number(val)} />
									<span className="text-sm text-gray-700 font-medium">{label}</span>
								</div>
							</label>
						))}
					</div>
				</Field>
				<Field label="Descrição da avaliação">
					<textarea className={`${inputClass} resize-none h-24`} placeholder="Compartilhe sua experiência com este profissional..." />
				</Field>
				<button type="submit" className={btnBlueW}>
					<Send className="w-4 h-4" />
					Enviar Avaliação
				</button>
			</form>
		</>
	);
}