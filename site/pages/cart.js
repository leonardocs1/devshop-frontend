import Seo from '../components/Seo'
import Layout from '../components/Layout'
import { fetcher } from '../lib/graphql'
import { gql } from 'graphql-request'
import Brands from '../components/Home/Brands'
import { useCart } from '../lib/CartContext'

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

const Cart = ({ brands, categories }) => {
  const cart = useCart()
  return (
    <>
      <Layout categories={categories}>
        <Seo />
        <h1>DevShop</h1>
        <ul>
          {Object.keys(cart.items).map(itemKey => {
            const product = cart.items[itemKey].product
            const qtd = cart.items[itemKey].qtd
            return (
              <li>
                Name: {product.name}
                <br />
                <ul>
                  {Object.keys(qtd).map(key => {
                    return (
                      <li>
                        {qtd[key].variation.optionName1} -{' '}
                        {qtd[key].variation.optionName2} - qtd: {qtd[key].qtd}
                      </li>
                    )
                  })}
                </ul>
              </li>
            )
          })}
        </ul>
        <pre>{JSON.stringify(cart, null, 2)}</pre>

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
export default Cart
