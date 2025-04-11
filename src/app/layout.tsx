"use client";

import React from 'react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
    styles: {
        global: {
            body: {
                margin: 0,
                padding: 0,
                boxSizing: 'border-box',
                fontFamily: "'Arial', sans-serif",
            },
        },
    },
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <ChakraProvider >
                    {children}
                </ChakraProvider>
            </body>
        </html>
    );
}
