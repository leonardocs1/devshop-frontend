import { gql } from 'graphql-request'
import { fetcher } from '../../lib/graphql'
import Layout from '../../components/Layout'

const GET_ALL_CATEGORIES = gql`
  query {
    categories: getAllCategories {
      id
      name
      slug
    }
  }
`

const GET_ALL_PRODUCTS_BY_BRAND = gql`
  query getAllProductsBybrand($slug: String!) {
    products: getAllProductsByBrand(brandSlug: $slug) {
      id
      name
      slug
    }
  }
`

const Brand = ({ products, categories }) => {
  return (
    <Layout categories={categories}>
      <h1>Marca </h1>
      <pre>{JSON.stringify(products, null, 2)}</pre>
    </Layout>
  )
}
export async function getServerSideProps(context) {
  const { categories } = await fetcher(GET_ALL_CATEGORIES)
  const { products } = await fetcher(GET_ALL_PRODUCTS_BY_BRAND, {
    slug: context.query.slug
  })
  return {
    props: {
      products,
      categories
    }
  }
}
export default Brand
