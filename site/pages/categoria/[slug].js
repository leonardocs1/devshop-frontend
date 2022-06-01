import { gql } from 'graphql-request'
import Layout from '../../components/Layout'
import { fetcher } from '../../lib/graphql'

const GET_ALL_CATEGORIES = gql`
  query {
    categories: getAllCategories {
      id
      name
      slug
    }
  }
`

const GET_ALL_PRODUCTS_BY_CATEGORY = gql`
  query getAllProductsByCategory($slug: String!) {
    products: getAllProductsByCategory(categorySlug: $slug) {
      id
      name
      slug
    }
  }
`

const Categoria = ({ products, categories }) => {
  return (
    <Layout categories={categories}>
      <h1>Categoria </h1>
      <pre>{JSON.stringify(products, null, 2)}</pre>
    </Layout>
  )
}
export async function getServerSideProps(context) {
  const { products } = await fetcher(GET_ALL_PRODUCTS_BY_CATEGORY, {
    slug: context.query.slug
  })
  const { categories } = await fetcher(GET_ALL_CATEGORIES)
  return {
    props: {
      products,
      categories
    }
  }
}
export default Categoria
