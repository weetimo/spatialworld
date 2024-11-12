import { useState } from 'react'
import { Box, Typography, IconButton } from '@mui/material'
import { Home, MessageSquare, ImagePlus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import HomeContent from './HomeContent'
import QnaContent from './QnaContent'

const Admin_home = () => {
  const [activeTab, setActiveTab] = useState('home')
  const navigate = useNavigate()

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: '280px',
          backgroundColor: 'white',
          boxShadow: '2px 0 4px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 2
        }}
      >
        {/* Logo and Title Container */}
        <Box
          sx={{
            padding: '1rem',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <IconButton
            onClick={() => navigate('/Admin')}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.05)'
              },
              padding: '4px'
            }}
          >
            <img
              src='https://www.sla.gov.sg/qql/slot/u143/Newsroom/Press%20Releases/2019/Grange%20Road/URA%20logo.png'
              alt='URA Logo'
              style={{ height: '60px', width: 'auto' }}
            />
          </IconButton>
        </Box>

        {/* Navigation Buttons */}
        <Box sx={{ padding: '1rem', flexGrow: 1, overflow: 'auto' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box
              onClick={() => setActiveTab('home')}
              sx={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                backgroundColor:
                  activeTab === 'home' ? '#fee2e2' : 'transparent',
                color: activeTab === 'home' ? '#dc2626' : 'inherit',
                '&:hover': {
                  backgroundColor: activeTab === 'home' ? '#fee2e2' : '#f3f4f6'
                }
              }}
            >
              <Home size={20} style={{ marginRight: '12px' }} />
              <Typography>Home</Typography>
            </Box>

            <Box
              onClick={() => setActiveTab('qa')}
              sx={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                backgroundColor: activeTab === 'qa' ? '#fee2e2' : 'transparent',
                color: activeTab === 'qa' ? '#dc2626' : 'inherit',
                '&:hover': {
                  backgroundColor: activeTab === 'qa' ? '#fee2e2' : '#f3f4f6'
                }
              }}
            >
              <MessageSquare size={20} style={{ marginRight: '12px' }} />
              <Typography>Q&A</Typography>
            </Box>

            <Box
              onClick={() => setActiveTab('ai')}
              sx={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                backgroundColor: activeTab === 'ai' ? '#fee2e2' : 'transparent',
                color: activeTab === 'ai' ? '#dc2626' : 'inherit',
                '&:hover': {
                  backgroundColor: activeTab === 'ai' ? '#fee2e2' : '#f3f4f6'
                }
              }}
            >
              <ImagePlus size={20} style={{ marginRight: '12px' }} />
              <Typography>AI Image Generations</Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Main Content Area */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          backgroundColor: 'white',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <Box
          sx={{
            padding: '1rem 2rem',
            backgroundColor: 'white',
            zIndex: 1
          }}
        >
          <Typography variant='h5'>Public Engagement Dashboard</Typography>
        </Box>

        {/* Scrollable Content Area */}
        <Box
          sx={{
            flexGrow: 1,
            padding: '2rem',
            overflow: 'auto'
          }}
        >
          <Box
            sx={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '1.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
          >
            {activeTab === 'home' && <HomeContent />}
            {activeTab === 'qa' && <QnaContent />}
            {activeTab === 'ai' && <div>AI Image Generations Content</div>}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default Admin_home

// import { useState } from 'react'
// import {
//   Box,
//   Typography,
//   IconButton,
//   Button,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper
// } from '@mui/material'
// import { Home, MessageSquare, ImagePlus, Download } from 'lucide-react'
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell
// } from 'recharts'

// // Mock data
// const regionData = [
//   { name: 'East', value: 39.11, color: '#ef4444' },
//   { name: 'West', value: 28.02, color: '#fecdd3' },
//   { name: 'Central', value: 23.13, color: '#f97316' },
//   { name: 'North', value: 2.53, color: '#ffd7aa' },
//   { name: 'Northeast', value: 2.5, color: '#fef9c3' }
// ]

// const participantsData = [
//   { id: 1, name: 'Chin Wei Ming', email: 'weiming_chin@mymail.sutd.edu.sg' },
//   { id: 2, name: 'Aditya Kumar', email: 'aditya_kumar@mymail.sutd.edu.sg' },
//   { id: 3, name: 'Caitlin Chiang', email: 'caitlin_chiang@mymail.sutd.edu.sg' },
//   { id: 4, name: 'Wang Zi Xuan', email: 'zixuan_wang@mymail.sutd.edu.sg' },
//   { id: 5, name: 'Timothy Wee', email: 'timothy_wee@mymail.sutd.edu.sg' }
// ]

// const demographicsData = [
//   { age: '18-24', male: 10, female: 8 },
//   { age: '25-34', male: 15, female: 12 },
//   { age: '35-44', male: 12, female: 20 },
//   { age: '45-64', male: 18, female: 25 },
//   { age: '65+', male: 22, female: 28 }
// ]

// const Admin_home = () => {
//   const [activeTab, setActiveTab] = useState('home')

//   const exportToCSV = () => {
//     const headers = ['Name', 'Email']
//     const csvData = participantsData
//       .map((p) => `${p.name},${p.email}`)
//       .join('\n')
//     const csvContent = `${headers.join(',')}\n${csvData}`
//     const blob = new Blob([csvContent], { type: 'text/csv' })
//     const url = window.URL.createObjectURL(blob)
//     const link = document.createElement('a')
//     link.href = url
//     link.download = 'participants.csv'
//     link.click()
//   }

//   const HomeContent = () => (
//     <Box>
//       <Typography
//         variant='h6'
//         sx={{ mb: 2, fontWeight: 500, fontSize: '1.1rem', color: '#6B7280' }}
//       >
//         Demographics
//       </Typography>
//       <Typography
//         variant='h6'
//         sx={{ mb: 2, fontWeight: 700, fontSize: '1.4rem' }}
//       >
//         Age & Gender
//       </Typography>
//       <Box
//         sx={{
//           height: '400px',
//           backgroundColor: 'white',
//           p: 2,
//           borderRadius: '8px',
//           boxShadow: '0 2px 3px rgba(0,0,0,0.1)'
//         }}
//       >
//         <ResponsiveContainer width='100%' height='100%'>
//           <BarChart
//             layout='vertical'
//             data={demographicsData}
//             margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
//           >
//             <XAxis type='number' />
//             <YAxis dataKey='age' type='category' />
//             <Tooltip
//               cursor={false}
//               content={({ payload }) => {
//                 if (!payload || !payload.length) return null

//                 const colors = {
//                   Male: '#ef4444',
//                   Female: '#f97316'
//                 }

//                 return (
//                   <div
//                     style={{
//                       backgroundColor: 'white',
//                       padding: '8px',
//                       border: '1px solid #ccc',
//                       borderRadius: '4px'
//                     }}
//                   >
//                     {payload.map((item) => (
//                       <div
//                         key={item.name}
//                         style={{
//                           color: colors[item.name as keyof typeof colors]
//                         }}
//                       >
//                         {item.name}: {item.value}
//                       </div>
//                     ))}
//                   </div>
//                 )
//               }}
//             />
//             <Legend />
//             <Bar
//               dataKey='male'
//               name='Male'
//               fill='#ef4444'
//               stackId='stack'
//               barSize={30}
//             />
//             <Bar
//               dataKey='female'
//               name='Female'
//               fill='#f97316'
//               stackId='stack'
//               barSize={30}
//             />
//           </BarChart>
//         </ResponsiveContainer>
//       </Box>

//       {/* Location Section */}
//       <Box sx={{ mt: 6, mb: 4 }}>
//         <Typography
//           variant='h6'
//           sx={{ mb: 2, fontWeight: 500, fontSize: '1.1rem', color: '#6B7280' }}
//         >
//           Location
//         </Typography>
//         <Typography
//           variant='h6'
//           sx={{ mb: 2, fontWeight: 700, fontSize: '1.4rem' }}
//         >
//           Regions
//         </Typography>

//         <Box sx={{ display: 'flex', gap: 4 }}>
//           {/* Pie Chart */}
//           <Box sx={{ width: '300px', height: '300px' }}>
//             <ResponsiveContainer>
//               <PieChart>
//                 <Pie
//                   data={regionData}
//                   dataKey='value'
//                   nameKey='name'
//                   cx='50%'
//                   cy='50%'
//                   outerRadius={100}
//                 >
//                   {regionData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={entry.color} />
//                   ))}
//                 </Pie>
//                 <Tooltip
//                   formatter={(value: number) => `${value.toFixed(2)}%`}
//                 />
//               </PieChart>
//             </ResponsiveContainer>
//           </Box>

//           {/* Legend */}
//           <Box
//             sx={{
//               display: 'flex',
//               flexDirection: 'column',
//               gap: 1,
//               justifyContent: 'center'
//             }}
//           >
//             {regionData.map((region) => (
//               <Box
//                 key={region.name}
//                 sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
//               >
//                 <Box
//                   sx={{
//                     width: 12,
//                     height: 12,
//                     borderRadius: '50%',
//                     backgroundColor: region.color
//                   }}
//                 />
//                 <Typography>{region.name}</Typography>
//                 <Typography sx={{ color: '#6B7280' }}>
//                   {region.value}%
//                 </Typography>
//               </Box>
//             ))}
//           </Box>
//         </Box>
//       </Box>

//       {/* Participants List Section */}
//       <Box sx={{ mt: 6 }}>
//         <Box
//           sx={{
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//             mb: 3
//           }}
//         >
//           <Typography variant='h6' sx={{ fontWeight: 600 }}>
//             Participants List
//           </Typography>
//           <Button
//             onClick={exportToCSV}
//             startIcon={<Download size={18} />}
//             variant='outlined'
//             sx={{ borderRadius: '8px' }}
//           >
//             Export to CSV
//           </Button>
//         </Box>

//         <TableContainer
//           component={Paper}
//           sx={{ boxShadow: '0 2px 3px rgba(0,0,0,0.1)', borderRadius: '8px' }}
//         >
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Name</TableCell>
//                 <TableCell>Email</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {participantsData.map((participant) => (
//                 <TableRow key={participant.id}>
//                   <TableCell>{participant.name}</TableCell>
//                   <TableCell>{participant.email}</TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Box>
//     </Box>
//   )

//   return (
//     <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
//       {/* Sidebar */}
//       <Box
//         sx={{
//           width: '280px',
//           backgroundColor: 'white',
//           boxShadow: '2px 0 4px rgba(0,0,0,0.1)',
//           display: 'flex',
//           flexDirection: 'column',
//           zIndex: 2
//         }}
//       >
//         {/* Logo and Title Container */}
//         <Box
//           sx={{
//             padding: '1rem',
//             borderBottom: '1px solid #e5e7eb',
//             display: 'flex',
//             alignItems: 'center',
//             gap: 2
//           }}
//         >
//           <IconButton
//             sx={{
//               '&:hover': {
//                 backgroundColor: 'rgba(0,0,0,0.05)'
//               },
//               padding: '4px'
//             }}
//           >
//             <img
//               src='https://www.sla.gov.sg/qql/slot/u143/Newsroom/Press%20Releases/2019/Grange%20Road/URA%20logo.png'
//               alt='URA Logo'
//               style={{ height: '60px', width: 'auto' }}
//             />
//           </IconButton>
//         </Box>

//         {/* Navigation Buttons */}
//         <Box sx={{ padding: '1rem', flexGrow: 1, overflow: 'auto' }}>
//           <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
//             <Box
//               onClick={() => setActiveTab('home')}
//               sx={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 padding: '0.75rem 1rem',
//                 borderRadius: '8px',
//                 cursor: 'pointer',
//                 transition: 'all 0.2s',
//                 backgroundColor:
//                   activeTab === 'home' ? '#fee2e2' : 'transparent',
//                 color: activeTab === 'home' ? '#dc2626' : 'inherit',
//                 '&:hover': {
//                   backgroundColor: activeTab === 'home' ? '#fee2e2' : '#f3f4f6'
//                 }
//               }}
//             >
//               <Home size={20} style={{ marginRight: '12px' }} />
//               <Typography>Home</Typography>
//             </Box>

//             <Box
//               onClick={() => setActiveTab('qa')}
//               sx={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 padding: '0.75rem 1rem',
//                 borderRadius: '8px',
//                 cursor: 'pointer',
//                 transition: 'all 0.2s',
//                 backgroundColor: activeTab === 'qa' ? '#fee2e2' : 'transparent',
//                 color: activeTab === 'qa' ? '#dc2626' : 'inherit',
//                 '&:hover': {
//                   backgroundColor: activeTab === 'qa' ? '#fee2e2' : '#f3f4f6'
//                 }
//               }}
//             >
//               <MessageSquare size={20} style={{ marginRight: '12px' }} />
//               <Typography>Q&A</Typography>
//             </Box>

//             <Box
//               onClick={() => setActiveTab('ai')}
//               sx={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 padding: '0.75rem 1rem',
//                 borderRadius: '8px',
//                 cursor: 'pointer',
//                 transition: 'all 0.2s',
//                 backgroundColor: activeTab === 'ai' ? '#fee2e2' : 'transparent',
//                 color: activeTab === 'ai' ? '#dc2626' : 'inherit',
//                 '&:hover': {
//                   backgroundColor: activeTab === 'ai' ? '#fee2e2' : '#f3f4f6'
//                 }
//               }}
//             >
//               <ImagePlus size={20} style={{ marginRight: '12px' }} />
//               <Typography>AI Image Generations</Typography>
//             </Box>
//           </Box>
//         </Box>
//       </Box>

//       {/* Main Content Area */}
//       <Box
//         sx={{
//           flexGrow: 1,
//           display: 'flex',
//           flexDirection: 'column',
//           height: '100vh',
//           backgroundColor: 'white',
//           overflow: 'hidden'
//         }}
//       >
//         {/* Header */}
//         <Box
//           sx={{
//             padding: '1rem 2rem',
//             backgroundColor: 'white',
//             zIndex: 1
//           }}
//         >
//           <Typography variant='h5'>Public Engagement Dashboard</Typography>
//         </Box>

//         {/* Scrollable Content Area */}
//         <Box
//           sx={{
//             flexGrow: 1,
//             padding: '2rem',
//             overflow: 'auto'
//           }}
//         >
//           <Box
//             sx={{
//               backgroundColor: 'white',
//               borderRadius: '8px',
//               padding: '1.5rem',
//               boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
//             }}
//           >
//             {activeTab === 'home' && <HomeContent />}
//             {activeTab === 'qa' && <div>Q&A Content</div>}
//             {activeTab === 'ai' && <div>AI Image Generations Content</div>}
//           </Box>
//         </Box>
//       </Box>
//     </Box>
//   )
// }

// export default Admin_home
