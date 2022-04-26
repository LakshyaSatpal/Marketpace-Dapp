import React from "react";

function BuyProduct(props) {
  console.log(props.products);

	const buyProductHandler = (e) => {
		const id = e.target.name;
		const value = e.target.value;
		props.onBuy(id, value);
	}

  return (
    <div className="mt-5 container">
      <h2>Buy Product</h2>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Price</th>
            <th scope="col">Owner</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody id="productList">
          {props.products.map((product, key) => {
            return (
              <tr key={key}>
                <th scope="row">{product.id.toString()}</th>
                <td>{product.name}</td>
                <td>
                  {window.web3.utils.fromWei(product.price.toString(), "Ether")}{" "}
                  Eth
                </td>
                <td>{product.owner}</td>
                <td>
                  {!product.purchased ? (
                    <button
											className="btn btn-dark"
                      name={product.id}
                      value={product.price}
                      onClick={buyProductHandler}
                    >
                      Buy
                    </button>
                  ) : null}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default BuyProduct;
