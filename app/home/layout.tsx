import { AppSidebar } from "@/components/ui/app-sidebar"

export default function HomeLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <>
            <AppSidebar />
            {children}
        </>
    )
  }