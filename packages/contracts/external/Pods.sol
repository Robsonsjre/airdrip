pragma solidity >=0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IConfigurationManager {
    function getAMMFactory() external view returns (address);

    function getOptionFactory() external view returns (address);
}

interface IOptionAMMFactory {
    function createPool(
        address _optionAddress,
        address _stableAsset,
        uint256 _initialSigma
    ) external returns (address);

    function getPool(address _optionAddress) external view returns (address);
}

interface IPodOption is IERC20 {
    enum OptionType {PUT, CALL}
    enum ExerciseType {EUROPEAN, AMERICAN}

    function mint(uint256 amountOfOptions, address owner) external;

    function exercise(uint256 amountOfOptions) external;

    function withdraw() external;

    function unmint(uint256 amountOfOptions) external;

    function optionType() external view returns (OptionType);

    function exerciseType() external view returns (ExerciseType);

    function underlyingAsset() external view returns (address);

    function underlyingAssetDecimals() external view returns (uint8);

    function strikeAsset() external view returns (address);

    function strikeAssetDecimals() external view returns (uint8);

    function strikePrice() external view returns (uint256);

    function strikePriceDecimals() external view returns (uint8);

    function expiration() external view returns (uint256);

    function startOfExerciseWindow() external view returns (uint256);

    function hasExpired() external view returns (bool);

    function isTradeWindow() external view returns (bool);

    function isExerciseWindow() external view returns (bool);

    function isWithdrawWindow() external view returns (bool);

    function strikeToTransfer(uint256 amountOfOptions) external view returns (uint256);

    function getSellerWithdrawAmounts(address owner) external view returns (uint256 strikeAmount, uint256 underlyingAmount);

    function underlyingReserves() external view returns (uint256);

    function strikeReserves() external view returns (uint256);
}

interface IOptionFactory {
    function createOption(
        string memory name,
        string memory symbol,
        IPodOption.OptionType optionType,
        IPodOption.ExerciseType exerciseType,
        address underlyingAsset,
        address strikeAsset,
        uint256 strikePrice,
        uint256 expiration,
        uint256 exerciseWindowSize,
        bool hasRewards
    ) external returns (address);
}
