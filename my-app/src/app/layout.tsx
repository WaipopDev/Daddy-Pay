import type { Metadata } from "next";
import localFont from 'next/font/local'
import { StoreProvider } from "./StoreProvider";


import 'bootstrap/dist/css/bootstrap.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./globals.css";
import "@/styles/main.scss";
import ModalAlert from "@/components/Modals/ModalAlert";
import ProcessLoad from "@/components/Modals/ProcessLoad";

const myFont = localFont({
    src: [
        {
            path: '../fonts/SukhumvitSet-Medium.ttf',
            weight: '400',
            style: 'normal',
        },
        {
            path: '../fonts/SukhumvitSet-Bold.ttf',
            weight: '700',
            style: 'normal',
        },
    ]
})

export const metadata: Metadata = {
    title: "Daddy Pay",
    description: "Daddy Pay",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <StoreProvider>
            <html lang="en">
                <body
                    className={myFont.className}
                >
                    {children}
                    <ModalAlert />
                    <ProcessLoad />
                </body>
            </html>
        </StoreProvider>
    );
}
