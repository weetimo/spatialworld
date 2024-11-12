// import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts'

import { mockData } from './data'

const QnaContent = () => {
  return (
    <div className='p-6 max-w-6xl mx-auto space-y-8'>
      {/* Multiple Choice Questions */}
      {mockData.multipleChoice.map((question, index) => (
        <div key={index} className='bg-white rounded-lg shadow-sm p-6 mb-6'>
          <h2 className='text-lg font-medium mb-4'>{question.question}</h2>
          <div className='h-[300px]'>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart data={question.responses}>
                <CartesianGrid strokeDasharray='3 3' vertical={false} />
                <XAxis
                  dataKey='answer'
                  tick={{ fill: '#666', fontSize: 12 }}
                  interval={0}
                  width={80}
                  tickFormatter={(value) => {
                    return value.length > 15
                      ? `${value.substring(0, 15)}...`
                      : value
                  }}
                />
                <YAxis tick={{ fill: '#666' }} />
                <Bar
                  dataKey='count'
                  fill='#4F46E5'
                  radius={[4, 4, 0, 0]}
                  label={{
                    position: 'top',
                    fill: '#666',
                    fontSize: 12
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ))}

      {/* Open Ended Question */}
      <div className='bg-white rounded-lg shadow-sm p-6'>
        <h2 className='text-lg font-medium mb-4'>
          {mockData.openEnded.question}
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {mockData.openEnded.responses.map((response, index) => (
            <div key={index} className='bg-gray-50 p-4 rounded-lg'>
              {response}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default QnaContent
