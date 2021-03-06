import React from 'react'
import Layout from '../../components/Layout'
import Title from '../../components/Title'
import { useMutation, fetcher } from '../../lib/graphql'
import { useFormik } from 'formik'
import { useRouter } from 'next/router'
import Button from '../../components/Button'
import Input from '../../components/Input'
import * as Yup from 'yup'

const CREATE_BRAND = `
    mutation createBrand($name: String!, $slug: String!) {
      panelCreateBrand (input: {
        name: $name,
        slug: $slug
      }) {
        id
        name
        slug
      }
    }
  `
const BrandSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Por favor, informe uma marca com pelo menos 3 caracteres.')
    .required('Por favor, informe uma marca.'),
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
              getBrandBySlug(slug: "${value}"){
                id
              }
            }
          
          `
          })
        )
        console.log(ret.errors)
        if (ret.errors) {
          return true
        }
        return false
      }
    )
})

const CreateBrand = () => {
  const router = useRouter()
  const [data, createBrand] = useMutation(CREATE_BRAND)
  const form = useFormik({
    initialValues: {
      name: '',
      slug: ''
    },
    validationSchema: BrandSchema,
    onSubmit: async values => {
      const data = await createBrand(values)
      if (data && !data.errors) {
        router.push('/brands')
      }
    }
  })
  return (
    <Layout>
      <Title>Criar nova marca</Title>
      <div className='mt-8'></div>
      <div>
        <Button.LinkOutLine href='/brands'>Voltar</Button.LinkOutLine>
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
                  label='Nome da marca'
                  placeholder='Preencha com o nome da marca'
                  value={form.values.name}
                  onChange={form.handleChange}
                  name='name'
                  errorMessage={form.errors.name}
                ></Input>

                <Input
                  label='Slug da marca'
                  placeholder='Preencha com o slug da marca'
                  value={form.values.slug}
                  onChange={form.handleChange}
                  name='slug'
                  helpText='Slug é utilizado para URLs amigáveis'
                  errorMessage={form.errors.slug}
                ></Input>
              </div>
              <Button type={'submit'}>{'Criar marca'}</Button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}
export default CreateBrand
