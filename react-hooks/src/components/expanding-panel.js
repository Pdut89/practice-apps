import React, { memo, useState } from 'react'

const styles = {
  container: {
    width: 500,
    border: '2px solid #ccc',
    borderRadius: 10
  },
  grow: {
    flex: 1
  },
  header: {
    display: 'flex',
    padding: '30px 15px'
  },
  panelOpen: {
    padding: 15,
    height: 200,
    overflow: 'hidden',
    transition: '200ms linear'
  },
  panelClosed: {
    padding: '0 15px',
    height: 0,
    overflow: 'hidden',
    transition: '200ms linear'
  }
}

const ExpandingPanel = ({title, children, ...other}) => {
  console.log('renders')

  const [panelOpen, togglePanelState] = useState(true)

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        {title}
         <span style={styles.grow}/>
        <button onClick={() => {togglePanelState(!panelOpen)}}>
          Toggle
        </button>
      </div>

      <div style={panelOpen ? styles.panelOpen : styles.panelClosed}>
        {children}
      </div>
    </div>
  )
}

export default memo(ExpandingPanel)
