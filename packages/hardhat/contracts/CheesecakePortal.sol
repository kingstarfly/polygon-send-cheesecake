pragma solidity >=0.8.4;
// SPDX-License-Identifier: MIT

import "hardhat/console.sol";

error CheesecakePortalError();

contract CheesecakePortal {
    uint256 private totalCakes;
    address payable public owner;
    Cheesecake[] private cheesecakes;

    event NewCheesecake(
        string name,
        string message,
        string cakeSize,
        address indexed from,
        uint256 timestamp
    );

    struct Cheesecake {
        string name; // The name of the person who is sending the cheesecake
        string message; // The attached mesage from the giver
        string cakeSize; // The size of the cheesecake chosen
        address giver; // This is the address of the person who is sending me a cheesecake
        uint256 timestamp; // The timestamp when the person sent the cheesecake
    }

    constructor() payable {
        console.log(
            "This is from the constructor of CheesecakePortal Smart Contract"
        );

        // Set owner of the smart contract to the caller of the constructorm, which is the deployer.
        owner = payable(msg.sender);
    }

    // Returns all Cheesecake objects
    function getAllDonations() public view returns (Cheesecake[] memory) {
        return cheesecakes;
    }

    // Returns how many cheesecakes were donated
    function getQtyCheesecakes() public view returns (uint256) {
        console.log(
            "We have %d total number of cheesecakes received ",
            totalCakes
        );
        return totalCakes;
    }

    function sendCheesecake(
        string memory _message,
        string memory _name,
        string memory _cakeSize,
        uint256 _payAmountInWei
    ) public payable {
        uint256 cost = 0.001 ether;
        require(_payAmountInWei >= cost, "Insufficient funds provided");

        totalCakes += 1;
        console.log("%s has just sent over a cheesecake!", msg.sender);

        cheesecakes.push(
            Cheesecake(_name, _message, _cakeSize, msg.sender, block.timestamp)
        );

        console.log("Sending over %d WEI", _payAmountInWei);

        (bool success, ) = owner.call{value: _payAmountInWei}("");
        require(success, "Transfer failed");

        emit NewCheesecake(
            _name,
            _message,
            _cakeSize,
            msg.sender,
            block.timestamp
        );
    }

    function throwError() external pure {
        revert CheesecakePortalError();
    }
}
