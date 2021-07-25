pragma solidity >=0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IConfigurationManager, IOptionAMMFactory, IOptionFactory} from "../external/Pods.sol";
import ISablier from "../external/ISablier.sol";

contract Dripper {
    using SafeERC20 for IERC20;

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
        IERC20 underlyingAsset,
        IERC20 strikeAsset,
        uint underlyingAmount,
        uint strikePrice,
        uint expiration,
        uint exerciseWindowSize,
        uint startTime,
        uint endTime
    ) public returns(uint vaultId) {
        underlyingAsset.safeTransferFrom(msg.sender, address(this), underlyingAmount);

        IOptionFactory optionFactory = IOptionFactory(configurationManager.getOptionFactory());
        IPodOption option = IPodOption(
            optionFactory.createOption(
                string(abi.encodePacked(token.symbol(), " Call Option")),
                string(abi.encodePacked("Pod", token.symbol(), ":", strikeAsset.symbol())),
                IPodOption.OptionType.CALL,
                IPodOption.ExerciseType.AMERICAN,
                address(underlyingAsset),
                address(strikeAsset),
                strikePrice,
                expiration,
                exerciseWindowSize,
                false
            )
        );

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

  function claim(uint256 amount, IDripToken drip) public return(bool) {
      // remove from stream
      timeLeftToEndStream = endOfStream - now;
      
      require() 


      sablier.withdrawFromStream(amount, drip.streamId);

      strikeAsset.safeTransferFrom(msg.sender, address(this), underlyingAmount);

      strikeAsset.approve(option.address, option.strikePrice * amount);

      option.exercise(amount);
  }
}


// scenario 1

// DAO => Sushi Call 10$ - 5 Years - Cliff (Start Date = Start Of Exercise Window)
// Lock 100 Sushi => Mint 100 drip Sushi Tokens
// Give to 1 user 

// Test 1 - User tries to claim before the Cliff (Stream start date) => Not Allowed
// Test 2 - User tries to claim more tokens than he eas => Burner Error
// Test 3 - Stream started - (10 days to stream, first day) => total stream allowed => 1/10
// Lets say an userA receives 70 dripTokens, userB recvs 30 dripTokens
//
// Total acceptable claim = 70/10 = 7 call options
//
// userA will try to claim 40 dripTokens, it will be able to receive only 40*1/10 => 4 call options
// then it will exercise 4 call options

// Repeat the proccess => again 40*1/10 => 4 call options (BREAK logic)


// Total acceptable claim = 70/10 = 7 call optionsL

// userA transfer 20 dripTokens to userC (userA clone wallet) 

// Total acceptable claim userA= 50/10 = 5 call options
// Total acceptable claim userC= 20/10 = 2 call options 

// userA claim 5 tokens => receives 5 call options
// userA new dripTokens balance = 45
// userA new acceptable claim = 45 / 10 = 4,5 options


// Everytime there is a claim, reduces the current claimable amount of that address
// Example

// userA has 70 dripTokens Balance
// userA claimable balance = 0
// userA claim 20 tokens (total allowed at this point in time is: 7) => Reverts
// userA claim 4 tokens (TAPT: 7) => 

// userA claimable balance = 4
// userA has 66

// userA tries to claim more 4
// userA TAPT: 6,6 - UCB (6,6 - 4 = 2,6) => Reverts
// userA send 66 tokens to userC 
// userA has 0
// userC has 66

// userC claimable = 66/10 = 6,6
// userC 

// 




