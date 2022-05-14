import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useUpload, useQuery, fetcher } from '../../../lib/graphql'
import { useFormik } from 'formik'
import Layout from '../../../components/Layout'
import Title from '../../../components/Title'
import Button from '../../../components/Button'

const UPLOAD_BRAND_LOGO = `
  mutation uploadBrandLogo($id: String!, $file: Upload!) {
    panelUploadBrandLogo(
      id: $id,
      file: $file
    ) 
  }
  `

const Upload = () => {
  const router = useRouter()
  const { data } = useQuery(`
    query {
      getBrandById(id: "${router.query.id}") {
        id, name, slug
      }
    }
    `)
  const [updatedData, updateBrand] = useUpload(UPLOAD_BRAND_LOGO)
  const form = useFormik({
    initialValues: {
      id: router.query.id,
      file: ''
    },
    onSubmit: async values => {
      const brand = {
        ...values,
        id: router.query.id
      }
      const data = await updateBrand(brand)
      if (data && !data.errors) {
        router.push('/brands')
      }
    }
  })

  return (
    <Layout>
      <Title>
        Upload logo da marca:{' '}
        {data && data.getBrandById && data.getBrandById.name}
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
                <input
                  type='file'
                  name='file'
                  onChange={evt => {
                    form.setFieldValue('file', evt.currentTarget.files[0])
                  }}
                />
              </div>
              <Button type={'submit'}>{'Salvar marca'}</Button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}
export default Upload
