pragma solidity >=0.8.4;

interface ISablier {
    function createStream(
        address recipient, 
        uint256 deposit, 
        address tokenAddress, 
        uint256 startTime, 
        uint256 stopTime) external returns (uint256);
    function withdrawFromStream(uint256 streamId, uint256 amount) external returns (bool);
    function balanceOf(uint256 streamId, address who) external returns (uint256 balance);
    function getStream(uint256 streamId)
        external
        returns (
            address sender,
            address recipient,
            uint256 deposit,
            address tokenAddress,
            uint256 startTime,
            uint256 stopTime,
            uint256 remainingBalance,
            uint256 ratePerSecond
        );
}