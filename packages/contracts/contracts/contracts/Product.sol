pragma solidity >=0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract Product is ERC20 {
    using SafeERC20 for IERC20;

    struct Vault {
        uint streamId;
        address owner;
    }

    mapping(uint => Vault) public vaults;

    function createProduct(uint opcao, uint startdate, IERC20 token, uint amount) public {
        // Take tokens
        // Create Option
        // Create Vault
        // Create Stream
        // Transfer back the Shares
    }

    function claim(uint vaultId) public {
        // send vaultStremeadToken
        // Withdraw from Sablier (Check if the amount is below the ratio / expiration -> current time = Percentage)
        // Call the exercise function, you will need to send the strike asset (USDC) need to approve first?
        //
        // Flash exercise would need to:
        //
        // Get Strike Asset from AAVE
        //
        // Send the Option token + Strike => Receive underlying token => sells in market (Need to find a trading venue) .
        //
        // Flashloan
        // exercise
    }
}
