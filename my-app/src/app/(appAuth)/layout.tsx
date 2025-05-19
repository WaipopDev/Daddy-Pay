import Sidebar from "@/components/Sidebar/Sidebar"

export default function AppAuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <section>
    <Sidebar title={'title'} titleBar={'titleBar'} slug={'slug'} />
    {children}
    </section>
}