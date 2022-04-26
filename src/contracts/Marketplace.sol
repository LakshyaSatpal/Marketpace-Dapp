//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract Marketplace {
    struct Product {
        uint256 id;
        string name;
        uint256 price;
        address payable owner;
        bool purchased;
    }

    mapping(uint256 => Product) public products; // mapping will behave like a database
    uint256 public productsCount = 0;
    string public name;

    constructor() {
        name = "Lakshya's Marketplace";
    }

    event ProductCreated(
        uint256 id,
        string name,
        uint256 price,
        address owner,
        bool purchased
    );

    event ProductPurchased(
        uint256 id,
        string name,
        uint256 price,
        address payable owner,
        bool purchased
    );

    function buyProduct(uint256 _id) public payable {
        Product memory productToBuy = products[_id];
        address payable seller = productToBuy.owner;

        require(_id > 0 && _id <= productsCount);

        require(msg.value >= productToBuy.price, "Value is not equal to price");
        require(payable(msg.sender) != seller, "Owner cannot buy the product");

        require(!productToBuy.purchased, "Product is already purchased");

        productToBuy.owner = payable(msg.sender);
        productToBuy.purchased = true;

        products[_id] = productToBuy; // IMPORTANT!! You need to update the product in mapping

        seller.transfer(msg.value);

        emit ProductPurchased(
            productsCount,
            productToBuy.name,
            productToBuy.price,
            payable(msg.sender),
            true
        );
    }

    function registerProduct(string memory _name, uint256 _price) public {
        require(bytes(_name).length > 0);
        require(_price > 0);
        productsCount++;

        products[productsCount] = Product(
            productsCount,
            _name,
            _price,
            payable(msg.sender),
            false
        );

        emit ProductCreated(
            productsCount,
            _name,
            _price,
            payable(msg.sender),
            false
        );
    }
}
