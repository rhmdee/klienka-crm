"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Bot,
  Building2,
  Check,
  ChevronDown,
  Cpu,
  Database,
  Flame,
  Globe2,
  Kanban,
  Lock,
  MessageSquare,
  Play,
  Rocket,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/layouts/theme-toggle";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "yearly",
  );
  const [activeTab, setActiveTab] = useState<
    "pipeline" | "automation" | "omnichannel" | "analytics"
  >("pipeline");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      {/* -------------------------------------------------------------------------- */}
      {/*                                Navigation Bar                              */}
      {/* -------------------------------------------------------------------------- */}
      <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="size-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-md shadow-primary/20 transition-transform group-hover:scale-105">
                K
              </div>
              <span className="font-bold text-xl tracking-tight text-foreground">
                Klienka<span className="text-primary">.</span>CRM
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
              <a
                href="#fitur"
                className="hover:text-foreground transition-colors"
              >
                Fitur
              </a>
              <a
                href="#solusi"
                className="hover:text-foreground transition-colors"
              >
                Solusi
              </a>
              <a
                href="#demo"
                className="hover:text-foreground transition-colors"
              >
                Demo
              </a>
              <a
                href="#harga"
                className="hover:text-foreground transition-colors"
              >
                Harga
              </a>
              <a
                href="#keamanan"
                className="hover:text-foreground transition-colors"
              >
                Keamanan
              </a>
              <a
                href="#faq"
                className="hover:text-foreground transition-colors"
              >
                FAQ
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/dashboard" className="hidden sm:inline-flex">
              <Button variant="ghost" size="sm" className="font-medium">
                Masuk
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                size="sm"
                className="gap-1.5 shadow-md shadow-primary/20 font-medium cursor-pointer"
              >
                <span>Coba Gratis</span>
                <ArrowRight className="size-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* -------------------------------------------------------------------------- */}
      {/*                                 Hero Section                               */}
      {/* -------------------------------------------------------------------------- */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 size-150 bg-primary/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute top-1/3 right-10 size-87.5 bg-secondary/10 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge Announce */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold mb-6 shadow-xs animate-in fade-in slide-in-from-bottom-3 duration-500">
            <Sparkles className="size-3.5" />
            <span>
              Klienka CRM 2.0 dengan AI Pipeline Automation Telah Rilis
            </span>
            <span className="hidden sm:inline text-muted-foreground">•</span>
            <span className="hidden sm:inline text-foreground underline underline-offset-2">
              Pelajari Selengkapnya
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground max-w-4xl mx-auto leading-[1.15]">
            Ubah Prospek Jadi Pendapatan Nyata{" "}
            <span className="bg-linear-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Tanpa Ada Lead yang Terlewat
            </span>
          </h1>

          {/* Sub-headline */}
          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto font-normal leading-relaxed">
            Platform CRM modern all-in-one untuk mempermudah pengelolaan
            pipeline penjualan, mengotomatisasi follow-up tim sales, dan
            memberikan analisis revenue akurat secara real-time.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto gap-2 px-8 h-12 text-base font-semibold shadow-xl shadow-primary/25 cursor-pointer"
              >
                <span>Mulai Uji Coba Gratis 14 Hari</span>
                <Rocket className="size-4" />
              </Button>
            </Link>
            <a href="#demo" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto gap-2 px-6 h-12 text-base font-medium border-border/80 hover:bg-accent cursor-pointer"
              >
                <Play className="size-4 text-primary fill-primary/20" />
                <span>Lihat Demo Interaktif</span>
              </Button>
            </a>
          </div>

          {/* Trust Guarantees */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Check className="size-3.5 text-emerald-500 stroke-3" />
              Tanpa butuh kartu kredit
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="size-3.5 text-emerald-500 stroke-3" />
              Setup instan dalam 5 menit
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="size-3.5 text-emerald-500 stroke-3" />
              Bisa dibatalkan kapan saja
            </span>
          </div>

          {/* -------------------------------------------------------------------------- */}
          {/*                             Visual Mockup Preview                          */}
          {/* -------------------------------------------------------------------------- */}
          <div className="mt-14 relative mx-auto max-w-5xl rounded-3xl border border-border/80 bg-background/50 p-2 sm:p-3.5 shadow-2xl backdrop-blur-xl">
            <div className="rounded-2xl border border-border/60 bg-background overflow-hidden shadow-inner">
              {/* Mockup Header Bar */}
              <div className="h-10 bg-muted/40 border-b border-border/60 px-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="size-3 rounded-full bg-red-400/80" />
                  <div className="size-3 rounded-full bg-yellow-400/80" />
                  <div className="size-3 rounded-full bg-emerald-400/80" />
                  <span className="ml-2 text-xs font-medium text-muted-foreground hidden sm:inline">
                    app.klienka.com/pipeline
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                  <Flame className="size-3 text-primary animate-pulse" />
                  <span>Total Pipeline: Rp 842.500.000</span>
                </div>
              </div>

              {/* Mockup Dashboard Body */}
              <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-4 gap-4 text-left">
                {/* Column 1: Qualified Leads */}
                <div className="bg-muted/30 rounded-xl p-3 border border-border/50 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground">
                      Qualified (8)
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      Rp 120M
                    </span>
                  </div>
                  <div className="p-3 bg-background rounded-lg border border-border/80 shadow-xs space-y-1.5 hover:border-primary/50 transition-colors">
                    <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400">
                      Enterprise
                    </span>
                    <p className="text-xs font-semibold text-foreground">
                      PT Mahakarya Digital
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Deal: Rp 45.000.000
                    </p>
                    <div className="pt-1 flex items-center justify-between text-[10px] text-muted-foreground">
                      <span>Follow-up: Hari ini</span>
                      <span className="size-5 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                        JD
                      </span>
                    </div>
                  </div>
                  <div className="p-3 bg-background rounded-lg border border-border/80 shadow-xs space-y-1.5">
                    <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400">
                      SaaS
                    </span>
                    <p className="text-xs font-semibold text-foreground">
                      Nusantara Logistics
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Deal: Rp 28.000.000
                    </p>
                  </div>
                </div>

                {/* Column 2: Demo & Proposal */}
                <div className="bg-muted/30 rounded-xl p-3 border border-border/50 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground">
                      Proposal Sent (5)
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      Rp 310M
                    </span>
                  </div>
                  <div className="p-3 bg-background rounded-lg border border-primary/40 shadow-md ring-1 ring-primary/20 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        High Priority
                      </span>
                      <span className="text-[10px] text-emerald-500 font-semibold">
                        90% Win
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-foreground">
                      Bank Sentosa Mandiri
                    </p>
                    <p className="text-[11px] text-primary font-bold">
                      Deal: Rp 180.000.000
                    </p>
                    <div className="pt-1 flex items-center justify-between text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-1 text-emerald-600">
                        <Bot className="size-3" /> Auto WA Sent
                      </span>
                      <span className="size-5 rounded-full bg-emerald-500/20 text-emerald-600 flex items-center justify-center font-bold">
                        RA
                      </span>
                    </div>
                  </div>
                </div>

                {/* Column 3: Negotiation */}
                <div className="bg-muted/30 rounded-xl p-3 border border-border/50 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground">
                      Negotiation (3)
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      Rp 260M
                    </span>
                  </div>
                  <div className="p-3 bg-background rounded-lg border border-border/80 shadow-xs space-y-1.5">
                    <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400">
                      Legal Review
                    </span>
                    <p className="text-xs font-semibold text-foreground">
                      Fintech Sejahtera Group
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Deal: Rp 160.000.000
                    </p>
                  </div>
                </div>

                {/* Column 4: Won Deals */}
                <div className="bg-emerald-500/5 rounded-xl p-3 border border-emerald-500/20 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      Won This Month
                    </span>
                    <span className="text-[10px] text-emerald-600 font-mono font-bold">
                      Rp 480M
                    </span>
                  </div>
                  <div className="p-3 bg-background rounded-lg border border-emerald-500/40 shadow-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-emerald-600">
                        Closed Won
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        Kemarin
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-foreground">
                      Apotek Bersama Medika
                    </p>
                    <p className="text-[11px] text-emerald-600 font-bold">
                      +Rp 95.000.000
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------------- */}
      {/*                          Social Proof & Trust Signals                      */}
      {/* -------------------------------------------------------------------------- */}
      <section className="py-16 border-y border-border/60 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-8">
            Dipercaya oleh Lebih dari 1.200+ Tim Penjualan & Perusahaan
            Terkemuka di Asia Tenggara
          </p>

          {/* Logos Cloud */}
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-75 grayscale hover:grayscale-0 transition-all duration-300">
            {[
              "NexusCorp",
              "SinergiCloud",
              "ApexRetail",
              "FintekAsia",
              "MegaLogistics",
              "PrimaDigital",
            ].map((brand) => (
              <div
                key={brand}
                className="flex items-center gap-2 font-bold text-lg text-muted-foreground tracking-tight"
              >
                <Building2 className="size-5" />
                <span>{brand}</span>
              </div>
            ))}
          </div>

          {/* Key Metrics */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-6 rounded-2xl bg-background border border-border/60 shadow-xs hover:border-primary/40 transition-colors">
              <p className="text-4xl sm:text-5xl font-extrabold text-primary tracking-tight">
                +340%
              </p>
              <h3 className="mt-2 text-base font-semibold text-foreground">
                Peningkatan Konversi Prospek
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Rata-rata kenaikan closing rate dalam 60 hari pertama
                penggunaan.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-background border border-border/60 shadow-xs hover:border-primary/40 transition-colors">
              <p className="text-4xl sm:text-5xl font-extrabold text-primary tracking-tight">
                18+ Jam
              </p>
              <h3 className="mt-2 text-base font-semibold text-foreground">
                Waktu Terhemat per Sales/Minggu
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Otomatisasi penginputan data rutin, follow-up, dan reminder
                meeting.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-background border border-border/60 shadow-xs hover:border-primary/40 transition-colors">
              <p className="text-4xl sm:text-5xl font-extrabold text-primary tracking-tight">
                99.8%
              </p>
              <h3 className="mt-2 text-base font-semibold text-foreground">
                Follow-Up Tepat Waktu
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Mencegah leads menjadi dingin berkat notifikasi trigger WhatsApp
                & Email.
              </p>
            </div>
          </div>

          {/* Testimonial Cards */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-background border border-border/80 shadow-sm flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="size-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-foreground/90 leading-relaxed italic">
                  &ldquo;Sebelum menggunakan Klienka CRM, tim kami sering
                  kehilangan jejak prospek besar di WhatsApp. Setelah beralih ke
                  Klienka, konversi penjualan kami naik 2,5x lipat dalam waktu 3
                  bulan karena setiap prospek terpantau secara visual dan
                  otomatis!&rdquo;
                </p>
              </div>
              <div className="mt-6 flex items-center gap-3 pt-4 border-t border-border/50">
                <div className="size-10 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center">
                  BS
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">
                    Budi Santoso
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Head of Commercial Sales, PT Sinergi Nusantara
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-background border border-border/80 shadow-sm flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="size-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-foreground/90 leading-relaxed italic">
                  &ldquo;Fitur analitik real-time dan forecasting revenue
                  Klienka CRM sangat akurat. Manajemen kami bisa mengambil
                  keputusan ekspansi bisnis tanpa harus menunggu laporan bulanan
                  yang memakan waktu berhari-hari.&rdquo;
                </p>
              </div>
              <div className="mt-6 flex items-center gap-3 pt-4 border-t border-border/50">
                <div className="size-10 rounded-full bg-emerald-500/20 text-emerald-600 font-bold flex items-center justify-center">
                  ML
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">
                    Maya Lestari
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    VP of Growth & Operations, Fintek Retail Asia
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------------- */}
      {/*                          Fitur Utama & Solusi Bisnis                       */}
      {/* -------------------------------------------------------------------------- */}
      <section
        id="fitur"
        className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-xs font-bold uppercase tracking-widest text-primary">
            Solusi Bisnis Komprehensif
          </h2>
          <p className="mt-2 text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Semua yang Dibutuhkan Tim Sales untuk Mencapai Target Revenue
          </p>
          <p className="mt-4 text-base text-muted-foreground">
            Bukan sekadar buku kontak digital. Klienka CRM dirancang sebagai
            mesin pendorong pertumbuhan penjualan yang menghemat waktu dan
            meningkatkan efektivitas tim.
          </p>
        </div>

        <div className="mt-16 space-y-16">
          {/* Feature 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-primary/10 text-primary text-xs font-semibold">
                <Kanban className="size-4" />
                <span>Visual Sales Pipeline</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-foreground">
                Kontrol Penuh Pergerakan Setiap Deal dalam Satu Papan Visual
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Hilangkan ketidakpastian. Pantau tahapan negosiasi prospek mulai
                dari perkenalan awal hingga closing secara drag-and-drop. Tim
                Anda langsung mengetahui deal mana yang siap closing dan deal
                mana yang butuh perhatian khusus.
              </p>
              <ul className="space-y-2 text-sm text-foreground">
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-primary" />
                  Custom tahapan pipeline sesuai alur bisnis unik Anda
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-primary" />
                  Skor probabilitas win-rate otomatis untuk prioritisasi
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-primary" />
                  Peringatan deal macet (*stagnant deal alerts*)
                </li>
              </ul>
            </div>
            <div className="p-6 rounded-2xl bg-muted/30 border border-border/80 shadow-md">
              <div className="bg-background rounded-xl p-4 border border-border shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <span className="text-xs font-bold">
                    Pipeline Stage: Negosiasi Harga
                  </span>
                  <span className="text-xs font-semibold text-emerald-500">
                    Probabilitas: 85%
                  </span>
                </div>
                <div className="p-3 bg-muted/40 rounded-lg border border-border/60">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold text-sm">PT Mega Ekspedisi</p>
                    <span className="text-xs font-bold text-primary">
                      Rp 120.000.000
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    PIC: Sarah Wijaya • Jadwal Demo Kontrak: Besok 10:00
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center lg:flex-row-reverse">
            <div className="space-y-4 lg:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                <Bot className="size-4" />
                <span>Smart Workflow & Auto Follow-up</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-foreground">
                Otomatisasi Tugas Rutin, Biarkan Sales Fokus Menjual
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Bangun alur kerja cerdas yang mengirimkan email proposal, pesan
                reminder WhatsApp, dan menugaskan follow-up ke anggota tim
                secara otomatis saat deal berpindah stage.
              </p>
              <ul className="space-y-2 text-sm text-foreground">
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-emerald-500" />
                  Drip campaign otomatis untuk memelihara lead dingin
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-emerald-500" />
                  Template pesan personalisasi dengan variabel dinamis
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-emerald-500" />
                  Distribusi lead otomatis (*Round Robin lead assignment*)
                </li>
              </ul>
            </div>
            <div className="p-6 rounded-2xl bg-muted/30 border border-border/80 shadow-md lg:order-1">
              <div className="bg-background rounded-xl p-4 border border-border space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600">
                  <Zap className="size-4" /> Trigger: Lead Baru Mengisi Form
                  Website
                </div>
                <div className="pl-6 border-l-2 border-emerald-500/40 space-y-2 text-xs">
                  <div className="p-2 bg-muted/40 rounded border border-border">
                    1. Kirim WhatsApp Sambutan Otomatis dalam 2 Menit
                  </div>
                  <div className="p-2 bg-muted/40 rounded border border-border">
                    2. Buat Task Follow-Up untuk Sales Representative
                  </div>
                  <div className="p-2 bg-muted/40 rounded border border-border">
                    3. Notifikasi Slack ke Channel #sales-deals
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-semibold">
                <MessageSquare className="size-4" />
                <span>Omnichannel Communication Hub</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-foreground">
                Sentralisasi WhatsApp, Email, dan Telepon dalam 1 Kontak
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Seluruh riwayat obrolan pelanggan tersimpan terpusat. Ketika ada
                tim sales yang cuti atau mutasi, penggantinya bisa langsung
                melanjutkan percakapan tanpa perlu menanyakan ulang konteks
                kebutuhan pelanggan.
              </p>
              <ul className="space-y-2 text-sm text-foreground">
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-blue-500" />
                  Integrasi resmi WhatsApp Business API
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-blue-500" />
                  Sinkronisasi 2 arah dengan Google Workspace & Outlook
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-blue-500" />
                  Rekaman catatan panggilan dan timeline interaksi lengkap
                </li>
              </ul>
            </div>
            <div className="p-6 rounded-2xl bg-muted/30 border border-border/80 shadow-md">
              <div className="bg-background rounded-xl p-4 border border-border space-y-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-sm text-foreground pb-2 border-b border-border">
                  <Users className="size-4 text-primary" /> Timeline Kontak:
                  Hendra Gunawan (CEO)
                </div>
                <div className="p-2.5 bg-emerald-500/5 rounded border border-emerald-500/20">
                  <p className="font-semibold text-emerald-600">
                    WhatsApp Chat • 10:45 AM
                  </p>
                  <p className="text-muted-foreground">
                    &ldquo;Bisa kirimkan revisi penawaran untuk 50 user?&rdquo;
                  </p>
                </div>
                <div className="p-2.5 bg-blue-500/5 rounded border border-blue-500/20">
                  <p className="font-semibold text-blue-600">
                    Email Sent • 11:15 AM
                  </p>
                  <p className="text-muted-foreground">
                    Proposal Penawaran Khusus Q3 telah terkirim.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-4 lg:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-semibold">
                <BarChart3 className="size-4" />
                <span>Real-Time Analytics & Revenue Forecasting</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-foreground">
                Data Akurat untuk Pengambilan Keputusan Bisnis Cepat
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Dapatkan dashboard metrik penjualan real-time: performa per
                sales rep, rata-rata durasi closing (*sales cycle length*),
                sumber lead dengan ROI tertinggi, dan proyeksi pencapaian target
                bulan ini.
              </p>
              <ul className="space-y-2 text-sm text-foreground">
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-indigo-500" />
                  Laporan performa sales individu dan tim
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-indigo-500" />
                  Prediksi revenue akurat berbasis tren data historis
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-indigo-500" />
                  Export data 1-klik ke Excel, PDF, dan integrasi BI
                </li>
              </ul>
            </div>
            <div className="p-6 rounded-2xl bg-muted/30 border border-border/80 shadow-md lg:order-1">
              <div className="bg-background rounded-xl p-4 border border-border space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-border">
                  <span className="text-xs font-bold">
                    Proyeksi Revenue Bulan Ini
                  </span>
                  <span className="text-xs font-bold text-emerald-500">
                    +18.4% YoY
                  </span>
                </div>
                <div className="h-28 flex items-end justify-between gap-2 pt-4 px-2">
                  <div
                    className="w-full bg-primary/20 rounded-t h-[40%]"
                    title="Minggu 1"
                  />
                  <div
                    className="w-full bg-primary/40 rounded-t h-[65%]"
                    title="Minggu 2"
                  />
                  <div
                    className="w-full bg-primary/70 rounded-t h-[80%]"
                    title="Minggu 3"
                  />
                  <div
                    className="w-full bg-primary rounded-t h-[95%]"
                    title="Minggu 4 (Prediksi)"
                  />
                </div>
                <div className="flex justify-between text-[11px] text-muted-foreground pt-1 border-t border-border">
                  <span>Target: Rp 1.000.000.000</span>
                  <span className="font-bold text-foreground">
                    Tercapai: Rp 940.000.000 (94%)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------------- */}
      {/*                     Demo Produk / Interactive Section                      */}
      {/* -------------------------------------------------------------------------- */}
      <section
        id="demo"
        className="py-20 bg-muted/20 border-y border-border/60"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xs font-bold uppercase tracking-widest text-primary">
              Interactive Product Tour
            </h2>
            <p className="mt-2 text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              Rasakan Kemudahan Klienka CRM dalam 60 Detik
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Pilih modul di bawah ini untuk melihat bagaimana tim sales Anda
              bekerja lebih cepat dan terstruktur.
            </p>
          </div>

          {/* Interactive Tabs */}
          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {[
              { id: "pipeline", label: "1. Visual Deal Kanban", icon: Kanban },
              { id: "automation", label: "2. Workflow Automation", icon: Bot },
              {
                id: "omnichannel",
                label: "3. WhatsApp Integration",
                icon: MessageSquare,
              },
              {
                id: "analytics",
                label: "4. Revenue Forecast",
                icon: TrendingUp,
              },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer border",
                    isActive
                      ? "bg-primary text-primary-foreground border-primary shadow-md"
                      : "bg-background text-muted-foreground border-border hover:text-foreground hover:bg-muted/60",
                  )}
                >
                  <Icon className="size-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content Display */}
          <div className="mt-8 max-w-4xl mx-auto rounded-2xl bg-background border border-border/80 p-6 sm:p-8 shadow-xl text-left">
            {activeTab === "pipeline" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <div>
                    <h3 className="font-bold text-base text-foreground">
                      Kanban Pipeline Interaktif
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Tarik dan geser deal untuk update otomatis status & tugas
                      berikutnya.
                    </p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded bg-primary/10 text-primary">
                    Live View
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-lg bg-muted/40 border border-border space-y-2">
                    <span className="text-xs font-bold text-muted-foreground">
                      Prospek Masuk (4)
                    </span>
                    <div className="p-2.5 bg-background rounded-md border text-xs font-medium shadow-2xs">
                      PT Indo Makmur (Rp 25M)
                    </div>
                    <div className="p-2.5 bg-background rounded-md border text-xs font-medium shadow-2xs">
                      CV Gemilang Jaya (Rp 12M)
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 space-y-2">
                    <span className="text-xs font-bold text-primary">
                      Presentasi Demo (2)
                    </span>
                    <div className="p-2.5 bg-background rounded-md border border-primary/40 text-xs font-semibold text-primary shadow-xs">
                      Bank Bintang Sejahtera (Rp 180M)
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 space-y-2">
                    <span className="text-xs font-bold text-emerald-600">
                      Closing Won (5)
                    </span>
                    <div className="p-2.5 bg-background rounded-md border border-emerald-500/30 text-xs font-medium text-emerald-600">
                      PT Sumber Berkah (Rp 60M)
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "automation" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <div>
                    <h3 className="font-bold text-base text-foreground">
                      Builder Workflow Tanpa Koding
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Susun logika automasi semudah menyusun blok lego.
                    </p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-600">
                    Aktif: 12 Rule
                  </span>
                </div>
                <div className="p-4 bg-muted/30 rounded-xl border border-border/60 space-y-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="size-6 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                      1
                    </div>
                    <span className="font-semibold">
                      Bila Status Deal berubah menjadi &ldquo;Proposal
                      Dikirim&rdquo;
                    </span>
                  </div>
                  <div className="ml-9 p-3 bg-background rounded-lg border border-border">
                    <p className="font-medium text-foreground">
                      Tindakan Otomatis:
                    </p>
                    <p className="text-muted-foreground mt-1">
                      • Set reminder meeting 3 hari berikutnya pada Google
                      Calendar sales
                    </p>
                    <p className="text-muted-foreground">
                      • Kirim pesan WhatsApp konfirmasi penerimaan dokumen ke
                      klien
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "omnichannel" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <div>
                    <h3 className="font-bold text-base text-foreground">
                      WhatsApp Business API Terpadu
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Kirim broadcast promosi, tangani chat dari multi-agen
                      dalam 1 nomor resmi.
                    </p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-600">
                    Centang Hijau Resmi
                  </span>
                </div>
                <div className="p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/20 flex flex-col gap-2 text-xs">
                  <div className="bg-background p-3 rounded-lg border max-w-md">
                    <p className="font-semibold text-emerald-600">
                      Halo Pak Hendra,
                    </p>
                    <p className="text-muted-foreground mt-0.5">
                      Berikut kami lampirkan dokumen penawaran resmi Klienka CRM
                      untuk 50 user.
                    </p>
                  </div>
                  <div className="bg-primary/10 text-primary p-3 rounded-lg border self-end max-w-md text-right font-medium">
                    Terima kasih, kami pelajari dan jadwalkan meeting finalisasi
                    besok pagi.
                  </div>
                </div>
              </div>
            )}

            {activeTab === "analytics" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <div>
                    <h3 className="font-bold text-base text-foreground">
                      Revenue Analytics & KPI Tim
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Kalkulasi win-rate, pipeline velocity, dan proyeksi
                      pencapaian kuartal.
                    </p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded bg-indigo-500/10 text-indigo-600">
                    Real-time Sync
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-3 bg-muted/40 rounded-lg border">
                    <p className="text-xs text-muted-foreground">
                      Rata-rata Siklus Closing
                    </p>
                    <p className="text-lg font-bold text-foreground mt-1">
                      14 Hari
                    </p>
                  </div>
                  <div className="p-3 bg-muted/40 rounded-lg border">
                    <p className="text-xs text-muted-foreground">
                      Deal Win Rate
                    </p>
                    <p className="text-lg font-bold text-emerald-500 mt-1">
                      42.8%
                    </p>
                  </div>
                  <div className="p-3 bg-muted/40 rounded-lg border">
                    <p className="text-xs text-muted-foreground">
                      Lead Terbanyak
                    </p>
                    <p className="text-lg font-bold text-foreground mt-1">
                      LinkedIn Ads
                    </p>
                  </div>
                  <div className="p-3 bg-muted/40 rounded-lg border">
                    <p className="text-xs text-muted-foreground">Forecast Q3</p>
                    <p className="text-lg font-bold text-primary mt-1">
                      Rp 2.4 Miliar
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------------- */}
      {/*                           Pricing Table (Tabel Harga)                      */}
      {/* -------------------------------------------------------------------------- */}
      <section
        id="harga"
        className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-xs font-bold uppercase tracking-widest text-primary">
            Paket Harga Fleksibel
          </h2>
          <p className="mt-2 text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Investasi Terjangkau untuk Pertumbuhan Eksponensial
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            Pilih paket yang sesuai dengan ukuran tim Anda. Tanpa biaya
            tersembunyi, upgrade kapan saja.
          </p>

          {/* Billing Switch */}
          <div className="mt-8 inline-flex items-center p-1 bg-muted/60 rounded-xl border border-border">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={cn(
                "px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                billingCycle === "monthly"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Tagihan Bulanan
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={cn(
                "flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                billingCycle === "yearly"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <span>Tagihan Tahunan</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                Hemat 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {/* Tier 1: Starter */}
          <div className="rounded-3xl border border-border bg-background p-8 flex flex-col justify-between shadow-xs hover:border-primary/40 transition-colors">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-foreground">Starter</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Solusi ideal untuk solopreneur & tim kecil yang baru mulai
                  merapikan prospek.
                </p>
              </div>
              <div className="pt-2">
                <span className="text-3xl sm:text-4xl font-extrabold text-foreground">
                  {billingCycle === "yearly" ? "Rp 149.000" : "Rp 189.000"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {" "}
                  / user / bulan
                </span>
              </div>
              <ul className="pt-4 space-y-2.5 text-xs text-foreground border-t border-border">
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-emerald-500 shrink-0" />
                  Maksimal hingga 3 pengguna
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-emerald-500 shrink-0" />
                  Hingga 2.500 kontak aktif
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-emerald-500 shrink-0" />1 Visual
                  Sales Pipeline
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-emerald-500 shrink-0" />
                  Integrasi Email & Kalender Dasar
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-emerald-500 shrink-0" />
                  Email Support Standar
                </li>
              </ul>
            </div>
            <div className="pt-8">
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  className="w-full font-semibold cursor-pointer"
                >
                  Mulai Uji Coba Gratis
                </Button>
              </Link>
            </div>
          </div>

          {/* Tier 2: Professional (Popular) */}
          <div className="relative rounded-3xl border-2 border-primary bg-background p-8 flex flex-col justify-between shadow-xl shadow-primary/10">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-[11px] font-bold tracking-wide uppercase shadow-sm">
              Paling Populer
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  Professional
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Dirancang untuk tim sales berkembang yang membutuhkan automasi
                  dan WhatsApp API.
                </p>
              </div>
              <div className="pt-2">
                <span className="text-3xl sm:text-4xl font-extrabold text-primary">
                  {billingCycle === "yearly" ? "Rp 299.000" : "Rp 379.000"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {" "}
                  / user / bulan
                </span>
              </div>
              <ul className="pt-4 space-y-2.5 text-xs text-foreground border-t border-border">
                <li className="flex items-center gap-2 font-medium">
                  <Check className="size-4 text-primary shrink-0" />
                  Semua fitur di paket Starter, ditambah:
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-primary shrink-0" />
                  Pengguna tanpa batas (*Unlimited users*)
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-primary shrink-0" />
                  Hingga 50.000 kontak aktif
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-primary shrink-0" />
                  Multi Pipeline & Custom Stages
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-primary shrink-0" />
                  Automasi Follow-up & Reminder Cerdas
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-primary shrink-0" />
                  Integrasi WhatsApp Business API Resmi
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-primary shrink-0" />
                  Laporan Revenue Forecasting
                </li>
              </ul>
            </div>
            <div className="pt-8">
              <Link href="/dashboard">
                <Button className="w-full font-semibold shadow-md shadow-primary/20 cursor-pointer">
                  Mulai Uji Coba Gratis 14 Hari
                </Button>
              </Link>
            </div>
          </div>

          {/* Tier 3: Enterprise */}
          <div className="rounded-3xl border border-border bg-background p-8 flex flex-col justify-between shadow-xs hover:border-primary/40 transition-colors">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  Enterprise
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Kustomisasi mendalam, keamanan ketat, dan dedicated support
                  untuk korporasi.
                </p>
              </div>
              <div className="pt-2">
                <span className="text-3xl sm:text-4xl font-extrabold text-foreground">
                  Custom
                </span>
                <span className="text-xs text-muted-foreground">
                  {" "}
                  (Sesuai Kebutuhan)
                </span>
              </div>
              <ul className="pt-4 space-y-2.5 text-xs text-foreground border-t border-border">
                <li className="flex items-center gap-2 font-medium">
                  <Check className="size-4 text-emerald-500 shrink-0" />
                  Semua fitur Professional, ditambah:
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-emerald-500 shrink-0" />
                  Unlimited kontak & storage file
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-emerald-500 shrink-0" />
                  Dedicated Account Manager & Training Tim
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-emerald-500 shrink-0" />
                  Integrasi Custom ERP / API Khusus
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-emerald-500 shrink-0" />
                  SLA Uptime 99.99% & Audit Trail Log
                </li>
              </ul>
            </div>
            <div className="pt-8">
              <a href="#faq">
                <Button
                  variant="outline"
                  className="w-full font-semibold cursor-pointer"
                >
                  Hubungi Tim Sales
                </Button>
              </a>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-8">
          Semua paket sudah termasuk enkripsi data 256-bit dan akses aplikasi
          mobile. Butuh invoice faktur pajak resmi? Kami sediakan.
        </p>
      </section>

      {/* -------------------------------------------------------------------------- */}
      {/*                         Keamanan & Kepatuhan Data                          */}
      {/* -------------------------------------------------------------------------- */}
      <section
        id="keamanan"
        className="py-16 bg-muted/30 border-y border-border/60"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-1 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-primary/10 text-primary text-xs font-semibold">
                <ShieldCheck className="size-4" />
                <span>Enterprise Trust</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                Keamanan & Privasi Data Prospek Anda Adalah Prioritas Utama
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Kami menerapkan standar keamanan data perbankan untuk memastikan
                informasi kontak, nominal transaksi, dan data rahasia perusahaan
                Anda selalu aman terlindungi.
              </p>
            </div>

            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-background border border-border shadow-2xs space-y-2">
                <Lock className="size-6 text-primary" />
                <h3 className="text-sm font-bold text-foreground">
                  Enkripsi End-to-End 256-bit AES
                </h3>
                <p className="text-xs text-muted-foreground">
                  Semua data saat transit (*in-transit*) dan saat tersimpan
                  (*at-rest*) dienkripsi dengan standar militer.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-background border border-border shadow-2xs space-y-2">
                <Cpu className="size-6 text-primary" />
                <h3 className="text-sm font-bold text-foreground">
                  Role-Based Access Control (RBAC)
                </h3>
                <p className="text-xs text-muted-foreground">
                  Atur hak akses granular sehingga staf sales hanya melihat data
                  prospek yang ditugaskan kepada mereka.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-background border border-border shadow-2xs space-y-2">
                <Database className="size-6 text-primary" />
                <h3 className="text-sm font-bold text-foreground">
                  Backup Otomatis Harian
                </h3>
                <p className="text-xs text-muted-foreground">
                  Data dicadangkan berkala ke multi-zona server dengan fitur
                  pemulihan bencana (*disaster recovery*).
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-background border border-border shadow-2xs space-y-2">
                <Globe2 className="size-6 text-primary" />
                <h3 className="text-sm font-bold text-foreground">
                  Kepatuhan UU PDP & GDPR Ready
                </h3>
                <p className="text-xs text-muted-foreground">
                  Sesuai dengan regulasi Perlindungan Data Pribadi (UU PDP)
                  Indonesia dan standar privasi internasional.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------------- */}
      {/*                                FAQ Section                                 */}
      {/* -------------------------------------------------------------------------- */}
      <section
        id="faq"
        className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="text-center">
          <h2 className="text-xs font-bold uppercase tracking-widest text-primary">
            Pusat Bantuan
          </h2>
          <p className="mt-2 text-3xl font-extrabold text-foreground tracking-tight">
            Pertanyaan yang Sering Diajukan
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Temukan jawaban atas pertanyaan umum sebelum Anda memulai
            menggunakan Klienka CRM.
          </p>
        </div>

        <div className="mt-12 space-y-3">
          {[
            {
              q: "Apakah proses migrasi data dari Excel, CSV, atau CRM lama sulit?",
              a: "Sangat mudah. Klienka CRM menyediakan fitur Import Wizard 1-klik yang otomatis memetakan kolom nama, email, nomor telepon, dan status deal dari file Excel/CSV Anda. Tim kami juga siap membantu proses migrasi data secara gratis untuk paket Professional dan Enterprise.",
            },
            {
              q: "Berapa lama waktu yang dibutuhkan tim sales kami untuk mulai lancar menggunakannya?",
              a: "Rata-rata pengguna baru menguasai Klienka CRM dalam waktu kurang dari 30 menit karena antarmuka yang sangat intuitif dan bersih (UI modern tanpa kompleksitas menu yang membingungkan). Kami juga menyediakan panduan video singkat di setiap fitur.",
            },
            {
              q: "Apakah Klienka CRM mendukung integrasi resmi WhatsApp Business API?",
              a: "Ya. Paket Professional dan Enterprise mendukung integrasi resmi WhatsApp Business API sehingga Anda dapat mengirim pesan broadcast, melayani chat dari banyak CS/sales dalam 1 nomor terverifikasi, dan mencatat riwayat obrolan langsung ke kartu profil kontak.",
            },
            {
              q: "Bagaimana skema customer support jika tim kami mengalami kendala?",
              a: "Kami menyediakan tim support berbahasa Indonesia via Live Chat di dalam dashboard dan WhatsApp Support prioritas dengan waktu respon rata-rata di bawah 5 menit pada jam kerja.",
            },
            {
              q: "Apakah saya harus memasukkan nomor kartu kredit saat mendaftar Free Trial?",
              a: "Tidak sama sekali. Anda dapat langsung mendaftar dan mencoba seluruh fitur Klienka CRM secara gratis selama 14 hari penuh tanpa memasukkan data kartu kredit.",
            },
          ].map((item, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-border bg-background overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-foreground cursor-pointer"
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    className={cn(
                      "size-4 text-muted-foreground transition-transform duration-200 shrink-0",
                      isOpen && "rotate-180",
                    )}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/40 pt-3 animate-in fade-in duration-200">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* -------------------------------------------------------------------------- */}
      {/*                              Final CTA Banner                              */}
      {/* -------------------------------------------------------------------------- */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-linear-to-br from-primary via-blue-700 to-indigo-900 text-primary-foreground p-8 sm:p-14 overflow-hidden shadow-2xl text-center">
          {/* Background Glow Accents */}
          <div className="absolute -right-20 -bottom-20 size-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -left-20 -top-20 size-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              Siap Lipatgandakan Penjualan Bisnis Anda Hari Ini?
            </h2>
            <p className="text-sm sm:text-base text-primary-foreground/85 leading-relaxed">
              Bergabunglah dengan ribuan pemilik bisnis dan tim sales modern
              yang telah bertumbuh pesat bersama Klienka CRM.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full sm:w-auto px-8 h-12 text-base font-bold shadow-lg cursor-pointer"
                >
                  Mulai Uji Coba Gratis 14 Hari
                </Button>
              </Link>
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto px-6 h-12 text-base font-medium text-white border-white/30 hover:bg-white/10 hover:text-white cursor-pointer"
                >
                  Masuk ke Aplikasi
                </Button>
              </Link>
            </div>
            <p className="text-xs text-primary-foreground/75 pt-2">
              Setup 5 Menit • Tanpa Kartu Kredit • Bantuan Onboarding Gratis
            </p>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------------- */}
      {/*                                   Footer                                   */}
      {/* -------------------------------------------------------------------------- */}
      <footer className="border-t border-border bg-muted/20 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-12 border-b border-border">
            {/* Brand Col */}
            <div className="col-span-2 space-y-4">
              <Link href="/" className="flex items-center gap-2.5">
                <div className="size-8 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-xs">
                  K
                </div>
                <span className="font-bold text-lg text-foreground">
                  Klienka<span className="text-primary">.</span>CRM
                </span>
              </Link>
              <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
                Platform Customer Relationship Management modern untuk membantu
                tim sales mengelola prospek, mengotomatisasi follow-up, dan
                mengakselerasi pertumbuhan pendapatan bisnis.
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="size-2 rounded-full bg-emerald-500" />
                <span>Semua sistem operasional normal (99.99% Uptime)</span>
              </div>
            </div>

            {/* Col 1 */}
            <div className="space-y-3 text-xs">
              <p className="font-bold text-foreground uppercase tracking-wider">
                Produk
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#fitur" className="hover:text-foreground">
                    Visual Pipeline
                  </a>
                </li>
                <li>
                  <a href="#fitur" className="hover:text-foreground">
                    Workflow Automation
                  </a>
                </li>
                <li>
                  <a href="#fitur" className="hover:text-foreground">
                    WhatsApp API
                  </a>
                </li>
                <li>
                  <a href="#fitur" className="hover:text-foreground">
                    Revenue Analytics
                  </a>
                </li>
                <li>
                  <a href="#harga" className="hover:text-foreground">
                    Tabel Harga
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 2 */}
            <div className="space-y-3 text-xs">
              <p className="font-bold text-foreground uppercase tracking-wider">
                Solusi
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#solusi" className="hover:text-foreground">
                    B2B Sales Teams
                  </a>
                </li>
                <li>
                  <a href="#solusi" className="hover:text-foreground">
                    Property & Real Estate
                  </a>
                </li>
                <li>
                  <a href="#solusi" className="hover:text-foreground">
                    Agensi & Konsultan
                  </a>
                </li>
                <li>
                  <a href="#solusi" className="hover:text-foreground">
                    SaaS & Teknologi
                  </a>
                </li>
                <li>
                  <a href="#solusi" className="hover:text-foreground">
                    Distribusi & Logistik
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 3 */}
            <div className="space-y-3 text-xs">
              <p className="font-bold text-foreground uppercase tracking-wider">
                Perusahaan
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#keamanan" className="hover:text-foreground">
                    Keamanan Data
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-foreground">
                    Pusat Bantuan (FAQ)
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Syarat & Ketentuan
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Kebijakan Privasi
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Hubungi Kami
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <p>
              © {new Date().getFullYear()} Klienka CRM (PT Klienka Digital
              Nusantara). Hak Cipta Dilindungi Undang-Undang.
            </p>
            <div className="flex items-center gap-4">
              <span>Jakarta, Indonesia</span>
              <span>•</span>
              <span>support@klienka.com</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
