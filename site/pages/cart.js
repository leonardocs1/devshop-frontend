import Seo from '../components/Seo'
import Layout from '../components/Layout'
import { fetcher } from '../lib/graphql'
import { gql } from 'graphql-request'
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
        <h1 className='font-bold text-3xl'>DevShop - Carrinho</h1>
        {cart.size > 0 && (
          <div className='flex justify-center my-6'>
            <div className='flex flex-col w-full p-8 text-gray-800 bg-white shadow-lg pin-r pin-y md:w-4/5 lg:w-4/5'>
              <div className='flex-1'>
                <table className='w-full text-sm lg:text-base' cellspacing='0'>
                  <thead>
                    <tr className='h-12 uppercase'>
                      <th className='hidden md:table-cell'></th>
                      <th className='text-left'>Produto</th>
                      <th className='lg:text-right text-left pl-5 lg:pl-0'>
                        <span className='lg:hidden' title='Quantity'>
                          Qtd
                        </span>
                        <span className='hidden lg:inline'>Quantidade</span>
                      </th>
                      <th className='hidden text-right md:table-cell'>
                        Preço Unitário
                      </th>
                      <th className='text-right'>Preço Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(cart.items).map(itemKey => {
                      const product = cart.items[itemKey].product
                      const qtd = cart.items[itemKey].qtd
                      return Object.keys(qtd).map(key => {
                        return (
                          <tr>
                            <td className='hidden pb-4 md:table-cell'>
                              <a href='#'>
                                <img
                                  src={product.images[0]}
                                  className='w-20 rounded'
                                  alt='Thumbnail'
                                />
                              </a>
                            </td>
                            <td>
                              <p className='md:ml-4'>
                                <span className='font-bold'>
                                  {product.name}
                                </span>
                                <br />
                                {product.optionNames[0]}
                                {': '}
                                {qtd[key].variation.optionName1}
                                {' / '}
                                {product.optionNames[1]}
                                {': '}
                                {qtd[key].variation.optionName2}
                              </p>
                              <button
                                onClick={() =>
                                  // cart.removeFromCart({ id: product.id })
                                  cart.removeVariationFromCart(product.id, key)
                                }
                                type='button'
                                className='text-gray-700 md:ml-4 bg-red-100 px-2 py-1 rounded text-xs shadow'
                              >
                                Remover item
                              </button>
                            </td>
                            <td className='justify-center md:justify-end md:flex mt-6'>
                              <div className='w-20 h-10'>
                                <div className='relative flex flex-row w-full h-8'>
                                  <button
                                    disabled={qtd[key].qtd < 1}
                                    onClick={() =>
                                      cart.changeQtd(product.id, key, -1)
                                    }
                                    className='bg-gray-600 py-2 px-4 rounded rounded-r-none font-bold text-white'
                                  >
                                    -
                                  </button>
                                  <span className='w-full font-semibold text-center text-gray-700 bg-gray-200 outline-none focus:outline-none hover:text-black focus:text-black px-4'>
                                    {qtd[key].qtd}
                                  </span>
                                  <button
                                    onClick={() =>
                                      cart.changeQtd(product.id, key, +1)
                                    }
                                    className='bg-gray-600 py-2 px-4 rounded rounded-l-none font-bold text-white'
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            </td>
                            <td className='hidden text-right md:table-cell'>
                              <span className='text-sm lg:text-base font-medium'>
                                10.00€
                              </span>
                            </td>
                            <td className='text-right'>
                              <span className='text-sm lg:text-base font-medium'>
                                20.00€
                              </span>
                            </td>
                          </tr>
                        )
                      })
                    })}
                  </tbody>
                </table>
                <hr className='pb-6 mt-6' />
                <a href='#'>
                  <button className='flex justify-center w-full px-10 py-3 mt-6 font-medium text-white uppercase bg-gray-800 rounded-full shadow item-center hover:bg-gray-700 focus:shadow-outline focus:outline-none'>
                    <svg
                      aria-hidden='true'
                      data-prefix='far'
                      data-icon='credit-card'
                      className='w-8'
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 576 512'
                    >
                      <path
                        fill='currentColor'
                        d='M527.9 32H48.1C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48.1 48h479.8c26.6 0 48.1-21.5 48.1-48V80c0-26.5-21.5-48-48.1-48zM54.1 80h467.8c3.3 0 6 2.7 6 6v42H48.1V86c0-3.3 2.7-6 6-6zm467.8 352H54.1c-3.3 0-6-2.7-6-6V256h479.8v170c0 3.3-2.7 6-6 6zM192 332v40c0 6.6-5.4 12-12 12h-72c-6.6 0-12-5.4-12-12v-40c0-6.6 5.4-12 12-12h72c6.6 0 12 5.4 12 12zm192 0v40c0 6.6-5.4 12-12 12H236c-6.6 0-12-5.4-12-12v-40c0-6.6 5.4-12 12-12h136c6.6 0 12 5.4 12 12z'
                      />
                    </svg>
                    <span className='ml-2 mt-5px'>Fechar Pedido</span>
                  </button>
                </a>
              </div>
            </div>
          </div>
        )}
        {cart.size === 0 && (
          <div class='rounded sm:w-full md:w-48 md:h-48 py-16 text-center opacity-50 md:border-solid md:border-2 md:border-gray-400'>
            <svg
              className='mx-auto feather feather-image'
              xmlns='http://www.w3.org/2000/svg'
              width='40'
              height='40'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              stroke-width='2'
              stroke-linecap='round'
              stroke-linejoin='round'
            >
              <rect x='3' y='3' width='18' height='18' rx='2' ry='2'></rect>
              <circle cx='8.5' cy='8.5' r='1.5'></circle>
              <polyline points='21 15 16 10 5 21'></polyline>
            </svg>
            <div class='py-4'>Carrinho Vazio</div>
          </div>
        )}
        <pre>{JSON.stringify(cart, null, 2)}</pre>
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
