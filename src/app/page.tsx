import Link from "next/link";
import { BookOpen, Search, TrendingUp } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";

const features = [
  { icon: BookOpen, title: "Add books", text: "Keep every book you want to read in one thoughtful place." },
  { icon: TrendingUp, title: "Track your progress", text: "Move from your reading list to currently reading and finished." },
  { icon: Search, title: "Search your shelf", text: "Find a title in a moment and see your reading at a glance." },
];

export default function Home() {
  return <div className="min-h-screen bg-[#fffdf9] text-stone-900"><SiteHeader /><main className="mx-auto max-w-6xl px-4 pb-20 pt-14 sm:px-6 sm:pt-20">
    <section className="mx-auto max-w-3xl text-center"><p className="mb-4 text-xs font-semibold uppercase tracking-[.24em] text-emerald-800">A little room for every story</p><h1 data-testid="home-title" className="font-serif text-5xl font-semibold tracking-tight text-emerald-950 sm:text-7xl">ShelfLife</h1><p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-stone-600">Your personal home for books you want to read, are reading, and have finished. Make space for the next story.</p><Link href="/books" className={buttonVariants({ size: "lg", className: "mt-8 bg-emerald-900 text-white hover:bg-emerald-800" })}>Open my shelf</Link></section>
    <section className="mx-auto mt-16 grid max-w-5xl gap-4 sm:grid-cols-3">{features.map(({ icon: Icon, title, text }) => <Card key={title} className="border-stone-200 bg-white shadow-sm"><CardHeader><div className="mb-2 grid size-11 place-items-center rounded-full bg-emerald-50 text-emerald-900"><Icon className="size-5" /></div><CardTitle className="font-serif text-xl text-emerald-950">{title}</CardTitle></CardHeader><CardContent className="text-sm leading-6 text-stone-600">{text}</CardContent></Card>)}</section>
  </main></div>;
}
