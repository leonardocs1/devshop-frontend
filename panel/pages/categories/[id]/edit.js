import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useMutation, useQuery, fetcher } from '../../../lib/graphql'
import { useFormik } from 'formik'
import Layout from '../../../components/Layout'
import Title from '../../../components/Title'
import Input from '../../../components/Input'
import Button from '../../../components/Button'
import * as Yup from 'yup'

let id = ''

const UPDATE_CATEGORY = `
  mutation updateCategory($id: String!, $name: String!, $slug: String!) {
    updateCategory(input: {
      id: $id,
      name: $name,
      slug: $slug
    }) {
      id
      name
      slug
    }
  }
  `

const CategorySchema = Yup.object().shape({
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
                getCategoryBySlug(slug: "${value}"){
                  id
                }
              }
            
            `
          })
        )
        if (ret.errors) {
          return true
        }
        if (ret.data.getCategoryBySlug.id === id) {
          return true
        }
        return false
      }
    )
})

const Edit = () => {
  const router = useRouter()
  id = router.query.id
  const { data } = useQuery(`
    query {
      getCategoryById(id: "${router.query.id}") {
        id, name, slug
      }
    }
    `)
  const [updatedData, updateCategory] = useMutation(UPDATE_CATEGORY)
  const form = useFormik({
    initialValues: {
      name: '',
      slug: ''
    },
    onSubmit: async values => {
      const category = {
        ...values,
        id: router.query.id
      }
      const data = await updateCategory(category)
      if (data && !data.errors) {
        router.push('/categories')
      }
    },
    validationSchema: CategorySchema
  })
  // passsagem de dados para o formulário
  useEffect(() => {
    if (data && data.getCategoryById) {
      form.setFieldValue('name', data.getCategoryById.name)
      form.setFieldValue('slug', data.getCategoryById.slug)
    }
  }, [data])
  return (
    <Layout>
      <Title>Editar categoria</Title>
      <div className='mt-8'></div>
      <div className='flex flex-col mt-8'>
        <div className='-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8'>
          <div className='align-middle inline-block min-w-full shadow bg-white overflow-hidden sm:rounded-lg border-b border-gray-200 p-12'>
            <pre>{JSON.stringify(form, null, 2)}</pre>
            {updatedData && !!updatedData.errors && (
              <p className='bg-red-100 border border-red-400 mb-4 text-red-700 px-4 py-3 rounded relative'>
                Ocorreu um erro ao salvar os dados.
              </p>
            )}
            <form onSubmit={form.handleSubmit}>
              <div className='flex flex-wrap -mx-3 mb-6'>
                <Input
                  label='Nome da categoria'
                  placeholder='Preencha com o nome da categoria'
                  value={form.values.name}
                  onChange={form.handleChange}
                  name='name'
                  errorMessage={form.errors.name}
                ></Input>
                <Input
                  label='Slug da categoria'
                  placeholder='Preencha com o slug da categoria'
                  value={form.values.slug}
                  onChange={form.handleChange}
                  name='slug'
                  helpText='Slug é utilizado para URLs amigáveis'
                  errorMessage={form.errors.slug}
                ></Input>
              </div>
              <Button type={'submit'}>{'Salvar categoria'}</Button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}
export default Edit
