const getTimestamp = require('../test/utils/getTimestamp')

task('createCampaign', 'Deploy Dripper Contract')
  .addParam('dripper', 'Pods Configuration Address')
  .setAction(async ({ dripper }, hre) => {

    const timestamp = await getTimestamp()
    const dripperContract = await ethers.getContractAt('Dripper', dripper)

    const underlyingAsset = '0x82e358324C91d6360d08Da5f85c63C6d131955C8'

    const underlyingAssetContract = await ethers.getContractAt('MintableERC20', underlyingAsset)

    await underlyingAssetContract.approve(dripper, ethers.constants.MaxUint256)

    await dripperContract.createCampaign(
      underlyingAsset,
      '0xe22da380ee6b445bb8273c81944adeb6e8450422',
      '20000000000000000000',
      '1000000000000000000',
      timestamp + 60 * 60 * 24 * 3, // 3 days
      timestamp,
      timestamp + 60 * 60 * 24 * 3, // 3 days
    )
  })

  
