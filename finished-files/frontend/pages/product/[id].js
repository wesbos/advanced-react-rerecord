import SingleProduct from '../../components/SingleProduct'

function Product({ query }) {
  return (
    <div>
      <SingleProduct id={query.id} />
    </div>
  )
}


export default Product;
