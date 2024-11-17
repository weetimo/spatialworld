export const mockData = {
  multipleChoice: [
    {
      question: 'What interests you most about the redevelopment?',
      responses: [
        { answer: 'Heritage', count: 13 },
        { answer: 'Sustainability', count: 26 },
        { answer: 'Urban Resilience', count: 19 },
        { answer: 'Technology', count: 30 },
        { answer: 'Greenery', count: 18 }
      ]
    },
    {
      question: 'Have you visited this SUTD green space or its surrounding areas before?',
      responses: [
        { answer: 'Yes!', count: 13 },
        { answer: "No, I don't have a chance.", count: 26 },
        { answer: "I'm not sure", count: 19 },
        { answer: 'Where is it?', count: 30 }
      ]
    },
    {
      // New multiple choice question
      question: 'How often would you use this space if it was redeveloped?',
      responses: [
        { answer: 'Daily', count: 35 },
        { answer: '2-3 times a week', count: 28 },
        { answer: 'Once a week', count: 15 },
        { answer: 'Occasionally', count: 22 },
        { answer: 'Rarely', count: 8 }
      ]
    }
  ],
  openEnded: [
    {
      question: 'What are some of the daily issues you face?',
      responses: [
        'The sun is too hot...',
        'It is not walkable after it rains because the grass get too wet',
        'Not sheltered',
        'Too far from campus',
        'No food option after 7pm',
        'Needs more eateries',
        'Need more parking lots'
      ]
    },
    {
      // New open-ended question
      question: 'What amenities would you like to see in the redeveloped space?',
      responses: [
        'Study areas with power outlets',
        'More covered walkways',
        'Bicycle parking facilities',
        'Outdoor fitness equipment',
        'Water fountains',
        'Vending machines',
        'Better lighting for evening use',
        'Small event space'
      ]
    }
  ]
};
