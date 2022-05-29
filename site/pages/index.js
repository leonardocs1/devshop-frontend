import Seo from '../components/Seo'
import Layout from '../components/Layout'
import { fetcher, useQuery } from '../lib/graphql'
import { gql } from 'graphql-request'
import Brands from '../components/Home/Brands'

const GET_ALL_BRANDS = gql`
  query {
    brands: getAllBrands {
      id
      name
      slug
      logo
    }
  }
`

const GET_ALL_CATEGORIES = gql`
  query {
    categories: getAllCategories {
      id
      name
      slug
    }
  }
`

const Index = ({ brands, categories }) => {
  return (
    <>
      <Layout categories={categories}>
        <Seo />
        <h1>DevShop</h1>
        <Brands brands={brands} />
      </Layout>
    </>
  )
}
export async function getServerSideProps(context) {
  const { brands } = await fetcher(GET_ALL_BRANDS)
  const { categories } = await fetcher(GET_ALL_CATEGORIES)
  return {
    props: {
      brands,
      categories
    }
  }
}
export default Index
