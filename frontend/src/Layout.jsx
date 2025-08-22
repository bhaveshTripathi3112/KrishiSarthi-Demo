import React from 'react'
import { Footer, Header , Home } from './components'
import { Outlet } from 'react-router-dom'
function Layout() {
  return (
    <>
        <Header/>
        <Outlet/>
        <Footer/>
    </>
  )
}

export default Layout
