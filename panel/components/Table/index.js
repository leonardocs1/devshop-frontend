import React from 'react'

const Table = ({ children }) => <table className='min-w-full'>{children}</table>

const TableHead = ({ children }) => (
  <thead>
    <tr>{children}</tr>
  </thead>
)

const TableTh = ({ children }) => (
  <th className='px-6 py-3 border-b border-gray-200 text-left text-xs leading-4 font-medium text-gray-700 uppercase tracking-wider bg-blue-100'>
    {children}
  </th>
)

const TableTr = ({ children }) => <tr>{children}</tr>

const TableTd = ({ children }) => (
  <td className='px-6 py-4 whitespace-no-wrap border-b border-gray-200'>
    {children}
  </td>
)

const TableBody = ({ children }) => (
  <tbody className='bg-white'>{children}</tbody>
)

Table.Head = TableHead
Table.Th = TableTh
Table.Tr = TableTr
Table.Td = TableTd
Table.Body = TableBody
export default Table
