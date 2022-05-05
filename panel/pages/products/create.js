import React from 'react'
import Layout from '../../components/Layout'
import Title from '../../components/Title'
import { useMutation, useQuery } from '../../lib/graphql'
import { useFormik } from 'formik'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Button from '../../components/Button'
import Input from '../../components/Input'
import Select from '../../components/Select'

const CREATE_PRODUCT = `
    mutation createProduct($name: String!, $slug: String!, $description: String!, $category: String!) {
      createProduct (input: {
        name: $name,
        slug: $slug,
        description: $description,
        category: $category
      }) {
        id
        name
        slug
      }
    }
  `

const GET_ALL_CATEGORIES = `
    query {
      getAllCategories {
        id name slug
      }
    }
  `

const GET_ALL_PRODUCTS = `
    query {
      getAllProducts {
        id, name, slug, description
      }
    }
  `

const Index = () => {
  const router = useRouter()
  const [data, createProduct] = useMutation(CREATE_PRODUCT)
  const { data: categories, mutate } = useQuery(GET_ALL_CATEGORIES)
  const form = useFormik({
    initialValues: {
      name: '',
      slug: '',
      description: '',
      category: ''
    },
    onSubmit: async values => {
      const data = await createProduct(values)
      if (data && !data.errors) {
        router.push('/products')
      }
    }
  })
  let options = []
  if (categories && categories.getAllCategories) {
    options = categories.getAllCategories.map(item => {
      return {
        id: item.id,
        label: item.name
      }
    })
  }
  return (
    <Layout>
      <Title>Criar novo produto</Title>
      <div className='mt-8'></div>
      <div>
        <Button.LinkOutLine href='/products'>Voltar</Button.LinkOutLine>
      </div>
      <div className='flex flex-col mt-8'>
        <div className='-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8'>
          <div className='align-middle inline-block min-w-full shadow bg-white overflow-hidden sm:rounded-lg border-b border-gray-200 p-12'>
            {data && !!data.errors && (
              <p className='bg-red-100 border border-red-400 mb-4 text-red-700 px-4 py-3 rounded relative'>
                Ocorreu um erro ao salvar os dados.
              </p>
            )}
            <form onSubmit={form.handleSubmit}>
              <div className='flex flex-wrap -mx-3 mb-6'>
                <Input
                  label='Nome do produto'
                  placeholder='Preencha com o nome do produto'
                  value={form.values.name}
                  onChange={form.handleChange}
                  name='name'
                ></Input>
                <Input
                  label='Slug do produto'
                  placeholder='Preencha com o slug do produto'
                  value={form.values.slug}
                  onChange={form.handleChange}
                  name='slug'
                  helpText='Slug é utilizado para URLs amigáveis'
                ></Input>
                <Input
                  label='Descrição do produto'
                  placeholder='Preencha com a descrição do produto'
                  value={form.values.description}
                  onChange={form.handleChange}
                  name='description'
                ></Input>
                <Select
                  label='Selecione a categoria'
                  name='category'
                  onChange={form.handleChange}
                  value={form.values.category}
                  options={options}
                />
              </div>
              <Button type={'submit'}>{'Criar produto'}</Button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}
export default Index
