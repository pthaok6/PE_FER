import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Code2,
  Sparkles,
  Layers,
  Palette,
  Terminal,
  ExternalLink,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

export default function Home() {
  const techStack = [
    {
      name: "Next.js 16 (App Router)",
      desc: "Framework React tiên tiến nhất với Turbopack & React 19.",
      tag: "Framework",
      icon: Layers,
    },
    {
      name: "Tailwind CSS v4",
      desc: "Engine CSS thế hệ mới siêu nhanh, hỗ trợ biến CSS linh hoạt.",
      tag: "Styling",
      icon: Palette,
    },
    {
      name: "ShadCN UI",
      desc: "Bộ UI components cao cấp xây dựng trên nền tảng Base UI/Radix.",
      tag: "Components",
      icon: Sparkles,
    },
    {
      name: "TypeScript",
      desc: "Đảm bảo tính chặt chẽ và an toàn kiểu dữ liệu cho toàn bộ code.",
      tag: "Language",
      icon: Code2,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold shadow-sm">
              N
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-lg tracking-tight">Next.js App</span>
              <Badge variant="secondary" className="text-xs font-medium">
                App Router
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className={buttonVariants({ variant: "ghost", size: "sm" })}
            >
              Đăng nhập
            </Link>
            <Link
              href="/register"
              className={buttonVariants({ variant: "default", size: "sm" })}
            >
              Đăng ký
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-6 py-12 flex flex-col items-center">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm bg-muted/60 text-muted-foreground">
            <Sparkles className="size-4 text-amber-500" />
            <span>Next.js + Tailwind CSS + ShadCN UI</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
            Khởi đầu dự án hiện đại <br className="hidden sm:inline" />
            với <span className="text-primary underline decoration-primary/30 underline-offset-8">ShadCN UI</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Dự án đã được cấu hình hoàn chỉnh với Next.js App Router, Tailwind CSS mới nhất và hệ thống components ShadCN UI sẵn sàng để bạn tùy biến.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <Link
              href="/register"
              className={buttonVariants({ variant: "default", size: "lg" }) + " gap-2 cursor-pointer shadow-md"}
            >
              Trang Đăng ký (/register) <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/login"
              className={buttonVariants({ variant: "outline", size: "lg" }) + " gap-2 cursor-pointer"}
            >
              Trang Đăng nhập (/login)
            </Link>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl mb-16">
          {techStack.map((tech) => {
            const Icon = tech.icon;
            return (
              <Card key={tech.name} className="relative overflow-hidden border transition-all hover:shadow-lg hover:-translate-y-0.5">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-lg bg-muted text-foreground">
                      <Icon className="size-5" />
                    </div>
                    <Badge variant="secondary">{tech.tag}</Badge>
                  </div>
                  <CardTitle>{tech.name}</CardTitle>
                  <CardDescription className="text-xs mt-1">
                    {tech.desc}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        {/* Interactive Components Demo Section */}
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Card: ShadCN UI Elements */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="size-5 text-primary" />
                Demo ShadCN UI Components
              </CardTitle>
              <CardDescription>
                Thử nghiệm nhanh các component đã cài sẵn trong dự án.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">
                  Input Component
                </label>
                <div className="flex gap-2">
                  <Input placeholder="Nhập email của bạn..." />
                  <Button variant="default">Đăng ký</Button>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-xs font-medium text-muted-foreground block">
                  Button Variants
                </label>
                <div className="flex flex-wrap gap-2">
                  <Button variant="default" size="sm">Default</Button>
                  <Button variant="secondary" size="sm">Secondary</Button>
                  <Button variant="outline" size="sm">Outline</Button>
                  <Button variant="destructive" size="sm">Destructive</Button>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-xs font-medium text-muted-foreground block">
                  Badges
                </label>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="default">Primary</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                </div>
              </div>
            </CardContent>
            <CardFooter className="text-xs text-muted-foreground flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-emerald-500" />
              Đã cấu hình Alias `@/components/ui/*`
            </CardFooter>
          </Card>

          {/* Card: CLI & Next Steps */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Terminal className="size-5 text-primary" />
                Lệnh thường dùng
              </CardTitle>
              <CardDescription>
                Các câu lệnh hữu ích để tiếp tục phát triển ứng dụng.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-lg bg-muted border space-y-1">
                <span className="text-muted-foreground"># Chạy máy chủ dev</span>
                <p className="font-semibold text-foreground">npm run dev</p>
              </div>

              <div className="p-3 rounded-lg bg-muted border space-y-1">
                <span className="text-muted-foreground"># Cài thêm component ShadCN</span>
                <p className="font-semibold text-foreground">npx shadcn@latest add dialog dropdown-menu</p>
              </div>

              <div className="p-3 rounded-lg bg-muted border space-y-1">
                <span className="text-muted-foreground"># Build dự án cho Production</span>
                <p className="font-semibold text-foreground">npm run build</p>
              </div>
            </CardContent>
            <CardFooter className="text-xs text-muted-foreground">
              Thư mục mã nguồn: <code className="ml-1 bg-muted px-1.5 py-0.5 rounded">src/app/</code>
            </CardFooter>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 bg-muted/30">
        <div className="container mx-auto px-6 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
          <p>© 2026 Next.js App Router + Tailwind CSS + ShadCN UI Project.</p>
          <div className="flex gap-4">
            <a href="https://nextjs.org" className="hover:underline">Next.js</a>
            <a href="https://tailwindcss.com" className="hover:underline">Tailwind CSS</a>
            <a href="https://ui.shadcn.com" className="hover:underline">ShadCN UI</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
