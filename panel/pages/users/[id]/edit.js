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

const UPDATE_USER = `
  mutation updateCategory($id: String!, $name: String!, $email: String!, $passwd: String!, $role: String!) {
    panelUpdateUser(input: {
      id: $id,
      name: $name,
      email: $email,
      passwd: $passwd,
      role: $role
    }) {
      id
      name
      email
    }
  }
  `

const UserSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Por favor, informe um nome com pelo menos 3 caracteres.')
    .required('Por favor, informe um nome.'),
  email: Yup.string()
    .email()
    .min(3, 'Por favor, informe um email com pelo menos 3 caracteres.')
    .required('Por favor, informe um email.'),
  passwd: Yup.string()
    .min(6, 'Por favor, informe uma senha com pelo menos 6 caracteres.')
    .required('Por favor, informe um senha.')
  /*slug: Yup.string()
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
          return false
        }
      )*/
})
const Edit = () => {
  const router = useRouter()
  id = router.query.id
  const { data } = useQuery(`
    query {
      panelGetUserById(id: "${router.query.id}") {
        id, name, email, role
      }
    }
    `)
  const [updatedData, updateUser] = useMutation(UPDATE_USER)
  const form = useFormik({
    initialValues: {
      name: '',
      email: '',
      passwd: '',
      role: ''
    },
    onSubmit: async values => {
      const category = {
        ...values,
        id: router.query.id
      }
      const data = await updateUser(category)
      if (data && !data.errors) {
        router.push('/users')
      }
    },
    validationSchema: UserSchema
  })
  // passsagem de dados para o formulário
  useEffect(() => {
    if (data && data.panelGetUserById) {
      form.setFieldValue('name', data.panelGetUserById.name)
      form.setFieldValue('email', data.panelGetUserById.email)
      form.setFieldValue('role', data.panelGetUserById.role)
      form.setFieldValue('passwd', data.panelGetUserById.passwd)
    }
  }, [data])
  return (
    <Layout>
      <Title>Editar usuário</Title>
      <div className='mt-8'></div>
      <div className='flex flex-col mt-8'>
        <div className='-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8'>
          <div className='align-middle inline-block min-w-full shadow bg-white overflow-hidden sm:rounded-lg border-b border-gray-200 p-12'>
            {updatedData && !!updatedData.errors && (
              <p className='bg-red-100 border border-red-400 mb-4 text-red-700 px-4 py-3 rounded relative'>
                Ocorreu um erro ao salvar os dados.
              </p>
            )}
            <form onSubmit={form.handleSubmit}>
              <div className='flex flex-wrap -mx-3 mb-6'>
                <Input
                  label='Nome'
                  placeholder='Preencha com o nome'
                  value={form.values.name}
                  onChange={form.handleChange}
                  name='name'
                  errorMessage={form.errors.name}
                ></Input>
                <Input
                  label='Email'
                  placeholder='Preencha com o email'
                  value={form.values.email}
                  onChange={form.handleChange}
                  name='email'
                  errorMessage={form.errors.email}
                  type='email'
                ></Input>
                <Input
                  label='Senha'
                  placeholder='Preencha com a senha'
                  value={form.values.passwd}
                  onChange={form.handleChange}
                  name='passwd'
                  errorMessage={form.errors.passwd}
                  type='password'
                ></Input>
                <Input
                  label='Role'
                  placeholder='Preencha com a role'
                  value={form.values.role}
                  onChange={form.handleChange}
                  name='role'
                  errorMessage={form.errors.role}
                ></Input>
              </div>
              <Button type={'submit'}>{'Salvar usuário'}</Button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}
export default Edit
