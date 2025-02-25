import type { Metadata } from "next";
import localFont from 'next/font/local'
import { StoreProvider } from "./StoreProvider";


import 'bootstrap/dist/css/bootstrap.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./globals.css";

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
    title: "Create Next App",
    description: "Generated by create next app",
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
                </body>
            </html>
        </StoreProvider>
    );
}
