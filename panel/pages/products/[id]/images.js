import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useUpload, useQuery, fetcher, useMutation } from '../../../lib/graphql'
import { useFormik } from 'formik'
import Layout from '../../../components/Layout'
import Title from '../../../components/Title'
import Button from '../../../components/Button'

const UPLOAD_BRAND_LOGO = `
  mutation uploadProductImage($id: String!, $file: Upload!) {
    panelUploadProductImage(
      id: $id,
      file: $file
    ) 
  }
  `

const DELETE_IMAGE = `
mutation deleteProductImage($id: String!, $url: String!) {
  panelDeleteProductImage (id: $id, url: $url) 
}`

const Upload = () => {
  const router = useRouter()
  const [deleteData, deleteImage] = useMutation(DELETE_IMAGE)
  const { data, mutate } = useQuery(`
    query {
      getProductById(id: "${router.query.id}") {
        id, name, slug, images
      }
    }
    `)
  const [updatedData, uploadProductImage] = useUpload(UPLOAD_BRAND_LOGO)
  const form = useFormik({
    initialValues: {
      id: router.query.id,
      file: ''
    },
    onSubmit: async values => {
      const product = {
        ...values,
        id: router.query.id
      }
      const data = await uploadProductImage(product)
      if (data && !data.errors) {
        mutate()
        // router.push('/products')
      }
    }
  })

  const delImage = url => async () => {
    await deleteImage({ id: router.query.id, url })
    mutate()
  }

  return (
    <Layout>
      <Title>Upload de images do produto: {data?.getProductById?.name} </Title>
      <div className='mt-8'></div>
      {data?.getProductById?.images?.length === 0 && (
        <p className='rounded bg-white shadow py-2 px-4'>
          Nenhuma imagem enviada até o momento.
        </p>
      )}
      {data?.getProductById?.images.map(img => {
        return (
          <div
            key={img}
            className='p-2 border border-gray-500 rounded hover:bg-gray-400'
          >
            <img src={img} className='rounded m-1' />
            <button
              className='bg-red-400 text-white font-bold p-2 rounded mt-1'
              onClick={delImage(img)}
            >
              Remover
            </button>
          </div>
        )
      })}
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
              <Button type={'submit'}>{'Enviar imagem'}</Button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}
export default Upload
