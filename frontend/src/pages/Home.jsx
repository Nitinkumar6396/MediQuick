// eslint-disable-next-line no-unused-vars
import React from 'react'
import Header from '../components/Header'
import SpecialityMenu from '../components/SpecialityMenu'
import TopDoctors from '../components/TopDoctors'
import Banner from '../components/Banner'
TopDoctors

const Home = () => {
  return (
    <div className=''>
      <Header/>
      <SpecialityMenu />
      <TopDoctors/>
      <Banner/>
    </div>
  )
}

export default Home