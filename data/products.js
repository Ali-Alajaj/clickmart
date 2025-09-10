class Product {
  id;
  image;
  name;
  rating;
  price;
  keywords;
  type;

  constructor(productDetails) {
    this.id = productDetails.id;
    this.image = productDetails.image;
    this.name = productDetails.name;
    this.rating = productDetails.rating;
    this.price = productDetails.price;
    this.keywords = productDetails.keywords;
    this.type = productDetails.type;
  }

  getStarsUrl() {
    return `images/stars/rating-${this.rating.stars * 10}.png`
  }
}

export let products;

export function loadProducts() {
  const promise = fetch(
    'https://68b1f2bea860fe41fd6007a9.mockapi.io/products'
  ).then((response) => {
    console.log('products loaded');
    return response.json()
  }).then((productsJson) => {
    products = productsJson.map((productDetails) => {
      return new Product(productDetails);
    });
  });

  
  return promise;
}

export function getProductDetails(productId) {
  let matchingProduct;
  products.forEach((product) => {
    if (productId === product.id) {
      matchingProduct = product;
    }
  });

  return matchingProduct;
}