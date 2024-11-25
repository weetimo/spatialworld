import { ageGroups } from '../../../constants'

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

export const demographicsData = (users: any[]) => {
  const result = ageGroups.map(ageGroup => ({
    age: ageGroup,
    male: 0,
    female: 0
  }))

  users.forEach(({ ageGroup, gender }) => {
    const demographic = result.find(item => item.age === ageGroup)

    if (gender === 'MALE') {
      demographic.male += 1
    } else if (gender === 'FEMALE') {
      demographic.female += 1
    }
  })

  return result
}

export const regionData = (users: any[]) => {
  const regions = [
    {
      region: "Central",
      postalCodes: [
        "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13",
        "14", "15", "16", "17", "18", "19", "20", "21", "31", "32", "33", "34", "35",
        "36", "37", "56", "57"
      ],
      color: "#ef4444"
    },
    {
      region: "East",
      postalCodes: [
        "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50",
        "51", "52"
      ],
      color: "#fecdd3"
    },
    {
      region: "West",
      postalCodes: [
        "22", "23", "24", "25", "26", "27", "60", "61", "62", "63", "64", "65", "66",
        "67", "68", "69", "70", "71"
      ],
      color: "#f97316"
    },
    {
      region: "North",
      postalCodes: ["72", "73", "75", "76", "77", "78"],
      color: "#ffd7aa"
    },
    {
      region: "North-East",
      postalCodes: ["28", "29", "30", "53", "54", "55", "58", "59"],
      color: "#fef9c3"
    }
  ]

  const regionCounts = users.reduce((acc, user) => {
    const firstTwoDigits = user.postalCode.slice(0, 2)
    const region = regions.find(r => r.postalCodes.includes(firstTwoDigits))

    if (region) {
      acc[region.region] = (acc[region.region] || 0) + 1
    }
    return acc
  }, {} as Record<string, number>)

  const totalUsers = users.length

  return regions.map(({ region, color }) => ({
    name: region,
    value: Number(((regionCounts[region] || 0) / totalUsers * 100).toFixed(2)),
    color
  }))
}
