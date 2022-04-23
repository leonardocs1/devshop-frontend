import React from 'react'
import Layout from '../../components/Layout'
import Title from '../../components/Title'
import { useMutation } from '../../lib/graphql'
import { useFormik } from 'formik'
import { useRouter } from 'next/router'
import Link from 'next/link'

const mutation = {
  query: `
    mutation createCategory($name: String!, $slug: String!) {
      createCategory (input: {
        name: $name,
        slug: $slug
      }) {
        id
        name
        slug
      }
    }
  `
}

const Index = () => {
  const router = useRouter()
  const [data, createCategory] = useMutation(mutation)
  const form = useFormik({
    initialValues: {
      name: '',
      slug: ''
    },
    onSubmit: async values => {
      await createCategory(values)
      router.push('/categories')
    }
  })
  return (
    <Layout>
      <Title>Criar nova categoria</Title>
      <div className='mt-8'></div>
      <div>
        <Link href='/categories/create'>
          <a>Criar categoria</a>
        </Link>
      </div>
      <div className='flex flex-col mt-8'>
        <div className='-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8'>
          <div className='align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200'>
            <form onSubmit={form.handleSubmit}>
              <input
                type='text'
                name='name'
                onChange={form.handleChange}
                value={form.values.name}
              />
              <input
                type='text'
                name='slug'
                onChange={form.handleChange}
                value={form.values.slug}
              />
              <button type='submit'>Criar categoria</button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}
export default Index
