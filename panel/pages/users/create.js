import React from 'react'
import Layout from '../../components/Layout'
import Title from '../../components/Title'
import { useMutation, fetcher } from '../../lib/graphql'
import { useFormik } from 'formik'
import { useRouter } from 'next/router'
import Button from '../../components/Button'
import Input from '../../components/Input'
import * as Yup from 'yup'

const CREATE_USER = `
    mutation createUser($name: String!, $email: String!, $passwd: String!, $role: String!) {
      panelCreateUser (input: {
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
    .required('Por favor, informe um email.')
    .test(
      'is-unique',
      'Por favor, utilize outro email. Este já está em uso por outro usuário.',
      async value => {
        const ret = await fetcher(
          JSON.stringify({
            query: `
            query {
              panelGetUserByEmail(email: "${value}"){
                email
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
  passwd: Yup.string()
    .min(6, 'Por favor, informe uma senha com pelo menos 6 caracteres.')
    .required('Por favor, informe um senha.')
})

const Index = () => {
  const router = useRouter()
  const [data, createUser] = useMutation(CREATE_USER)
  const form = useFormik({
    initialValues: {
      name: '',
      email: '',
      passwd: '',
      role: ''
    },
    validationSchema: UserSchema,
    onSubmit: async values => {
      const data = await createUser(values)
      if (data && !data.errors) {
        router.push('/users')
      }
    }
  })
  return (
    <Layout>
      <Title>Criar novo usuário</Title>
      <div className='mt-8'></div>
      <div>
        <Button.LinkOutLine href='/users'>Voltar</Button.LinkOutLine>
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
              <Button type={'submit'}>{'Criar usuário'}</Button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}
export default Index
