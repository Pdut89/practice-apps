import React, { useState, useEffect } from 'react'
import ExpandingPanel from '../components/expanding-panel'


const Home = () => {

  const [isLoading, setIsLoading] = useState(true)
  const [searchValue, setSearchValue] = useState('Learn hooks')

  const cleanup = () => {
    console.log('runs before every subsequent useEffect call')
  }

  useEffect(() => {
    console.log('running useEffect')
    loadData()

    return () => {
      cleanup()
    }
  }, [searchValue])

  useEffect(() => {
    return () => {
      console.log('component will unmount')
    }
  }, [])

  const loadData = () => {
    setIsLoading(true)
    setTimeout(() => {setIsLoading(false)}, 1000)
  }

  const handleInputChange = event => {
    setSearchValue(event.target.value)
  }

  const searchInput = (
    <input
      value={searchValue}
      onChange={handleInputChange}
      style={{marginBottom: 30}}
    />
  )

  return (
    <div style={{padding: 30}}>

      {searchInput}

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <ExpandingPanel title="Learning about hooks">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </ExpandingPanel>
      )}

    </div>
  )
}

export default Home
