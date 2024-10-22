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
        margin: '-1.6rem auto',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        height: '45vh',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'sticky',
          backgroundColor: '#f2e5d9',
          maxWidth: '350px',
          borderRadius: '0.5rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          margin: '0 auto'
        }}
      >
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          TabIndicatorProps={{
            style: { display: 'none' },
          }}
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            '& .MuiTab-root': {
              borderRadius: '0.5rem',
              textTransform: 'none',
              color: 'black',
              margin: '0.5rem',
              flexGrow: 1,
              flexBasis: 0,
              minWidth: 'auto',
              minHeight: '32px',
              padding: '6px 16px',
              fontWeight: 'bold',
              '&:focus': { outline: 'none' },
              '&:focus-visible': { outline: 'none' }
            },
            '& .Mui-selected': {
              backgroundColor: '#d97b4f',
              color: 'white !important'
            },
            '& .MuiTab-textColorPrimary': {
              color: 'black'
            },
            '& .MuiTab-textColorInherit': {
              color: 'black'
            }
          }}
        >
          {tabs.map((tab, index) => (
            <Tab key={index} label={tab.label} />
          ))}
        </Tabs>
      </Box>

      <Box
        sx={{
          padding: '1rem',
          flexGrow: 1,
          overflowY: 'auto',
          maxHeight: 'calc(100vh - 140px)',
          mt: '1rem'
        }}
      >
        {tabs[selectedTab].content}
      </Box>
    </Box>
  )
}

export default TabsComponent
