  export const exportToCSV = (data: any[]) => {
    // Define headers for all fields
    const headers = [
      'ID',
      'Name',
      'Email',
      'Gender',
      'Age Group',
      'Postal Code'
    ]

    // Convert data to CSV format
    const csvContent = [
      // Add headers as first row
      headers.join(','),
      // Map data to rows
      ...data.map(row => [
        row.id,
        row.name,
        row.email,
        row.gender,
        row.ageGroup,
        row.postalCode
      ].join(','))
    ].join('\n')

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', 'participants_data.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
