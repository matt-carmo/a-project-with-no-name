"use client";

import { useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    // simulação de envio (ligar com API depois)
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1200);
  }

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900">
      {/* HERO */}
      <section className="bg-primary text-white">
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <span className="inline-block bg-white/10 px-4 py-1 rounded-full text-sm mb-4">
            🚀 SaaS para Delivery
          </span>

          <h1 className="text-3xl md:text-5xl font-bold leading-tight">
            Venda por delivery <br />
            com um simples <span className="text-yellow-300">link</span>
          </h1>

          <p className="mt-4 max-w-2xl mx-auto text-white/90">
            Crie seu cardápio digital, divulgue um link único
            e receba pedidos organizados, sem pagar comissão
            para marketplaces.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#lead"
              className="bg-yellow-400 text-black font-semibold px-6 py-3 rounded-xl hover:opacity-90"
            >
              Quero vender com meu link
            </a>

            <span className="text-sm text-white/70 self-center">
              ✔ Sem cartão de crédito
            </span>
          </div>
        </div>
      </section>

      {/* PROBLEMA */}
      <section className="max-w-6xl mx-auto px-6 py-16 text-center">
        <h2 className="text-2xl font-bold">
          Delivery não precisa ser complicado
        </h2>

        <p className="mt-4 text-zinc-600 max-w-3xl mx-auto">
          Marketplaces cobram taxas altas. Pedidos pelo WhatsApp
          geram erros. Cardápios desatualizados fazem você perder vendas.
          Seu negócio precisa de algo simples e direto.
        </p>
      </section>

      {/* BENEFÍCIOS */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">
          <Benefit
            title="Link único de pedidos"
            description="Divulgue no Instagram, WhatsApp, Google Maps ou anúncios."
          />
          <Benefit
            title="Zero comissão"
            description="Você paga uma mensalidade fixa e fica com 100% do lucro."
          />
          <Benefit
            title="Pedidos organizados"
            description="Chega de mensagens confusas. Tudo padronizado e claro."
          />
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-center">
          Como funciona
        </h2>

        <div className="mt-10 grid md:grid-cols-3 gap-8 text-center">
          <Step number="1" text="Crie seu cardápio digital" />
          <Step number="2" text="Receba um link exclusivo" />
          <Step number="3" text="Venda por delivery sem taxas" />
        </div>
      </section>

      {/* FORM */}
      <section id="lead" className="bg-zinc-100 py-20">
        <div className="max-w-md mx-auto px-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-center">
              Comece agora 🚀
            </h3>
            <p className="text-sm text-zinc-500 text-center mt-1">
              Receba acesso antecipado ao cardápio digital
            </p>

            {success ? (
              <div className="mt-6 text-center">
                <p className="text-green-600 font-semibold">
                  ✅ Cadastro realizado!
                </p>
                <p className="text-sm text-zinc-500 mt-1">
                  Entraremos em contato em breve.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <input
                  required
                  type="text"
                  placeholder="Seu nome"
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />

                <input
                  required
                  type="text"
                  placeholder="Nome do restaurante"
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />

                <input
                  required
                  type="tel"
                  placeholder="WhatsApp"
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />

                <button
                  disabled={loading}
                  className="w-full bg-primary text-white py-2.5 rounded-lg font-medium hover:opacity-90 disabled:opacity-60"
                >
                  {loading ? "Enviando..." : "Quero meu link de pedidos"}
                </button>
              </form>
            )}

            <p className="text-xs text-zinc-400 text-center mt-4">
              Sem spam. Cancelamento a qualquer momento.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

/* COMPONENTES AUXILIARES */

function Benefit({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-sm text-zinc-600 mt-2">
        {description}
      </p>
    </div>
  );
}

function Step({
  number,
  text,
}: {
  number: string;
  text: string;
}) {
  return (
    <div>
      <div className="mx-auto w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold">
        {number}
      </div>
      <p className="mt-3 text-zinc-600">{text}</p>
    </div>
  );
}
