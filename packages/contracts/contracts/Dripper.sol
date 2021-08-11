// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IConfigurationManager, IOptionAMMFactory, IOptionFactory, IPodOption} from "../external/Pods.sol";
import {ISablier} from "../external/ISablier.sol";
import "./DripToken.sol";

/**
 * @title Airdrip Vesting
 * @author Pods Finance
 * @notice Represents a vesting mechanism that aligns token receiver incentives while protects
 * liquidity programs from dumps
 */
contract Dripper {
  using SafeERC20 for IERC20;
  using SafeERC20 for IERC20Metadata;

  uint public constant MIN_GAP_TIME = 24 * 60 * 60;

  /**
   * @notice The campaigns objects identifiable by their DripToken address.
   */
  struct Campaign {
    uint streamId;
    address option;
  }

  /**
   * @notice The campaigns objects identifiable by their DripToken address.
   */
  mapping(address => Campaign) private _campaigns;

  /**
   * @notice Pods entrypoint to create options.
   */
  address private immutable _configurationManager;

  /**
   * @notice Sablier stream creator
   */
  address private immutable _sablier;

  event CampaignCreated(address indexed creator, address campaignId);

  constructor(address configurationManager_, address sablier_) {
    _configurationManager = configurationManager_;
    _sablier = sablier_;
  }

  /**
   * @dev Returns the address of Pods ConfigurationManager used to create options.
   */
  function configurationManager() public view returns (address) {
    return _configurationManager;
  }

  /**
   * @dev Returns the address of Sablier master contract used to create streams.
   */
  function sablier() public view returns (address) {
    return _sablier;
  }

  /**
   * @dev Returns the Campaign associated with a DripToken.
   */
  function getCampaign(address drip) public view returns (Campaign memory) {
    return _campaigns[drip];
  }

  /**
   * @dev Create a campaign
   */
  function createCampaign(
    IERC20Metadata underlyingAsset,
    IERC20Metadata strikeAsset,
    uint campaignAmount,
    uint strikePrice,
    uint expiration,
    uint startTime,
    uint endTime
  ) public returns (address) {
    require(endTime - expiration > MIN_GAP_TIME, "invalid endTime");
    underlyingAsset.safeTransferFrom(msg.sender, address(this), campaignAmount);

    IPodOption option = _createOption(underlyingAsset, strikeAsset, strikePrice, expiration);
    underlyingAsset.approve(address(option), campaignAmount);
    option.mint(campaignAmount, address(this));

    DripToken drip = new DripToken(this);
    drip.mint(msg.sender, campaignAmount);

    option.approve(address(_sablier), campaignAmount);
    uint streamId = ISablier(_sablier).createStream(address(drip), campaignAmount, address(option), startTime, endTime);

    _campaigns[address(drip)] = Campaign({
      option : address(option),
      streamId : streamId
    });

    emit CampaignCreated(msg.sender, address(drip));
    return address(drip);
  }

  /**
   * @dev Create a Option on Pods Finance
   */
  function _createOption(
    IERC20Metadata underlyingAsset,
    IERC20Metadata strikeAsset,
    uint strikePrice,
    uint expiration
  ) internal returns (IPodOption) {
    IOptionFactory optionFactory = IOptionFactory(IConfigurationManager(_configurationManager).getOptionFactory());
    return IPodOption(
      optionFactory.createOption(
        string(abi.encodePacked(underlyingAsset.symbol(), " Call Option")),
        string(abi.encodePacked("Pod", underlyingAsset.symbol(), ":", strikeAsset.symbol())),
        IPodOption.OptionType.CALL,
        IPodOption.ExerciseType.AMERICAN,
        address(underlyingAsset),
        address(strikeAsset),
        strikePrice,
        expiration,
        0,
        false
      )
    );
  }
}
