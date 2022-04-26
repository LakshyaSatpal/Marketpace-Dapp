import React, { useEffect, useState } from "react";
import Web3 from "web3";
import Navbar from "./Navigation";
import Marketplace from "../abis/Marketplace.json";
import AddProduct from "./AddProduct";
import BuyProduct from "./BuyProduct";
import { Spinner } from "react-bootstrap";

function App() {
  const [account, setAccount] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [marketplace, setMarketplace] = useState();

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  };

  const loadBlockchainData = async () => {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);
    const networkId = await web3.eth.net.getId();
    const networkData = Marketplace.networks[networkId];
    if (networkData) {
      const marketplace = await web3.eth.Contract(
        Marketplace.abi,
        networkData.address
      );
      setMarketplace(marketplace);
      const count = await marketplace.methods.productsCount().call();

      for (let i = 1; i <= count; i++) {
        const product = await marketplace.methods.products(i).call();
        setProducts((prev) => prev.concat(product));
      }

      setLoading(false);
    } else {
      window.alert(
        "Marketplace smart contract not deployed to detected network"
      );
    }
  };

  useEffect(() => {
    loadWeb3();
    loadBlockchainData();
  }, []);

  const registerProduct = (name, price) => {
    setLoading(true);
    marketplace.methods
      .registerProduct(name, price)
      .send({ from: account })
      .once("receipt", () => {
        console.log("product created");
        setLoading(false);
      });
  };

  const buyProduct = (id, price) => {
    setLoading(true);
    marketplace.methods
      .buyProduct(id)
      .send({ from: account, value: price })
      .once("receipt", (receipt) => {
        console.log("product bought");
        setLoading(false);
      });
  };

  return loading ? (
    <Spinner
      animation="border"
      role="status"
      className="d-block mx-auto mt-5"
    ></Spinner>
  ) : (
    <div>
      <Navbar account={account} />
      <AddProduct onAddProduct={registerProduct} />
      <BuyProduct onBuy={buyProduct} products={products} />
    </div>
  );
}

export default App;
