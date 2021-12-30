pragma solidity >=0.8.4;
// SPDX-License-Identifier: MIT

import "hardhat/console.sol";

error CheesecakePortalError();

contract CheesecakePortal {
    uint256[3] private cakeCount;
    address payable public owner;
    Cheesecake[] private cheesecakes;

    event NewCheesecake(
        string name,
        string message,
        uint256 cakeSize,
        address indexed from,
        uint256 timestamp
    );

    struct Cheesecake {
        string name; // The name of the person who is sending the cheesecake
        string message; // The attached mesage from the giver
        uint256 cakeSize; // The size of the cheesecake chosen,  0 = small, 1 = medium, 2 = large
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
    function getAllCheesecakes() public view returns (Cheesecake[] memory) {
        return cheesecakes;
    }

    // Returns how many cheesecakes were donated
    function getCakeCount() public view returns (uint256[3] memory) {
        return cakeCount;
    }

    function sendCheesecake(
        string memory _message,
        string memory _name,
        uint256 _cakeSize // 0 = small, 1 = medium, 2 = large
    ) public payable {
        cakeCount[_cakeSize] += 1;
        // console.log("%s has just sent over a cheesecake!", msg.sender);

        cheesecakes.push(
            Cheesecake(_name, _message, _cakeSize, msg.sender, block.timestamp)
        );

        console.log("Sending over %d WEI", msg.value);

        (bool success, ) = owner.call{value: msg.value}("");
        console.log("Success?", success);

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
