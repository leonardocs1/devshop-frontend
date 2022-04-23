import useSWR from 'swr'

const fetcher = async query => {
  const res = await fetch(process.env.NEXT_PUBLIC_API, {
    headers: {
      'Content-type': 'application/json'
    },
    method: 'POST',
    body: query
  })
  const json = await res.json()
  return json.data
}

const useQuery = query => {
  return useSWR(JSON.stringify(query), fetcher)
}

export { useQuery }
