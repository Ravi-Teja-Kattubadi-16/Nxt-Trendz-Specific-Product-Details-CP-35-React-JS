// Write your code here
import './index.css'

const SimilarProductItem = props => {
  const {eachSimilarProduct} = props
  const {similarImageUrl, title, brand, price, rating} = eachSimilarProduct
  return (
    <li className="similar-product-item">
      <img
        src={similarImageUrl}
        alt={`similar product ${title}`}
        className="similar-product-image"
      />
      <p className="similar-product-name"> {title} </p>
      <p className="similar-product-made-by"> by {brand} </p>
      <div className="similar-product-rating-container">
        <p className="similar-product-price"> Rs {price}/- </p>
        <div className="similar-product-star-rating">
          <p className="similar-product-no-of-stars">{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="similar-product-star-image"
          />
        </div>
      </div>
    </li>
  )
}
export default SimilarProductItem
