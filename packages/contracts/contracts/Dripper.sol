pragma solidity >=0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IConfigurationManager, IOptionAMMFactory, IOptionFactory, IPodOption} from "../external/Pods.sol";
import {ISablier} from "../external/ISablier.sol";
import "./DripToken.sol";
import "./Types.sol";

contract Dripper {
    using SafeERC20 for IERC20;
    using SafeERC20 for IERC20Metadata;

    struct Campaign {
        uint streamId;
        address option;
        address owner;
    }

    /**
     * @notice The campaigns objects identifiable by their DripToken address.
     */
    mapping(address => Campaign) private _campaigns;

    IConfigurationManager public immutable configurationManager;
    ISablier public immutable sablier;

    constructor(IConfigurationManager _configurationManager, ISablier _sablier) {
        configurationManager = _configurationManager;
        sablier = _sablier;
    }

    function getCampaign(address drip) public view returns(Campaign memory) {
        return _campaigns[drip];
    }

    function createCampaign(
        IERC20Metadata underlyingAsset,
        IERC20Metadata strikeAsset,
        uint underlyingAmount,
        uint strikePrice,
        uint expiration,
        uint startTime,
        uint endTime
    ) public returns (address) {
        underlyingAsset.safeTransferFrom(msg.sender, address(this), underlyingAmount);

        IPodOption option = _createOption(underlyingAsset, strikeAsset, strikePrice, expiration);
        underlyingAsset.approve(address(option), underlyingAmount);
        option.mint(underlyingAmount, address(this));

        DripToken drip = new DripToken(this);
        uint streamId = sablier.createStream(address(drip), underlyingAmount, address(option), startTime, endTime);

        _campaigns[address(drip)] = Campaign({
            owner: msg.sender,
            option: address(option),
            streamId: streamId
        });

        drip.mint(msg.sender, underlyingAmount);
        return address(drip);
    }

    function _createOption(
        IERC20Metadata underlyingAsset,
        IERC20Metadata strikeAsset,
        uint strikePrice,
        uint expiration
    ) internal returns (IPodOption) {
        IOptionFactory optionFactory = IOptionFactory(configurationManager.getOptionFactory());
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

    function claim(DripToken dripToken, uint underlyingAmount) public {
        Campaign memory campaign = _campaigns[address(dripToken)];
        dripToken.burn(msg.sender, underlyingAmount);

        sablier.withdrawFromStream(underlyingAmount, campaign.streamId);

        IPodOption option = IPodOption(campaign.option);

        uint strikeToSend = option.strikePrice() * underlyingAmount;
        IERC20(option.strikeAsset()).safeTransferFrom(msg.sender, address(this), strikeToSend);
        IERC20(option.strikeAsset()).approve(campaign.option, strikeToSend);

        option.exercise(underlyingAmount);
        require(option.transfer(msg.sender, underlyingAmount), "DRIP_TRANSFER_FAILED");
    }
}
