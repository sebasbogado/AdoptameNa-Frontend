import {Roboto} from 'next/font/google'
import "@styles/globals.css"
import {AppProvider} from '@contexts/appContext'

const roboto= Roboto({subsets:["latin"], weight:["300", "400", "500", "700"]})

export const metadata = {
  title: "AdoptameNa",
  description: "Proyecto de IngeSoft 2"
}

export default function RootLayout({children}){
  return(
    <html lang='es'>
      <body className={roboto.className}>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  )
}