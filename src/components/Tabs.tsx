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
          {tabs.map((tab, index) => <Tab key={index} label={tab.label} sx={styles.tab} /> )}
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

const styles = {
  container: {
    margin: '-1.6rem auto',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    height: '45vh',
    overflow: 'hidden',
  },
  tabContainer: {
    position: 'sticky',
    backgroundColor: '#EDEDED',
    maxWidth: '350px',
    borderRadius: '0.5rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    margin: '0 auto',
  },
  tabs: {
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
      '&:focus-visible': { outline: 'none' },
    },
    '& .Mui-selected': {
      backgroundColor: '#F1C385',
      color: 'black !important',
    },
  },
  tab: {
    color: 'black',
  },
  content: {
    padding: '1rem',
    flexGrow: 1,
    overflowY: 'auto',
    maxHeight: 'calc(100vh - 140px)',
    mt: '1rem',
  }
}

export default TabsComponent
