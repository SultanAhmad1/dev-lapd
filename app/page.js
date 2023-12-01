"use client";

import Products from './components/Products';
import Layout from './components/Layout';
import NothingFound from './components/NothingFound';
import HomeContext from './contexts/HomeContext';
import { useContext } from 'react';

export default function Home() 
{

  const {ismenuavailable} = useContext(HomeContext)
  const navcategories = [
    {
      id: 1,
      title: 'Feature item1'
    },
    {
      id: 2,
      title: 'Feature item2'
    },
    {
      id: 3,
      title: 'Feature item3'
    },
    {
      id: 4,
      title: 'Feature item4'
    },
    {
      id: 5,
      title: 'Feature item5'
    },
    {
      id: 6,
      title: 'Feature item6'
    },
    {
      id: 7,
      title: 'Feature item7'
    }
  ]  
  
  // Fetch Menu From Database.
  /**
   * There if the nothing is available then i can show Noting found.
   */
  
  return (
    <Layout>
      { (ismenuavailable) ? <Products /> : <NothingFound /> }
    </Layout>
  )
}
