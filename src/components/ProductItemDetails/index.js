// Write your code here
import {Component} from 'react'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import './index.css'
import SimilarProductItem from '../SimilarProductItem'
import Header from '../Header'

const productResponseStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}
class ProductItemDetails extends Component {
  state = {
    productResponseStatus: productResponseStatusConstants.initial,
    productDetails: {},
    similarProductsList: [],
    productQuantity: 1,
  }

  componentDidMount() {
    this.getSpecificProduct()
  }

  getSpecificProduct = async () => {
    this.setState({
      productResponseStatus: productResponseStatusConstants.inProgress,
    })

    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')
    const productDetailsApiUrl = `https://apis.ccbp.in/products/${id}`

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const specificProductResponse = await fetch(productDetailsApiUrl, options)
    if (specificProductResponse.ok === true) {
      const specificProductData = await specificProductResponse.json()
      const updatedProductData = {
        id: specificProductData.id,
        availability: specificProductData.availability,
        brand: specificProductData.brand,
        description: specificProductData.description,
        imageUrl: specificProductData.image_url,
        price: specificProductData.price,
        rating: specificProductData.rating,
        similarProducts: specificProductData.similar_products,
        style: specificProductData.style,
        title: specificProductData.style,
        totalReviews: specificProductData.total_reviews,
      }

      const {similarProducts} = updatedProductData

      const updatedSimilarProducts = similarProducts.map(each => ({
        availability: each.availability,
        brand: each.brand,
        description: each.description,
        similarProductId: each.id,
        similarImageUrl: each.image_url,
        price: each.price,
        rating: each.rating,
        style: each.style,
        title: each.title,
        similarTotalReviews: each.total_reviews,
      }))

      this.setState({
        productDetails: updatedProductData,
        similarProductsList: updatedSimilarProducts,
        productResponseStatus: productResponseStatusConstants.success,
      })
    } else if (specificProductResponse.status === 404) {
      this.setState({
        productResponseStatus: productResponseStatusConstants.failure,
      })
    }
  }

  renderInProgressView = () => (
    <div data-testid="loader" className="loader-container-for-special-product">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  onClickIncreaseProducts = () => {
    this.setState(prevState => ({
      productQuantity: prevState.productQuantity + 1,
    }))
  }

  onClickDecreaseProducts = () => {
    const {productQuantity} = this.state
    if (productQuantity === 1) {
      this.setState({productQuantity: 1})
    } else
      this.setState(prevState => ({
        productQuantity: prevState.productQuantity - 1,
      }))
  }

  renderProductDetailsView = () => {
    const {productDetails, similarProductsList, productQuantity} = this.state
    const {
      availability,
      brand,
      description,
      imageUrl,
      price,
      title,
      rating,
      totalReviews,
    } = productDetails

    console.log(similarProductsList)

    return (
      <>
        <Header />
        <div className="product-item-details-container">
          <div className="product-details-container">
            <div className="product-image-container">
              <img src={imageUrl} alt="product" className="product-image" />
            </div>
            <div className="all-details-container">
              <h1 className="product-heading">{title}</h1>
              <p className="product-price">Rs {price}/ </p>
              <div className="product-rating-container">
                <div className="product-star-rating-container">
                  <p className="no-of-stars"> {rating} </p>
                  <img
                    src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                    alt="star"
                    className="product-star-image"
                  />
                </div>
                <p className="no-of-reviews"> {totalReviews} Reviews </p>
              </div>
              <p className="product-main-description">{description}</p>
              <p className="available">
                <span className="span-available">Available:</span>{' '}
                {availability}
              </p>
              <p className="available">
                <span className="span-available">Brand:</span> {brand}
              </p>
              <hr className="product-horizontal-rule" />
              <div className="product-quantity-container">
                <button
                  type="button"
                  onClick={this.onClickDecreaseProducts}
                  className="plus-and-minus-button"
                  data-testid="minus"
                >
                  <BsDashSquare className="plus-and-minus-icon" />
                </button>
                <p className="no-of-quantity"> {productQuantity} </p>
                <button
                  type="button"
                  onClick={this.onClickIncreaseProducts}
                  className="plus-and-minus-button"
                  data-testid="plus"
                >
                  <BsPlusSquare className="plus-and-minus-icon" />
                </button>
              </div>
              <button type="button" className="add-to-cart-button">
                ADD TO CART
              </button>
            </div>
          </div>
          <div className="similar-products-container">
            <h1 className="similar-products-heading"> Similar Products </h1>
            <ul className="similar-products-list-container">
              {similarProductsList.map(eachSimilarProduct => (
                <SimilarProductItem
                  key={eachSimilarProduct.similarProductId}
                  eachSimilarProduct={eachSimilarProduct}
                />
              ))}
            </ul>
          </div>
        </div>
      </>
    )
  }

  onClickContinueShoppingButton = () => {
    const {history} = this.props
    this.setState({
      productResponseStatus: productResponseStatusConstants.initial,
      productDetails: {},
      similarProductsList: [],
      productQuantity: 1,
    })
    history.push('/products')
  }

  renderProductNotFoundView = () => (
    <div className="product-not-found-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="product-not-found-image-sm"
      />
      {/* <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="product-not-found-image-lg"
      /> */}
      <h1 className="not-found-description"> Product Not Found </h1>
      <button
        type="button"
        className="continue-shopping-button"
        onClick={this.onClickContinueShoppingButton}
      >
        Continue Shopping
      </button>
    </div>
  )

  render() {
    const {productResponseStatus} = this.state

    switch (productResponseStatus) {
      case productResponseStatusConstants.inProgress:
        return this.renderInProgressView()
      case productResponseStatusConstants.success:
        return this.renderProductDetailsView()
      case productResponseStatusConstants.failure:
        return this.renderProductNotFoundView()
      default:
        return null
    }
  }
}

export default ProductItemDetails
