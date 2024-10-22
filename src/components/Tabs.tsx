import React, { useState } from 'react'
import { Box, Tab, Tabs } from '@mui/material'

interface TabsProps {
  tabs: { label: string; content: React.ReactNode }[]
}

const TabsComponent: React.FC<TabsProps> = ({ tabs }) => {
  const [selectedTab, setSelectedTab] = useState(0)

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue)
  }

  return (
    <Box
      sx={{
        margin: '-1.8rem auto',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1
      }}
    >
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        TabIndicatorProps={{
          style: { display: 'none' },
        }}
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '16px',
          '& .MuiTab-root': {
            backgroundColor: '#f5f5f5',
            borderRadius: '2rem',
            textTransform: 'none',
            color: 'black',
            margin: '0 8px',
            flexGrow: 1,
            flexBasis: 0,
            minWidth: 'auto',
            minHeight: '10px'
          },
          '& .Mui-selected': {
            backgroundColor: '#e0e0e0',
            color: 'black'
          }
        }}
      >
        {tabs.map((tab, index) => (
          <Tab key={index} label={tab.label} />
        ))}
      </Tabs>

      <Box sx={{ padding: '1rem', flexGrow: 1, overflowY: 'auto' }}>
        {tabs[selectedTab].content}
      </Box>
    </Box>
  )
}

export default TabsComponent
