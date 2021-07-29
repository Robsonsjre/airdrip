pragma solidity >=0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import {IPodOption} from "../external/Pods.sol";
import "./Dripper.sol";

contract DripToken is ERC20, ERC20Permit, Ownable {
  using SafeERC20 for IERC20;
  Dripper public immutable dripper;

  constructor(Dripper _dripper) ERC20("DRIP", "Drip Token") ERC20Permit("Drip Token") {
    dripper = _dripper;
  }

  function decimals() public view virtual override returns (uint8) {
    Dripper.Campaign memory campaign = dripper.getCampaign(address(this));
    return IPodOption(campaign.option).decimals();
  }

  function mint(address account, uint amount) external onlyOwner {
    _mint(account, amount);
  }

  function burn(uint amount) external {
    _burn(msg.sender, amount);

    Dripper.Campaign memory campaign = dripper.getCampaign(address(this));
    require(ISablier(dripper.sablier()).withdrawFromStream(amount, campaign.streamId), "STREAM_WITHDRAW_FAILED");

    IPodOption option = IPodOption(campaign.option);

    uint strikeToSend = option.strikePrice() * amount;
    IERC20(option.strikeAsset()).safeTransferFrom(msg.sender, address(this), strikeToSend);
    IERC20(option.strikeAsset()).approve(campaign.option, strikeToSend);
    option.exercise(amount);

    IERC20(option.underlyingAsset()).safeTransfer(msg.sender, amount);
  }
}
