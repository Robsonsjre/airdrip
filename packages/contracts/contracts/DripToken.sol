pragma solidity >=0.8.4;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import {IPodOption} from "../external/Pods.sol";
import "./Dripper.sol";

contract DripToken is ERC20, Ownable {
    Dripper public immutable dripper;

    constructor(Dripper _dripper) ERC20("DRIP", "Drip Token") {
        dripper = _dripper;
    }

    function decimals() public view virtual override returns (uint8) {
        Dripper.Campaign memory campaign = dripper.getCampaign(address(this));
        IPodOption option = IPodOption(campaign.option);
        return option.decimals();
    }

    function mint(address account, uint256 amount) external onlyOwner {
        _mint(account, amount);
    }

    function burn(address account, uint256 amount) external onlyOwner {
        _burn(account, amount);
    }
}
