// SPDX-License-Identifier: agpl-3.0

pragma solidity >=0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title ERC20Mintable
 * @dev ERC20 with mint function
 */
contract MintableERC20 is ERC20 {
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {}

    function mint(uint256 amount) public returns (bool) {
        _mint(msg.sender, amount);
        return true;
    }

    function burn(uint256 amount) public returns(bool) {
        _burn(msg.sender, amount);
        return true;
    }
}
