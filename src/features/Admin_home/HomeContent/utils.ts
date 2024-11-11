export const exportToCSV = (participantsData: any[]) => {
    const headers = ['Name', 'Email']
    const csvData = participantsData
      .map((p) => `${p.name},${p.email}`)
      .join('\n')
    const csvContent = `${headers.join(',')}\n${csvData}`
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'participants.csv'
    link.click()
  }
