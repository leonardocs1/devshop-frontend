import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useMutation, useQuery } from '../../../lib/graphql'
import { useFormik } from 'formik'
import Layout from '../../../components/Layout'
import Title from '../../../components/Title'
import Input from '../../../components/Input'
import Button from '../../../components/Button'
import Select from '../../../components/Select'

const GET_ALL_CATEGORIES = `
    query {
      getAllCategories {
        id name slug
      }
    }
  `
const UPDATE_PRODUCT = `
  mutation updateProduct($id: String!, $name: String!, $slug: String!, $description: String!, $category: String!) {
    updateProduct(input: {
      id: $id,
      name: $name,
      slug: $slug,
      description: $description,
      category: $category
    }) {
      id
      name
      slug
      description
      category
    }
  }
  `
const Edit = () => {
  const router = useRouter()
  const { data } = useQuery(`
    query {
      getProductById(id: "${router.query.id}") {
        id
        name
        slug
        description
        category
      }
    }
    `)
  const { data: categories, mutate } = useQuery(GET_ALL_CATEGORIES)
  const [updatedData, updateCategory] = useMutation(UPDATE_PRODUCT)
  const form = useFormik({
    initialValues: {
      name: '',
      slug: '',
      description: '',
      category: ''
    },
    onSubmit: async values => {
      const category = {
        ...values,
        id: router.query.id
      }
      await updateCategory(category)
      router.push('/products')
    }
  })

  // passsagem de dados para o formulário
  useEffect(() => {
    if (data && data.getProductById) {
      console.log(data.getProductById)
      form.setFieldValue('name', data.getProductById.name)
      form.setFieldValue('slug', data.getProductById.slug)
      form.setFieldValue('description', data.getProductById.description)
      form.setFieldValue('category', data.getProductById.category)
    }
  }, [data])
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
      <Title>Editar produto</Title>
      <div className='mt-8'></div>
      <div className='flex flex-col mt-8'>
        <div className='-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8'>
          <div className='align-middle inline-block min-w-full shadow bg-white overflow-hidden sm:rounded-lg border-b border-gray-200 p-12'>
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
              <Button type={'submit'}>{'Salvar produto'}</Button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}
export default Edit
