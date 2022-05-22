import { request } from 'graphql-request'
import useSWR from 'swr'

export const fetcher = query => request(process.env.NEXT_PUBLIC_API, query)

export const useQuery = query => {
  return useSWR(query, fetcher)
}
