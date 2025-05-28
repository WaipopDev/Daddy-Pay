import AdminNavbar from "@/components/Navbars/AdminNavbar"
import HeaderBar from "@/components/Navbars/HeaderBar"
import Sidebar from "@/components/Sidebar/Sidebar"
// import { cookies } from 'next/headers'
// import { getLangData } from '@/lib/getLangData'


const menuItems = [
  {
    title : "Dashboard",
    icon  : 'fa-solid fa-chart-pie',
    path  : "/dashboard",
    active: true,
    key   : "menu_dashboard"
  },
  {
    title: "Report",
    icon: 'fa-solid fa-file-contract',
    path: "/report",
    active: false,
    key: "menu_report"
  },
  {
    title: "Shop Management",
    icon:'fa-solid fa-warehouse',
    path: "/shop-management",
    active: false,
    key: "menu_shop_management"
  },
  {
    title: "Shop Info",
    icon:'fa-solid fa-shop',
    path: "/shop-info",
    active: false,
    key: "menu_shop"
  },
  {
    title: "Machine Info",
    icon:'fas fa-tv',
    path: "/machine-info",
    active: false,
    key: "menu_machine"
  },
  {
    title: "Program Info",
    icon:'fa-solid fa-gear',
    path: "/program-info",
    active: false,
    key: "menu_program"
  },
  {
    title: "User Management",
    icon:'fa-solid fa-user',
    path: "/user-management",
    active: false,
    key: "menu_user"
  },
  {
    title: "Setting Language",
    icon: 'fa-solid fa-language',
    path: "/language-settings",
    active: false,
    key: "menu_set_language"
  }
];

export default  async function AppAuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // const cookieStore = await cookies()
    // const langCode = cookieStore.get('lang')?.value || 'en'
    // const token = cookieStore.get('token')?.value || ''
    // const langData = await getLangData(langCode, token)
    // const currentPath = cookieStore.get('next-url')?.value || ''
    // const currentMenu = menuItems.find(item => currentPath.startsWith(item.path))
    // console.log("🚀 ~ currentMenu:", currentMenu)
    // console.log("🚀 ~ currentPath:", currentPath)
    // console.log("🚀 ~ langCode:", langCode)
    return (
        <section className="bg-[#ECEEF6] min-h-screen">
            <AdminNavbar />
            <div className="flex pt-[80px]">
                <Sidebar {...menuItems} />
                
                <div className="pl-[14rem] w-full">
                    <div className="p-2">
                        <HeaderBar {...menuItems} />
                        {children}
                    </div>
                </div>
            </div>
        </section>
    )
}