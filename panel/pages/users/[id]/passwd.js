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
  mutation changeUserPass($id: String!, $passwd: String!) {
    panelChangeUserPass(input: {
      id: $id,
      passwd: $passwd
    })
  }
  `

const UserSchema = Yup.object().shape({
  passwd: Yup.string()
    .min(6, 'Por favor, informe uma senha com pelo menos 3 caracteres.')
    .required('Por favor, informe um senha.')
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
      passwd: ''
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

  return (
    <Layout>
      <Title>
        Editar senha:{' '}
        {data && data.panelGetUserById && data.panelGetUserById.name}
      </Title>
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
                  label='Nova senha'
                  placeholder='Preencha com a senha'
                  value={form.values.passwd}
                  onChange={form.handleChange}
                  name='passwd'
                  type='password'
                  errorMessage={form.errors.passwd}
                ></Input>
              </div>
              <Button type={'submit'}>{'Salvar nova senha'}</Button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}
export default Edit
