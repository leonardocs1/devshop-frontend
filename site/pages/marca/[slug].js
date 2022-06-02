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
      price
      images
    }
  }
`

const Brand = ({ products, categories }) => {
  return (
    <Layout categories={categories}>
      <h1>Marca </h1>
      <section class='text-gray-600 body-font'>
        <div class='container px-5 py-24 mx-auto'>
          <div class='flex flex-wrap -m-4'>
            {products.map(product => {
              return (
                <div class='lg:w-1/4 md:w-1/2 p-4 w-full'>
                  <a class='block relative h-48 rounded overflow-hidden'>
                    {product.images && product.images.length > 0 && (
                      <img
                        alt='https://dummyimage.com/420x260'
                        class='object-cover object-center w-full h-full block'
                        src={product.images[0]}
                      />
                    )}
                    {!product.images ||
                      (product.images.length === 0 && (
                        <img src='https://dummyimage.com/420x260'></img>
                      ))}
                  </a>
                  <div class='mt-4'>
                    <h3 class='text-gray-500 text-xs tracking-widest title-font mb-1'>
                      CATEGORY
                    </h3>
                    <h2 class='text-gray-900 title-font text-lg font-medium'>
                      {product.name}
                    </h2>
                    <p class='mt-1'>R${product.price.toFixed(2)}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
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
