import { useState } from 'react'
import useSWR from 'swr'

const fetcher = async query => {
  const accessToken = localStorage.getItem('accessToken')
  const headers = {
    'Content-type': 'application/json'
  }
  if (accessToken) {
    headers['authorization'] = 'Bearer ' + accessToken
  }
  const res = await fetch(process.env.NEXT_PUBLIC_API, {
    headers,
    method: 'POST',
    body: query
  })
  const json = await res.json()
  if (!json.errors) {
    return json
  }

  //pegar novo
  const getAcessToken = {
    query: ` 
    mutation getAccessToken($refreshToken: String!) {
      accessToken(refreshToken: $refreshToken)  
    }
    `,
    variables: {
      refreshToken: localStorage.getItem('refreshToken')
    }
  }

  const resAccessToken = await fetch(process.env.NEXT_PUBLIC_API, {
    headers,
    method: 'POST',
    body: JSON.stringify(getAcessToken)
  })
  const jsonAccessToken = await resAccessToken.json()
  if (jsonAccessToken.data) {
    const newAccessToken = jsonAccessToken.data.accessToken
    localStorage.setItem('accessToken', newAccessToken)

    const res2 = await fetch(process.env.NEXT_PUBLIC_API, {
      headers: {
        'Context-type': 'application/json',
        authorization: 'Bearer ' + newAccessToken
      },
      method: 'POST',
      body: query
    })
    const json2 = await res2.json()
    if (!json2.errors) {
      return json2
    }
  }

  // enviar para login
  window.location = '/'
  return null

  return json
}

const uploader = async formData => {
  const res = await fetch(process.env.NEXT_PUBLIC_API, {
    headers: {},
    method: 'POST',
    body: formData
  })
  const json = await res.json()
  return json
}

const useQuery = queryStr => {
  const query = {
    query: queryStr
  }
  const allData = useSWR(JSON.stringify(query), fetcher)
  const { data, ...rest } = allData
  return { data: data ? data.data : null, ...rest }
}
const useMutation = queryStr => {
  const [data, setData] = useState(null)
  const mutate = async variables => {
    const mutation = {
      query: queryStr,
      variables
    }
    try {
      const returnedData = await fetcher(JSON.stringify(mutation))
      setData(returnedData)
      return returnedData
    } catch (err) {}
  }
  return [data, mutate]
}

const useUpload = queryStr => {
  const [data, setData] = useState(null)
  const mutate = async variables => {
    const mutation = {
      query: queryStr,
      variables: {
        ...variables,
        file: null
      }
    }
    const map = {
      0: ['variables.file']
    }
    const formData = new FormData()
    formData.append('operations', JSON.stringify(mutation))
    formData.append('map', JSON.stringify(map))
    formData.append(0, variables.file)
    try {
      const returnedData = await uploader(formData)
      setData(returnedData)
      return returnedData
    } catch (err) {}
  }
  return [data, mutate]
}

export { useQuery, useMutation, fetcher, useUpload }
