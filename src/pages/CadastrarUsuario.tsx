import { useState } from "react";
import type { Page } from "../types/types";
import { btnBlueW, Field, inputClass } from "../components/shared/others";
import { PublicNav } from "../components/shared/header";
import { SiteFooter } from "../components/shared/footer";

// Página de Cadastro do Usuário
export function CadastroPage({ navigate }: { navigate: (p: Page) => void }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", city: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
    setSuccess("");
  };

  const handlePhoneChange = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    const masked = digits.length <= 2 ? `(${digits}` : `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}${digits.length > 7 ? `-${digits.slice(7)}` : ""}`;
    updateField("phone", masked);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (Object.values(form).some((value) => !value.trim())) {
      setError("Preencha todos os campos.");
      return;
    }
    if (form.name.trim().split(/\s+/).length < 2) {
      setError("Digite seu nome completo, incluindo nome e sobrenome.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Digite um e-mail válido.");
      return;
    }
    if (form.password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Os campos Senha e Confirmar senha estão diferentes.");
      return;
    }
    if (!/^\(\d{2}\) 9\d{4}-\d{4}$/.test(form.phone)) {
      setError("Digite o número completo do celular no formato (00) 90000-0000.");
      return;
    }

    const user = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      city: form.city,
      password: form.password,
      role: "client" as const,
    };

    localStorage.setItem("labuta-user", JSON.stringify(user));
    localStorage.setItem("labuta-user-role", "client");
    setError("");
    setForm({ name: "", email: "", phone: "", city: "", password: "", confirmPassword: "" });
    setSuccess("Cadastro realizado com sucesso");
    window.setTimeout(() => navigate("login"), 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <PublicNav navigate={navigate} />
      <main className="flex-1 flex items-center justify-center px-4 py-16 bg-gray-50">
        <div className="bg-white rounded-2xl shadow-[0_2px_32px_rgba(0,0,0,0.10)] w-full max-w-md p-8">
          <div className="mb-7">
            <div className="flex items-center justify-center gap-2 mb-1">
              {/* <Hammer className="w-5 h-5 text-[#1D4ED8]" /> */}
              <img src="public/favicon-32.png" alt="Labuta" className="w-7" />
              <span className="text-1xs font-bold text-[#1D4ED8] uppercase tracking-wide">Labuta</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mt-2">Criar conta</h2>
            <p className="text-sm text-gray-500 mt-1">Preencha seus dados para se cadastrar.</p>
          </div>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <span className="text-sm">Responsável pelo desenvolvimento do formulário de cadastro do usuário:</span>
            <span className="text-sm text-blue-600">Carlos</span>
          </form>
        </div>
      </main>
      <SiteFooter navigate={navigate} />
    </div>
  );
}