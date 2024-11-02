import React from 'react'
import { Box, Tab, Tabs } from '@mui/material'

interface TabsProps {
  tabs: { label: string; content: React.ReactNode }[]
  selectedTab: number
  onTabChange: (index: number) => void
}

const TabsComponent: React.FC<TabsProps> = ({ tabs, selectedTab, onTabChange }) => {
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    onTabChange(newValue)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        overflow: 'hidden'
      }}
    >
      <Box
        sx={{
          position: 'sticky',
          backgroundColor: '#F6FAFF', 
          borderRadius: '25px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%'
        }}
      >
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          TabIndicatorProps={{
            style: { display: 'none' }
          }}
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            '& .MuiTab-root': {
              borderRadius: '25px',
              textTransform: 'none',
              color: 'black',
              flexGrow: 1,
              flexBasis: 0,
              minWidth: 'auto',
              '&:focus': { outline: 'none' },
              '&:focus-visible': { outline: 'none' }
            },
            '& .Mui-selected': {
              backgroundColor: '#007bff',
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
          overflowY: 'auto',
          maxHeight: 'calc(100vh - 140px)'
        }}
      >
        {tabs[selectedTab].content}
      </Box>
    </Box>
  )
}

export default TabsComponent
