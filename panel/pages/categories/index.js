import React from 'react'
import Layout from '../../components/Layout'
import Table from '../../components/Table'
import Title from '../../components/Title'
import { useMutation, useQuery } from '../../lib/graphql'
import Link from 'next/link'

const DELETE_CATEGORY = `
mutation deleteCategory($id: String!) {
  deleteCategory (id: $id) 
}
`

const GET_ALL_CATEGORIES = `
    query {
      getAllCategories {
        id, name, slug
      }
    }
  `

const Index = () => {
  const { data, mutate } = useQuery(GET_ALL_CATEGORIES)
  const [deleteData, deleteCategory] = useMutation(DELETE_CATEGORY)
  const remove = id => async () => {
    await deleteCategory({ id })
    mutate()
  }
  return (
    <Layout>
      <Title>Gerenciar categorias</Title>
      <div className='mt-8'></div>
      <div>
        <a href='/categories/create'>Criar categoria</a>
      </div>
      <div className='flex flex-col mt-8'>
        <div className='-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8'>
          {data && data.getAllCategories && data.getAllCategories.length === 0 && (
            <div
              className='bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4'
              role='alert'
            >
              <p>Nenhuma categoria criada até o momento.</p>
            </div>
          )}
          {data && data.getAllCategories && data.getAllCategories.length > 0 && (
            <div className='align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200'>
              <Table>
                <Table.Head>
                  <Table.Th>Categorias</Table.Th>
                  <Table.Th></Table.Th>
                </Table.Head>

                <Table.Body>
                  {data &&
                    data.getAllCategories &&
                    data.getAllCategories.map(item => {
                      return (
                        <Table.Tr key={item.id}>
                          <Table.Td>
                            <div className='flex items-center'>
                              <div>
                                <div className='text-sm leading-5 font-medium text-gray-900'>
                                  {item.name}
                                </div>
                                <div className='text-sm leading-5 text-gray-500'>
                                  {item.slug}
                                </div>
                              </div>
                            </div>
                          </Table.Td>

                          <Table.Td>
                            <Link href={`/categories/${item.id}/edit`}>
                              <a
                                href='#'
                                className='text-indigo-600 hover:text-indigo-900'
                              >
                                Edit
                              </a>
                            </Link>{' '}
                            |
                            <a
                              href='#'
                              className='text-indigo-600 hover:text-indigo-900'
                              onClick={remove(item.id)}
                            >
                              {' '}
                              Remove
                            </a>
                          </Table.Td>
                        </Table.Tr>
                      )
                    })}
                </Table.Body>
              </Table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
export default Index
