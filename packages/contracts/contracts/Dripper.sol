pragma solidity >=0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IConfigurationManager, IOptionAMMFactory, IOptionFactory, IPodOption} from "../external/Pods.sol";
import {ISablier} from "../external/ISablier.sol";

contract Dripper {
    using SafeERC20 for IERC20Metadata;

    struct Vault {
        uint streamId;
        address option;
        address owner;
    }

    /**
     * @notice The vault objects identifiable by their unsigned integer ids.
     */
    mapping(uint => Vault) public vaults;

    /**
     * @notice Counter for new vault ids.
     */
    uint public nextVaultId;

    IConfigurationManager public immutable configurationManager;
    ISablier public immutable sablier;

    constructor(IConfigurationManager _configurationManager, ISablier _sablier) {
        configurationManager = _configurationManager;
        sablier = _sablier;
    }

    function createOption(
        IERC20Metadata underlyingAsset,
        IERC20Metadata strikeAsset,
        uint underlyingAmount,
        uint strikePrice,
        uint expiration,
        uint startTime,
        uint endTime
    ) public returns (uint vaultId) {
        underlyingAsset.safeTransferFrom(msg.sender, address(this), underlyingAmount);

        IPodOption option = _createOption(underlyingAsset, strikeAsset, strikePrice, expiration);
        option.mint(underlyingAmount, address(this));

        uint streamId = sablier.createStream(address(this), underlyingAmount, address(option), startTime, endTime);

        vaultId = nextVaultId;
        vaults[vaultId] = Vault({
            owner : msg.sender,
            option : address(option),
            streamId : streamId
        });

        nextVaultId++;
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

    //   function claim(uint256 amount, IDripToken drip) public return(bool) {
    //       // remove from stream
    //       sablier.withdrawFromStream(amount, drip.streamId);
    //
    //       strikeAsset.safeTransferFrom(msg.sender, address(this), underlyingAmount);
    //
    //       strikeAsset.approve(option.address, option.strikePrice * amount);
    //
    //       option.exercise(amount);
    //   }
}
