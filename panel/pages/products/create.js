import React from 'react'
import Layout from '../../components/Layout'
import Title from '../../components/Title'
import { useMutation, useQuery, fetcher } from '../../lib/graphql'
import { useFormik } from 'formik'
import { useRouter } from 'next/router'
import Button from '../../components/Button'
import Input from '../../components/Input'
import Select from '../../components/Select'
import * as Yup from 'yup'

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

const ProductSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Por favor, informe um nome com pelo menos 3 caracteres.')
    .required('Por favor, informe um nome.'),
  slug: Yup.string()
    .min(3, 'Por favor, informe um slug com pelo menos 3 caracteres.')
    .required('Por favor, informe um slug.')
    .test(
      'is-unique',
      'Por favor, utilize outro slug. Este já está em uso.',
      async value => {
        const ret = await fetcher(
          JSON.stringify({
            query: `
              query {
                getProductBySlug(slug: "${value}"){
                  id
                }
              }
            
            `
          })
        )
        if (ret.errors) {
          return true
        }
        return false
      }
    ),
  description: Yup.string()
    .min(20, 'Por favor, informe uma descrição com pelo menos 20 caracteres.')
    .required('Por favor, informe uma descrição.'),
  category: Yup.string()
    .required('Por favor, informe uma categoria.')
    .min(1, 'Por favor, informe uma categoria.')
})

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
    },
    validationSchema: ProductSchema
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
                  errorMessage={form.errors.name}
                ></Input>
                <Input
                  label='Slug do produto'
                  placeholder='Preencha com o slug do produto'
                  value={form.values.slug}
                  onChange={form.handleChange}
                  name='slug'
                  helpText='Slug é utilizado para URLs amigáveis'
                  errorMessage={form.errors.slug}
                ></Input>
                <Input
                  label='Descrição do produto'
                  placeholder='Preencha com a descrição do produto'
                  value={form.values.description}
                  onChange={form.handleChange}
                  name='description'
                  errorMessage={form.errors.description}
                ></Input>
                <Select
                  label='Selecione a categoria'
                  name='category'
                  onChange={form.handleChange}
                  value={form.values.category}
                  options={options}
                  errorMessage={form.errors.category}
                  initial={{ id: '', label: 'Selecione...' }}
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