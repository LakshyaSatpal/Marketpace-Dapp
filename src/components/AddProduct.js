import React, { useRef } from "react";

function AddProduct(props) {
  const nameRef = useRef();
  const priceRef = useRef();

  const addProductHandler = (e) => {
    e.preventDefault();
    const name = nameRef.current.value;
    const price = window.web3.utils.toWei(
      priceRef.current.value.toString(),
      "Ether"
    );
    props.onAddProduct(name, price);
  };

  return (
    <div className="container mt-5">
      <h2>Add Product</h2>
      <form onSubmit={addProductHandler}>
        <div className="form-group mr-sm-2">
          <input
            id="productName"
            type="text"
            ref={nameRef}
            className="form-control"
            placeholder="Product Name"
            required
          />
        </div>
        <div className="form-group mr-sm-2">
          <input
            id="productPrice"
            type="number"
            ref={priceRef}
            className="form-control"
            placeholder="Product Price"
            step="any"
            required
          />
        </div>
        <button type="submit" className="btn btn-secondary">
          Add Product
        </button>
      </form>
    </div>
  );
}

export default AddProduct;
